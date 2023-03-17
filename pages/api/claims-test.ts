import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createOrRetrieveCustomer } from 'utils/supabase-admin';
import { getURL } from 'utils/helpers';
import { createClient } from '@supabase/supabase-js';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default withApiAuth(async function createCheckoutSession(
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
      // change users claims (role) to 'premium' as part of a POST to this API route

      //   const response = await supabaseServerClient.auth.admin.updateUserById(
      //     user.id,
      //     {
      //       app_metadata: {
      //         role: 'super-premium'
      //       }
      //     }
      //   );
      // this actually works
      const response = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        app_metadata: {
          role: 'mini-premium'
        }
      });

      return res
        .status(200)
        .json({ message: 'User role updated to premium', response });
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
