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

      if (data && data.stripe_connect_account_id) {
        // If the user already has a Stripe account, return the account link
        const accountLink = await stripe.accountLinks.create({
          account: data.stripe_connect_account_id,
          refresh_url: `${getURL()}/reauth`,
          return_url: `${getURL()}/stripe-onboarding-return`,
          type: 'account_onboarding'
        });

        return res.status(200).json({
          accountLink: accountLink,
          account: data,
          error: null,
          user: user,
          accountLinkUrl: accountLink.url,
          message: 'User already has a Stripe account'
        });
      }

      const account = await stripe.accounts.create({
        type: 'standard',
        email: user.email,
        metadata: {
          user_id: user.id
        }
        // capabilities: {
        //   card_payments: { requested: true },
        //   transfers: { requested: true }
        // }
      });

      const { error } = await supabaseAdmin
        .from('stripe_connect_accounts')
        .insert({
          user_id: user.id,
          stripe_connect_account_id: account.id
        });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${getURL()}/reauth`,
        return_url: `${getURL()}/stripe-onboarding-return`,
        type: 'account_onboarding'
      });

      return res.status(200).json({
        accountLink: accountLink,
        account: account,
        error: error,
        user: user,
        accountLinkUrl: accountLink.url,
        message: 'User does not have a Stripe account'
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
