import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createOrRetrieveStripeConnectCustomer } from 'utils/supabase-admin';
import { createClient } from '@supabase/supabase-js';
import { Database } from 'types_db';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default withApiAuth(async function createPaymentIntent(
  req,
  res,
  supabaseServerClient
) {
  if (req.method === 'POST') {
    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();
      if (!user) throw Error('Could not get user');

      const { price_id } = req.body;

      const { data: price, error } = await supabaseAdmin
        .from('prices')
        .select('*')
        .eq('id', price_id)
        .single();

      // here we do a check if customer has already subscribed to this product
      // if so, we return an error
      const productId = price?.product_id;

      const {
        data: subscriptions,
        error: errorSubscriptions,
        count
      } = await supabaseAdmin
        .from('subscriptions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (errorSubscriptions) throw Error(errorSubscriptions.message);
      if (count && count > 0)
        throw Error('You already subscribed to this product');

      if (error) throw Error(error.message);
      if (!price) throw Error('Could not get invoice');
      if (price.stripe_account_id === null)
        throw Error('Could not get stripe_account_id');

      // const customer = await createOrRetrieveCustomer({
      //   uuid: user?.id || '',
      //   email: user?.email || ''
      // });

      const customer = await createOrRetrieveStripeConnectCustomer({
        uuid: user.id,
        email: user.email || '',
        stripeConnectAccountId: price.stripe_account_id
      });

      // Create the subscription. Note we're expanding the Subscription's
      // latest invoice and that invoice's payment_intent
      // so we can pass it to the front end to confirm the payment
      const subscription = await stripe.subscriptions.create(
        {
          customer: customer,
          items: [
            {
              price: price_id
            }
          ],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          metadata: {
            user_id: user.id,
            subscribed_to: price.created_by,
            product_id: price.product_id,
            stripe_connect_account_id: price.stripe_account_id
          },
          expand: ['latest_invoice.payment_intent']
        },
        {
          stripeAccount: price.stripe_account_id
        }
      );

      // @ts-ignore
      if (!subscription.latest_invoice.payment_intent.client_secret) {
        throw Error('Could not get client_secret');
      }

      return res.status(200).json({
        // @ts-ignore TODO: double check this
        client_secret: subscription.latest_invoice.payment_intent.client_secret,
        subscription_id: subscription.id,
        stripe_account_id: price.stripe_account_id
      });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
});
