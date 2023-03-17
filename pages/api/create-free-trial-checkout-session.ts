// Here I need to create a logic that checks if user is entitled to a discount - which usually means that they never trialled or cancelled their subscription or they have won a discount some other way like referred a friend won a competition or some other viable route created by me.

import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createOrRetrieveCustomer } from 'utils/supabase-admin';
import { getURL } from 'utils/helpers';
import { createClient } from '@supabase/supabase-js';
import { Database } from 'types_db';

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
    const { quantity = 1, metadata = {} } = req.body;

    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();

      // let { data, error, count } = await supabaseAdmin
      //   .from('premium_members')
      //   .select('*', { count: 'exact' })
      //   // Filters
      //   .eq('user_id', user?.id)
      //   .limit(1)
      //   .single();
      // if (error) {
      //   throw new Error(`${error.message}: ${error.details}`);
      // }
      // if (data) {
      //   // throw error that this user already trialled or is a premium member
      //   throw new Error('User already trialled or is a premium member');
      // }

      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer,
        line_items: [
          {
            price: 'price_1ML7bvIL0HJB3ySi34gYimeo', // this is free trial price id
            quantity
          }
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          metadata
        },
        success_url: `${getURL()}/trial-success`,
        cancel_url: `${getURL()}/`
      });

      return res.status(200).json({ sessionId: session.id });
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
