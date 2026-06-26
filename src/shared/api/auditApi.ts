import { supabase } from '../supabase';
import type { AuditLogEntry } from './platformTypes';

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('audit_logs')
    .select('id, action, created_at, payload')
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    action: row.action,
    actorEmail: row.payload?.actor_email ?? '',
    clientName: row.payload?.client_name ?? '',
    createdAt: row.created_at
  }));
}
