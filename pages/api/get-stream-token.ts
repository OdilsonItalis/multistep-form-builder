import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { StreamChat } from 'stream-chat';

export default withApiAuth(async function getStreamToken(
  req,
  res,
  supabaseServerClient
) {
  if (req.method === 'POST') {
    // this is the user id that we want to create a token for
    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();
      if (!user) throw Error('Could not get user');

      // // Define values.
      const api_key = '8uv5akjjns3u';
      const api_secret =
        'qk7uhryhes2j4fpjya9zy2vqq4a24a8qg5xx57naz3kphzwwqxn2f4ebydu7mm7j';

      // // Initialize a Server Client
      const serverClient = StreamChat.getInstance(api_key, api_secret);
      // // Create User Token
      const token = serverClient.createToken(user.id);

      return res.status(200).json({ token });
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
