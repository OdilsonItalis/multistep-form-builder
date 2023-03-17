import { withApiAuth } from '@supabase/auth-helpers-nextjs';
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
    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();
      if (!user) throw Error('Could not get user');
      // const { data } = await supabaseAdmin
      //   .from('users')
      //   .select('referred_by')
      //   .eq('id', user.id)
      //   .single();
      // if (!data) throw Error('Could not get customer');
      // const { error } = await supabaseAdmin
      //   .from('users')
      //   .update({ referred_by: req.body.refcode })
      //   .eq('id', user.id);
      // if (error) throw error;
      // const { error: error2 } = await supabaseAdmin
      //   .from('users_location')
      //   .upsert({
      //     id: user.id,
      //     location: req.body.location
      //   });
      // if (error2) throw error2;
      return res
        .status(200)
        .json({ address: req.body.address, cookie: req.body.affiliate_code });
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
