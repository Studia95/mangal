import { supabase } from '../supabase';

export async function isPlatformAdminSession() {
  if (!supabase) return true;

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return false;

  const { data, error } = await supabase.rpc('is_platform_admin');
  if (error) return false;
  return Boolean(data);
}

export async function signOutPlatformAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
