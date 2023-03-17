import { stripe } from '@/utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { Database } from 'types_db';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default withApiAuth(async function createStripeConnectProduct(
  req,
  res,
  supabaseServerClient
) {
  if (req.method === 'POST') {
    const {
      product_name,
      features,
      product_id,
      default_price_id,
      promo_price_id,
      offer_valid_until,
      value_description
    } = req.body;

    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();

      if (!user) {
        throw new Error('User not found');
      }
      const { data: stripeAccount } = await supabaseAdmin
        .from('stripe_connect_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!stripeAccount) {
        throw new Error('You are not authorized to create a product');
      }
      const productRetrieved = await stripe.products.retrieve(
        product_id,
        undefined,
        {
          stripeAccount: stripeAccount.stripe_connect_account_id
        }
      );
      //   checks if product belongs to user
      if (productRetrieved.metadata.user_id !== user.id) {
        throw new Error('You are not authorized to update this product');
      }
      const productUpdated = await stripe.products.update(
        product_id,
        {
          name: product_name,
          // @ts-ignore - I don't know why typescript complains here, TODO: fix
          default_price: default_price_id
        },
        {
          stripeAccount: stripeAccount.stripe_connect_account_id
        }
      );
      // this is a check that runs if promo price is provided, it basically checks that the promo price and default price have the same currency, interval and interval_count
      if (promo_price_id) {
        const promoPriceObject = await stripe.prices.retrieve(promo_price_id, {
          stripeAccount: stripeAccount.stripe_connect_account_id
        });

        const defaultPriceObject = await stripe.prices.retrieve(
          default_price_id,
          {
            stripeAccount: stripeAccount.stripe_connect_account_id
          }
        );

        // checks if both promoPrice and defaultPrice are the same currency, interval and interval_count
        if (
          promoPriceObject.currency !== defaultPriceObject.currency ||
          promoPriceObject.recurring?.interval !==
            defaultPriceObject.recurring?.interval ||
          promoPriceObject.recurring?.interval_count !==
            defaultPriceObject.recurring?.interval_count
        ) {
          throw new Error(
            'The default price and promo price must have the same currency, interval and interval_count'
          );
        }
      }

      const { error } = await supabaseAdmin
        .from('products')
        .update({
          name: product_name,
          features: features,
          default_price: default_price_id,
          value_description: value_description,
          ...(promo_price_id && { offer_price_id: promo_price_id }),
          ...(offer_valid_until && { offer_valid_until: offer_valid_until })
        })
        .eq('id', product_id)
        .eq('created_by', user.id);

      return res.status(200).json({ message: 'success' });
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
