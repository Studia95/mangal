import type { FormEvent } from 'react';
import { CategorySelector } from './CategorySelector';
import { PhotoUploader } from './PhotoUploader';
import { QuantityInput } from './QuantityInput';
import { TagsSelector } from './TagsSelector';
import type { Category } from '../../entities/models';
import type { Dish } from './types';

const serveOptions = ['с луком', 'с соусом', 'с гарниром', 'без добавок'];

export function DishForm({
  dish,
  categories,
  error,
  onChange,
  onSubmit
}: {
  dish: Dish;
  categories: Category[];
  error: string;
  onChange: (patch: Partial<Dish>) => void;
  onSubmit: () => void;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="dish-form" onSubmit={submit}>
      {error && <p className="dish-alert">{error}</p>}
      <PhotoUploader images={dish.images} onChange={(images) => onChange({ images })} />

      <section className="dish-section">
        <div className="dish-two-fields dish-two-fields--title">
          <label>
            Название
            <input
              maxLength={80}
              required
              value={dish.name}
              onChange={(event) => onChange({ name: event.target.value.slice(0, 80) })}
              placeholder="Шашлык из баранины"
            />
          </label>
          <label>
            Цена
            <span>
              <input
                inputMode="numeric"
                min={0}
                required
                type="number"
                value={dish.price}
                onChange={(event) => onChange({ price: Number(event.target.value) })}
              />
              ₽
            </span>
          </label>
        </div>
      </section>

      <CategorySelector categories={categories} value={dish.category} onChange={(category) => onChange({ category })} />
      <TagsSelector tags={dish.tags} onChange={(tags) => onChange({ tags })} />

      <section className="dish-section">
        <label>
          Описание
          <textarea
            maxLength={500}
            value={dish.description}
            onChange={(event) => onChange({ description: event.target.value.slice(0, 500) })}
            placeholder="Короткое описание без форматирования"
          />
        </label>
        <small>{dish.description.length}/500</small>
      </section>

      <section className="dish-section">
        <label>
          Состав
          <input
            maxLength={200}
            value={dish.ingredients}
            onChange={(event) => onChange({ ingredients: event.target.value.slice(0, 200) })}
            placeholder="Баранина, специи, лук, соль"
          />
        </label>
      </section>

      <QuantityInput
        weight={dish.weight}
        dailyQuantity={dish.dailyQuantity}
        onWeightChange={(weight) => onChange({ weight })}
        onQuantityChange={(dailyQuantity) => onChange({ dailyQuantity })}
      />

      <section className="dish-section">
        <label>
          Подается с
          <select value={dish.serveWith} onChange={(event) => onChange({ serveWith: event.target.value })}>
            {serveOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="dish-section">
        <h3>Переключатели</h3>
        <div className="dish-switches">
          {['Новинка', 'Популярное'].map((tag) => (
            <label className="dish-switch" key={tag}>
              {tag}
              <input
                type="checkbox"
                checked={dish.tags.includes(tag)}
                onChange={(event) => {
                  onChange({
                    tags: event.target.checked
                      ? [...dish.tags.filter((item) => item !== tag), tag]
                      : dish.tags.filter((item) => item !== tag)
                  });
                }}
              />
              <span />
            </label>
          ))}
        </div>
      </section>
    </form>
  );
}
