import { Flame, Plus, Star, X } from 'lucide-react';

const availableTags = [
  { label: 'Хит', icon: Flame },
  { label: 'Популярное', icon: Star },
  { label: 'Новинка', short: 'NEW' }
];

export function TagsSelector({
  tags,
  onChange
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
  };

  return (
    <section className="dish-section">
      <h3>Метки</h3>
      <div className="dish-tags">
        {tags.map((tag) => (
          <button className="dish-tag is-selected" type="button" key={tag} onClick={() => onChange(tags.filter((item) => item !== tag))}>
            {tag}
            <X />
          </button>
        ))}
        {availableTags
          .filter((tag) => !tags.includes(tag.label))
          .map((tag) => {
            const Icon = tag.icon;
            return (
              <button className="dish-tag" type="button" key={tag.label} onClick={() => addTag(tag.label)}>
                {Icon ? <Icon /> : <b>{tag.short}</b>}
                {tag.label}
                <Plus />
              </button>
            );
          })}
      </div>
    </section>
  );
}
