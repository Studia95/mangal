import { supabase } from '../supabase';
import type { PlatformTemplateOption } from './platformTypes';

const fallbackTemplates: PlatformTemplateOption[] = [
  {
    templateVersionId: '00000000-0000-4000-8000-000000000002',
    templateKey: 'restaurant-modern',
    templateName: 'Restaurant Modern',
    businessType: 'restaurant',
    version: 2,
    description: 'Ресторанный шаблон каталога, который используется для Мангал.'
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

  const restaurantTemplates = (data as TemplateVersionRow[])
    .map((row) => ({
      templateVersionId: row.id,
      templateKey: row.templates?.key ?? 'restaurant-modern',
      templateName: row.templates?.name ?? 'Template',
      businessType: row.templates?.business_type ?? 'restaurant',
      version: row.version,
      description: row.templates?.description ?? ''
    }))
    .filter((template) => template.templateKey === 'restaurant-modern')
    .sort((first, second) => second.version - first.version);

  return restaurantTemplates.slice(0, 1);
}
