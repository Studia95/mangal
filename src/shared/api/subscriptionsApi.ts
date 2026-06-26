import { supabase } from '../supabase';
import type { SubscriptionRow } from './platformTypes';

type SubscriptionQueryRow = {
  id: string;
  plan_code: string;
  amount: number | string | null;
  status: SubscriptionRow['status'];
  ends_at: string | null;
  clients?: { company_name?: string } | Array<{ company_name?: string }> | null;
};

export async function getSubscriptions(): Promise<SubscriptionRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('client_subscriptions')
    .select('id, plan_code, amount, status, ends_at, clients(company_name)')
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) return [];

  return ((data ?? []) as SubscriptionQueryRow[]).map((row) => ({
    id: row.id,
    clientName: (Array.isArray(row.clients) ? row.clients[0]?.company_name : row.clients?.company_name) ?? 'Клиент',
    planCode: row.plan_code,
    amount: Number(row.amount ?? 0),
    status: row.status,
    endsAt: row.ends_at
  }));
}
