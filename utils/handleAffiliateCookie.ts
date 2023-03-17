import { supabase } from './supabase-client';

export default async function handleAffiliateCookie(affiliateId: string) {
  const { data } = await supabase.from('users').select('*').single();
  if (data) {
    if (data.referred_by === null) {
      // here I might actually handle this via api route, because I don't know if I want to let users update their own records
      const { data: updateSuccess, error: updateError } = await supabase
        .from('users')
        .update({
          id: data.id,
          referred_by: affiliateId
        })
        .select();
      if (updateError) {
        console.log(updateError);
      }
    }
  }
}
