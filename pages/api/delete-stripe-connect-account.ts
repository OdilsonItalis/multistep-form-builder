import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createOrRetrieveCustomer } from 'utils/supabase-admin';
import { getURL } from 'utils/helpers';
import { createClient } from '@supabase/supabase-js';

import Stripe from 'stripe';
import { Database } from 'types_db';
import { stripe } from '@/utils/stripe';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default withApiAuth(async function createStripeConnectAccount(
  req,
  res,
  supabaseServerClient
) {
  if (req.method === 'POST') {
    const { price, quantity = 1, metadata = {} } = req.body;

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

      if (!data) {
        throw new Error('Nothing to delete');
      }

      const deleted = await stripe.accounts.del(
        data.stripe_connect_account_id!
      );
      //   const deleted = await stripe.accounts.del('acct_1MU0OFRIuOqIp068');
      return res.status(200).json({ deleted });
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
