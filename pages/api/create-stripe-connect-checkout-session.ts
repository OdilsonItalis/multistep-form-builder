// Here I need to create a logic that checks if user is entitled to a discount - which usually means that they never trialled or cancelled their subscription or they have won a discount some other way like referred a friend won a competition or some other viable route created by me.

import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import {
  createOrRetrieveCustomer,
  createOrRetrieveStripeConnectCustomer
} from 'utils/supabase-admin';
import { getURL } from 'utils/helpers';
import Stripe from 'stripe';
import { Database } from 'types_db';

import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/utils/stripe';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default withApiAuth(async function createCheckoutSession(
  req,
  res,
  supabaseServerClient
) {
  if (req.method === 'POST') {
    const {
      priceId,
      quantity = 1,
      metadata = {}
    }: {
      priceId: string;
      quantity: number;
      metadata: Record<string, string>;
    } = req.body;

    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();

      // const customer = await createOrRetrieveCustomer({
      //   uuid: user?.id || '',
      //   email: user?.email || ''
      // });

      const { data: price } = await supabaseAdmin
        .from('prices')
        .select()
        .eq('id', priceId)
        .single();
      if (!price) throw Error('Price not found');

      const customer = await createOrRetrieveStripeConnectCustomer({
        uuid: user?.id || '',
        email: user?.email || '',
        stripeConnectAccountId: price?.stripe_account_id!
      });

      // create a function that passes the stripe service fee(2.9% + 30c) plus my platform fee(5%) to the customer so that the seller gets 100% of the price he initially set
      // 2.9% + 30c = 0.029 + 0.3 = 0.329

      const calculateTotalPrice = (price: number, quantity: number) => {
        const total = price * quantity;
        const serviceFee = total * 0.029 + 0.3;
        const platformFee = total * 0.05;
        const totalPrice = total + serviceFee + platformFee;
        return totalPrice;
      };

      //   get 10% of the price as integer (in cents)
      const applicationFeeAmount = Math.round((price.unit_amount! * 0.1) / 100);

      const session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ['card'],
          // billing_address_collection: 'required',
          customer,
          line_items: [
            {
              price: price.id,
              quantity
            }
          ],
          mode: 'subscription',
          allow_promotion_codes: true,

          subscription_data: {
            application_fee_percent: 10,
            metadata
          },
          success_url: `${getURL()}/account`,
          cancel_url: `${getURL()}/`
        },
        {
          stripeAccount: price.stripe_account_id!
        }
      );
      // const oneTimeProductSession = await stripe.checkout.sessions.create(
      //   {
      //     payment_method_types: ['card'],
      //     customer,
      //     payment_intent_data: {
      //       application_fee_amount: 100
      //     },
      //     line_items: [
      //       {
      //         price: 'price_1J9Z2pJZ2Z2Z2Z2Z2Z2Z2Z2Z',
      //         quantity
      //       }
      //     ],
      //     mode: 'payment',
      //     allow_promotion_codes: true,
      //     success_url: `${getURL()}/account`,
      //     cancel_url: `${getURL()}/`
      //   },
      //   {
      //     stripeAccount: price.stripe_account_id!
      //   }
      // );

      return res.status(200).json({ sessionId: session.id, url: session.url });
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
