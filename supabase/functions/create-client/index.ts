import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

type CreateClientPayload = {
  name: string;
  slug: string;
  ownerName?: string;
  email: string;
  phone?: string;
  password: string;
  templateVersionId: string;
  businessType: string;
  planId?: string;
  subscriptionEndsAt?: string;
  status?: 'active' | 'inactive' | 'blocked' | 'pending';
  subscriptionStatus?: 'trial' | 'active' | 'past_due' | 'expired' | 'cancelled';
  adminConsentConfirmed?: boolean;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    const record = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
    const parts = [record.message, record.details, record.hint, record.code]
      .filter((value): value is string => typeof value === 'string' && value.length > 0);
    if (parts.length > 0) return parts.join(' ');
  }
  return 'Unknown error';
};

const isStrongPassword = (value: string) =>
  value.length >= 10 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /\d/.test(value) &&
  /[!@#$%&*+\-_]/.test(value);

const assertPayload = (payload: CreateClientPayload) => {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!payload.name?.trim() || payload.name.trim().length < 2) throw new Error('Client name is required.');
  if (!slugPattern.test(payload.slug) || payload.slug.length < 3 || payload.slug.length > 63) {
    throw new Error('Slug is invalid.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) throw new Error('Email is invalid.');
  if (!isStrongPassword(payload.password)) throw new Error('Password is too weak.');
  if (!payload.templateVersionId) throw new Error('Template version is required.');
  if (!payload.adminConsentConfirmed) throw new Error('Client consent confirmation is required.');
};

const image = (id: string, query: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=78&${query}`;

const seedCategories = [
  { slug: 'chechen', name: 'Чеченские блюда', imageUrl: image('photo-1547592166-23ac45744acd', 'soup'), icon: 'pot' },
  { slug: 'pizza', name: 'Пиццы', imageUrl: image('photo-1604382354936-07c5d9983bd3', 'pizza'), icon: 'pizza' },
  { slug: 'fastfood', name: 'Фастфуд', imageUrl: image('photo-1568901346375-23c9450c58cd', 'burger'), icon: 'burger' },
  { slug: 'grill', name: 'Мясо', imageUrl: image('photo-1558030006-450675393462', 'kebab'), icon: 'flame' },
  { slug: 'fridge', name: 'Напитки из холодильника', imageUrl: image('photo-1622483767028-3f66f32aef97', 'soda'), icon: 'bottle' },
  { slug: 'lemonades', name: 'Лимонады в графине', imageUrl: image('photo-1621263764928-df1444c5e859', 'lemonade'), icon: 'glass' },
  { slug: 'tea', name: 'Чай', imageUrl: image('photo-1544787219-7f47ccb76574', 'tea'), icon: 'tea' },
  { slug: 'cabins', name: 'Кабинки', imageUrl: image('photo-1517248135467-4c7edcad34c4', 'restaurant'), icon: 'home' }
];

const seedProducts = [
  {
    slug: 'lamb-skewer',
    title: 'Шашлык из баранины',
    price: 690,
    description: 'Сочный шашлык из баранины с пряными специями и луком.',
    imageUrl: image('photo-1555939594-58d7cb561ad1', 'skewers'),
    ingredients: 'Баранина, специи, лук, соль, перец',
    weight: '250 г',
    serving: 'с луком и соусом',
    stockCount: 12,
    categorySlug: 'grill',
    isPopular: true,
    isNew: false,
    isPromo: true
  },
  {
    slug: 'zhizhig-galnash',
    title: 'Жижиг-галнаш',
    price: 380,
    description: 'Традиционный чеченский суп с галушками из теста.',
    imageUrl: image('photo-1547592166-23ac45744acd', 'soup'),
    ingredients: 'Говядина, галушки, бульон, зелень',
    weight: '420 г',
    serving: 'с чесночным соусом',
    stockCount: 8,
    categorySlug: 'chechen',
    isPopular: true,
    isNew: false,
    isPromo: false
  },
  {
    slug: 'four-seasons',
    title: 'Четыре сезона',
    price: 550,
    description: 'Пицца с ветчиной, грибами, оливками и артишоками.',
    imageUrl: image('photo-1604382354936-07c5d9983bd3', 'pizza'),
    ingredients: 'Тесто, сыр, томаты, ветчина, грибы, оливки',
    weight: '520 г',
    serving: 'с томатным соусом',
    stockCount: 9,
    categorySlug: 'pizza',
    isPopular: true,
    isNew: false,
    isPromo: false
  },
  {
    slug: 'shawarma-combo',
    title: 'Комбо шаурма',
    price: 400,
    description: 'Шаурма с сочным мясом, овощами и картофелем.',
    imageUrl: image('photo-1529006557810-274b9b2fc783', 'wrap'),
    ingredients: 'Курица, лаваш, овощи, картофель, соус',
    weight: '360 г',
    serving: 'с картофелем',
    stockCount: 16,
    categorySlug: 'fastfood',
    isPopular: true,
    isNew: true,
    isPromo: false
  },
  {
    slug: 'bone-steak',
    title: 'Стейк на косточке',
    price: 1390,
    description: 'Сочный стейк из говядины на кости.',
    imageUrl: image('photo-1544025162-d76694265947', 'steak'),
    ingredients: 'Говядина, соль, перец, розмарин',
    weight: '430 г',
    serving: 'с перечным соусом',
    stockCount: 5,
    categorySlug: 'grill',
    isPopular: false,
    isNew: false,
    isPromo: true
  },
  {
    slug: 'coca-cola',
    title: 'Coca-Cola',
    price: 120,
    description: 'Классический освежающий вкус.',
    imageUrl: image('photo-1629203851122-3726ecdf080e', 'cola'),
    ingredients: 'Газированный напиток',
    weight: '330 мл',
    serving: 'охлажденная',
    stockCount: 20,
    categorySlug: 'fridge',
    isPopular: false,
    isNew: false,
    isPromo: false
  },
  {
    slug: 'chechen-tea',
    title: 'Чеченский чай',
    price: 200,
    description: 'Душистый зеленый чай с чабрецом и горными травами.',
    imageUrl: image('photo-1544787219-7f47ccb76574', 'tea'),
    ingredients: 'Зеленый чай, чабрец, травы',
    weight: '450 мл',
    serving: 'в чайнике',
    stockCount: 30,
    categorySlug: 'tea',
    isPopular: true,
    isNew: false,
    isPromo: false
  },
  {
    slug: 'strawberry-lemonade',
    title: 'Клубничный лимонад',
    price: 220,
    description: 'Освежающий лимонад с клубникой и мятой.',
    imageUrl: image('photo-1513558161293-cdaf765ed2fd', 'strawberry lemonade'),
    ingredients: 'Клубника, лимон, мята, содовая',
    weight: '450 мл',
    serving: 'со льдом',
    stockCount: 10,
    categorySlug: 'lemonades',
    isPopular: true,
    isNew: true,
    isPromo: false
  }
];

const seedCabins = [
  { title: 'Кабинка №1', capacity: 4, imageUrl: image('photo-1514933651103-005eec06c04b', 'private dining') },
  { title: 'Кабинка №2', capacity: 4, imageUrl: image('photo-1559329007-40df8a9345d8', 'restaurant booth') },
  { title: 'Большая кабинка', capacity: 10, imageUrl: image('photo-1544148103-0773bf10d330', 'large restaurant table') }
];

async function seedRestaurantCatalog(adminClient: ReturnType<typeof createClient>, catalogId: string) {
  const { data: categories, error: categoriesError } = await adminClient
    .from('categories')
    .insert(
      seedCategories.map((category, index) => ({
        catalog_id: catalogId,
        slug: category.slug,
        name: category.name,
        image_url: category.imageUrl,
        icon: category.icon,
        sort_order: index * 10
      }))
    )
    .select('id, slug');
  if (categoriesError || !categories) throw categoriesError ?? new Error('Could not seed categories.');

  const categoryIds = new Map<string, string>();
  (categories as Array<{ id: string; slug: string }>).forEach((category) => {
    categoryIds.set(category.slug, category.id);
  });

  for (const [index, product] of seedProducts.entries()) {
    const { data: createdProduct, error: productError } = await adminClient
      .from('products')
      .insert({
        catalog_id: catalogId,
        category_id: categoryIds.get(product.categorySlug) ?? null,
        slug: product.slug,
        title: product.title,
        status: 'active',
        price: product.price,
        description: product.description,
        ingredients: product.ingredients,
        weight: product.weight,
        serving: product.serving,
        stock_count: product.stockCount,
        is_popular: product.isPopular,
        is_new: product.isNew,
        is_promo: product.isPromo,
        sort_order: index * 10
      })
      .select('id')
      .single();
    if (productError || !createdProduct) throw productError ?? new Error('Could not seed product.');

    const { error: imageError } = await adminClient.from('product_images').insert({
      catalog_id: catalogId,
      product_id: createdProduct.id,
      url: product.imageUrl,
      alt: product.title,
      sort_order: 0
    });
    if (imageError) throw imageError;
  }

  const { error: cabinsError } = await adminClient.from('bookable_resources').insert(
    seedCabins.map((cabin, index) => ({
      catalog_id: catalogId,
      title: cabin.title,
      capacity: cabin.capacity,
      image_url: cabin.imageUrl,
      sort_order: index * 10
    }))
  );
  if (cabinsError) throw cabinsError;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('CATALOGG_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: 'Supabase function secrets are not configured.' }, 500);
  }

  const authHeader = request.headers.get('Authorization') ?? '';
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } }
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const { data: isPlatformAdmin, error: adminCheckError } = await userClient.rpc('is_platform_admin');
    if (adminCheckError || !isPlatformAdmin) {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }

    const payload = (await request.json()) as CreateClientPayload;
    payload.email = payload.email.trim().toLowerCase();
    payload.name = payload.name.trim();
    payload.slug = payload.slug.trim().toLowerCase();
    assertPayload(payload);

    const [
      { data: existingClientByEmail, error: existingClientError },
      { data: existingCatalogBySlug, error: existingCatalogError },
      { data: templateVersion, error: templateVersionError }
    ] =
      await Promise.all([
        adminClient.from('clients').select('id').eq('email', payload.email).maybeSingle(),
        adminClient.from('catalogs').select('id').eq('slug', payload.slug).maybeSingle(),
        adminClient
          .from('template_versions')
          .select('id, status, templates(key)')
          .eq('id', payload.templateVersionId)
          .eq('status', 'published')
          .maybeSingle()
      ]);

    if (existingClientError) throw existingClientError;
    if (existingCatalogError) throw existingCatalogError;
    if (templateVersionError) throw templateVersionError;
    if (existingClientByEmail) throw new Error('Email already exists.');
    if (existingCatalogBySlug) throw new Error('Slug already exists.');
    if (!templateVersion) throw new Error('Template version is not available.');
    if ((templateVersion.templates as { key?: string } | null)?.key !== 'restaurant-modern') {
      throw new Error('Only the restaurant-modern template is available for new clients.');
    }

    const { data: createdUser, error: createUserError } = await adminClient.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        full_name: payload.ownerName ?? payload.name,
        company_name: payload.name
      }
    });
    if (createUserError || !createdUser.user) {
      throw createUserError ?? new Error('Could not create user.');
    }

    const ownerUserId = createdUser.user.id;
    let catalogId: string | null = null;
    let clientId: string | null = null;

    try {
      const { error: actorProfileError } = await adminClient.from('profiles').upsert({
        id: userData.user.id,
        email: userData.user.email ?? '',
        full_name: userData.user.user_metadata?.full_name ?? ''
      });
      if (actorProfileError) throw actorProfileError;

      const { error: profileError } = await adminClient.from('profiles').upsert({
        id: ownerUserId,
        email: payload.email,
        full_name: payload.ownerName ?? ''
      });
      if (profileError) throw profileError;

      const { data: catalog, error: catalogError } = await adminClient
        .from('catalogs')
        .insert({
          template_version_id: payload.templateVersionId,
          slug: payload.slug,
          name: payload.name,
          status: payload.status === 'inactive' || payload.status === 'blocked' ? 'draft' : 'published',
          created_by: userData.user.id
        })
        .select('id, slug')
        .single();
      if (catalogError || !catalog) throw catalogError ?? new Error('Could not create catalog.');
      catalogId = catalog.id;

      const { error: memberError } = await adminClient.from('catalog_members').insert({
        catalog_id: catalog.id,
        user_id: ownerUserId,
        role: 'owner'
      });
      if (memberError) throw memberError;

      const { error: themeError } = await adminClient.from('catalog_theme_settings').insert({
        catalog_id: catalog.id,
        settings: {}
      });
      if (themeError) throw themeError;

      const { error: sectionsError } = await adminClient.from('catalog_sections').insert([
        { catalog_id: catalog.id, key: 'hero', title: 'Главная', sort_order: 10 },
        { catalog_id: catalog.id, key: 'categories', title: 'Категории', sort_order: 20 },
        { catalog_id: catalog.id, key: 'products', title: 'Все позиции', sort_order: 30 },
        { catalog_id: catalog.id, key: 'contacts', title: 'Контакты', sort_order: 40 }
      ]);
      if (sectionsError) throw sectionsError;

      await seedRestaurantCatalog(adminClient, catalog.id);

      const { data: client, error: clientError } = await adminClient
        .from('clients')
        .insert({
          owner_user_id: ownerUserId,
          catalog_id: catalog.id,
          company_name: payload.name,
          owner_name: payload.ownerName ?? '',
          email: payload.email,
          phone: payload.phone ?? '',
          status: payload.status ?? 'active',
          plan_code: payload.planId ?? 'trial',
          subscription_status: payload.subscriptionStatus ?? 'trial',
          subscription_ends_at: payload.subscriptionEndsAt || null,
          first_login: true,
          consent_given: false,
          consent_source: null,
          admin_consent_confirmed: true,
          admin_consent_confirmed_at: new Date().toISOString(),
          admin_consent_actor_id: userData.user.id,
          created_by: userData.user.id
        })
        .select('id')
        .single();
      if (clientError || !client) throw clientError ?? new Error('Could not create client.');
      clientId = client.id;

      const { error: subscriptionError } = await adminClient.from('client_subscriptions').insert({
        client_id: client.id,
        plan_code: payload.planId ?? 'trial',
        status: payload.subscriptionStatus ?? 'trial',
        started_at: new Date().toISOString(),
        ends_at: payload.subscriptionEndsAt || null
      });
      if (subscriptionError) throw subscriptionError;

      const { error: auditError } = await adminClient.from('audit_logs').insert({
        catalog_id: catalog.id,
        actor_id: userData.user.id,
        action: 'client.created',
        entity_table: 'clients',
        entity_id: client.id,
        payload: {
          client_name: payload.name,
          actor_email: userData.user.email,
          owner_email: payload.email
        }
      });
      if (auditError) throw auditError;

      return jsonResponse({
        clientId: client.id,
        catalogId: catalog.id,
        slug: catalog.slug,
        email: payload.email
      });
    } catch (error) {
      if (clientId) {
        await adminClient.from('clients').delete().eq('id', clientId);
      }
      if (catalogId) {
        await adminClient.from('catalogs').delete().eq('id', catalogId);
      }
      await adminClient.auth.admin.deleteUser(ownerUserId);
      throw error;
    }
  } catch (error) {
    const message = getErrorMessage(error);
    return jsonResponse({ error: message }, 400);
  }
});
