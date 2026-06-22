import type { Product } from '../../entities/models';

export type Dish = {
  id: string;
  name: string;
  price: number;
  category: string;
  tags: string[];
  description: string;
  ingredients: string;
  weight: number;
  dailyQuantity: number;
  serveWith: string;
  images: string[];
};

export function productToDish(product: Product | null, fallbackCategory: string): Dish {
  return {
    id: product?.id ?? `dish-${Date.now()}`,
    name: product?.title ?? '',
    price: product?.price ?? 0,
    category: product?.category_id ?? fallbackCategory,
    tags: [
      ...(product?.is_hit ? ['Хит'] : []),
      ...(product?.is_popular ? ['Популярное'] : []),
      ...(product?.is_new ? ['Новинка'] : [])
    ],
    description: product?.description ?? '',
    ingredients: product?.ingredients ?? '',
    weight: Number.parseInt(product?.weight ?? '0', 10) || 0,
    dailyQuantity: product?.stock_count ?? 10,
    serveWith: product?.serving ?? 'с луком',
    images: product?.image_url ? [product.image_url] : []
  };
}

export function dishToProduct(dish: Dish, current: Product | null): Product {
  return {
    id: dish.id,
    title: dish.name,
    price: dish.price,
    description: dish.description,
    image_url: dish.images[0] ?? '',
    ingredients: dish.ingredients,
    weight: `${dish.weight} г`,
    spicy_level: current?.spicy_level ?? 0,
    serving: dish.serveWith,
    is_popular: dish.tags.includes('Популярное'),
    is_new: dish.tags.includes('Новинка'),
    is_hit: dish.tags.includes('Хит'),
    stock_count: dish.dailyQuantity,
    category_id: dish.category,
    drink_type: current?.drink_type,
    pair_ids: current?.pair_ids ?? []
  };
}
