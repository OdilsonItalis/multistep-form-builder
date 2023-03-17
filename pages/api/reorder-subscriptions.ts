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
      products
    }: {
      products: Database['public']['Tables']['products']['Row'][];
    } = req.body;

    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();
      if (!user) {
        throw new Error('User not found');
      }

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const { error } = await supabaseAdmin
          .from('products')
          .update({ order_number: i + 1 })
          .eq('id', product.id)
          .eq('created_by', user.id)
          .single();
        if (error) {
          throw new Error(error.message);
        }
      }

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
