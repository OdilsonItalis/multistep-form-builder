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
      product_name,
      currency,
      billing_period,
      billing_interval,
      description,
      features,
      value_description
    }: {
      price_in_cents: number;
      product_name: string;
      currency: string;
      billing_period: Stripe.Price.Recurring.Interval;
      billing_interval: number;
      description: string;
      features: string[];
      value_description: string;
    } = req.body;

    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();

      if (!user) {
        throw new Error('User not found');
      }
      if (!user?.email) {
        throw new Error('User email not found');
      }
      const { data } = await supabaseAdmin
        .from('stripe_connect_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!data || !data.stripe_connect_account_id) {
        throw new Error('You are not authorized to create a product');
      }

      const metadata = {
        user_id: user.id,
        stripe_account_id: data.stripe_connect_account_id,
        stripe_connect: 'true'
      };

      const product = await stripe.products.create(
        {
          name: product_name,
          metadata
        },
        {
          stripeAccount: data.stripe_connect_account_id
        }
      );

      const price = await stripe.prices.create(
        {
          unit_amount: price_in_cents,
          currency: currency,
          recurring: {
            interval: billing_period,
            interval_count: billing_interval
          },
          product: product.id,
          metadata
        },
        {
          stripeAccount: data.stripe_connect_account_id
        }
      );

      const { data: productData, error: productError } = await supabaseAdmin
        .from('products')
        .insert({
          created_by: user.id,
          id: product.id,
          name: product.name,
          metadata,
          stripe_account_id: data.stripe_connect_account_id,
          stripe_connect_product: true,
          description: description,
          features,
          value_description
        });

      if (productError) {
        throw new Error(productError.message);
      }

      const { data: priceData, error: priceError } = await supabaseAdmin
        .from('prices')
        .insert({
          created_by: user.id,
          id: price.id,
          product_id: product.id,
          unit_amount: price.unit_amount,
          currency: 'usd',
          interval: 'month',
          type: 'recurring',
          metadata,
          stripe_account_id: data.stripe_connect_account_id,
          stripe_connect_price: true,
          interval_count: billing_interval
        });

      if (priceError) {
        throw new Error(priceError.message);
      }

      const { data: productUpdated, error: productUpdationError } =
        await supabaseAdmin
          .from('products')
          .update({ default_price: price.id })
          .eq('id', product.id);

      if (productUpdationError) {
        throw new Error(productUpdationError.message);
      }

      return res
        .status(200)
        .json({ productData, product, priceData, priceError, productError });
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
