import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default withApiAuth(async function handleEditProfile(
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

      const {
        image
      }: {
        image: string | null;
      } = req.body;

      if (!image) {
        return res.status(400).json({
          message: 'No image provided'
        });
      }

      let base64String = image.split(';base64,').pop();
      let inputBuffer = base64String && Buffer.from(base64String, 'base64');

      if (inputBuffer) {
        const smallThumbnail = await sharp(inputBuffer)
          .jpeg()
          .resize({ height: 150, width: 150 })
          .toBuffer();
        const regularThumbnail = await sharp(inputBuffer)
          .jpeg()
          .resize({ height: 320, width: 320 })
          .toBuffer();
        const { data: data1 } = await supabaseAdmin.storage
          .from('user-content')
          .upload(`${user.id}/avatar-photos/avatar.jpeg`, inputBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });
        const { data: data2 } = await supabaseAdmin.storage
          .from('user-content')
          .upload(
            `${user.id}/avatar-photos/avatar_150x150.jpeg`,
            smallThumbnail,
            {
              contentType: 'image/jpeg',
              upsert: true
            }
          );
        const { data: data3 } = await supabaseAdmin.storage
          .from('user-content')
          .upload(
            `${user.id}/avatar-photos/avatar_320x320.jpeg`,
            regularThumbnail,
            {
              contentType: 'image/jpeg',
              upsert: true
            }
          );

        const { data, error: updateUsersAvatarsError } = await supabaseAdmin
          .from('users')
          .update({
            avatar_url: `https://${process.env.NEXT_PUBLIC_SUPABASE_REFERENCE_ID}.supabase.co/storage/v1/object/public/user-content/${data1?.path}`,
            avatar_url_150x150: `https://${process.env.NEXT_PUBLIC_SUPABASE_REFERENCE_ID}.supabase.co/storage/v1/object/public/user-content/${data2?.path}`,
            avatar_url_320x320: `https://${process.env.NEXT_PUBLIC_SUPABASE_REFERENCE_ID}.supabase.co/storage/v1/object/public/user-content/${data3?.path}`
          })
          .eq('id', user.id);
        if (updateUsersAvatarsError)
          throw Error(updateUsersAvatarsError.message);
        return res.status(200).json({
          message: 'success'
        });
      } else {
        return res.status(400).json({
          message: 'No image found'
        });
      }
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
