import { Beef, Coffee, Flame, Pizza, Soup } from 'lucide-react';
import type { Category } from '../../entities/models';

const categoryIcons = {
  grill: Flame,
  chechen: Soup,
  pizza: Pizza,
  fastfood: Beef,
  fridge: Coffee,
  lemonades: Coffee,
  tea: Coffee
};

export function CategorySelector({
  categories,
  value,
  onChange
}: {
  categories: Category[];
  value: string;
  onChange: (category: string) => void;
}) {
  return (
    <section className="dish-section">
      <h3>Категория</h3>
      <div className="dish-category-chips">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id as keyof typeof categoryIcons] ?? Soup;
          return (
            <button
              className={value === category.id ? 'dish-chip is-active' : 'dish-chip'}
              type="button"
              key={category.id}
              onClick={() => onChange(category.id)}
            >
              <Icon />
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
