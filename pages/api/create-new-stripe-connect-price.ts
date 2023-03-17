import { stripe } from '@/utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

import Stripe from 'stripe';
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
      price_in_cents,
      product_id,
      currency,
      billing_period,
      billing_interval
    } = req.body;

    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();

      if (!user) {
        throw new Error('User not found');
      }
      const { data } = await supabaseAdmin
        .from('stripe_connect_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!data) {
        throw new Error('You are not authorized to create a price');
      }

      const metadata = {
        user_id: user.id,
        stripe_account_id: data.stripe_connect_account_id,
        stripe_connect: 'true'
      };

      const price = await stripe.prices.create(
        {
          unit_amount: price_in_cents,
          currency: currency,
          recurring: {
            interval: billing_period,
            interval_count: billing_interval
          },
          product: product_id,
          metadata
        },
        {
          stripeAccount: data.stripe_connect_account_id
        }
      );

      const { data: priceData, error: priceError } = await supabaseAdmin
        .from('prices')
        .insert({
          created_by: user.id,
          id: price.id,
          product_id: product_id,
          unit_amount: price.unit_amount!, // why stripe thinks that this can be null? TODO: find out
          currency: currency,
          interval: billing_period,
          interval_count: billing_interval,
          metadata,
          stripe_account_id: data.stripe_connect_account_id,
          stripe_connect_price: true
        });

      return res.status(200).json({ priceData, priceError });
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
