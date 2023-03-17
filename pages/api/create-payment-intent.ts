import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import {
  createOrRetrieveCustomer,
  createOrRetrieveStripeConnectCustomer
} from 'utils/supabase-admin';
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

      const { invoice_id } = req.body;

      // get invoice from supabase
      const { data: invoice, error } = await supabaseAdmin
        .from('invoices')
        .select('*')
        .eq('id', invoice_id)
        .single();

      if (error) throw Error(error.message);
      if (!invoice) throw Error('Could not get invoice');

      const { data: stripe_account, error: stripeConnectAccountError } =
        await supabaseAdmin
          .from('stripe_connect_accounts')
          .select('*')
          .eq('user_id', invoice.created_by)
          .single();

      if (stripeConnectAccountError)
        throw Error(stripeConnectAccountError.message);

      // const customer = await createOrRetrieveCustomer({
      //   uuid: user?.id || '',
      //   email: user?.email || ''
      // });

      const customer = await createOrRetrieveStripeConnectCustomer({
        uuid: user?.id || '',
        email: user?.email || '',
        // TODO: check why would this be null
        stripeConnectAccountId: stripe_account.stripe_connect_account_id!
      });

      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: invoice.unit_amount,
          currency: invoice.currency,
          customer,
          automatic_payment_methods: { enabled: true },
          metadata: {
            invoice_id: invoice.id.toString()
          }
        },
        {
          stripeAccount: stripe_account.stripe_connect_account_id!
        }
      );

      if (!paymentIntent) throw Error('Could not get paymentIntent');

      return res.status(200).json({
        client_secret: paymentIntent.client_secret,
        stripe_connect_account_id: stripe_account.stripe_connect_account_id
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
