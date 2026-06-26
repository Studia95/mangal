import { supabase } from '../supabase';
import type { PlatformTemplateOption } from './platformTypes';

const fallbackTemplates: PlatformTemplateOption[] = [
  {
    templateVersionId: '00000000-0000-4000-8000-000000000001',
    templateKey: 'restaurant-modern',
    templateName: 'Restaurant Modern',
    businessType: 'restaurant',
    version: 1,
    description: 'Современный шаблон ресторана и кафе.'
  },
  {
    templateVersionId: '00000000-0000-4000-8000-000000000002',
    templateKey: 'barbershop-dark',
    templateName: 'Barbershop Dark',
    businessType: 'barbershop',
    version: 1,
    description: 'Тёмный шаблон для барбершопа и салона.'
  },
  {
    templateVersionId: '00000000-0000-4000-8000-000000000003',
    templateKey: 'menswear-premium',
    templateName: 'Menswear Premium',
    businessType: 'shop',
    version: 1,
    description: 'Премиальный шаблон магазина одежды.'
  }
];

type TemplateVersionRow = {
  id: string;
  version: number;
  status: string;
  templates?: {
    key?: string;
    name?: string;
    business_type?: string;
    description?: string;
  } | null;
};

export async function getTemplateOptions(): Promise<PlatformTemplateOption[]> {
  if (!supabase) return fallbackTemplates;

  const { data, error } = await supabase
    .from('template_versions')
    .select('id, version, status, templates(key, name, business_type, description)')
    .eq('status', 'published')
    .order('version', { ascending: false });

  if (error) throw error;
  if (!data?.length) return [];

  return (data as TemplateVersionRow[]).map((row) => ({
    templateVersionId: row.id,
    templateKey: row.templates?.key ?? 'restaurant-modern',
    templateName: row.templates?.name ?? 'Template',
    businessType: row.templates?.business_type ?? 'restaurant',
    version: row.version,
    description: row.templates?.description ?? ''
  }));
}
