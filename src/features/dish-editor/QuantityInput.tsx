import { useEffect, useState } from 'react';

function NumericInput({
  value,
  step,
  onChange
}: {
  value: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setText(String(value));
    }
  }, [focused, value]);

  return (
    <input
      inputMode="numeric"
      min={0}
      step={step}
      type="number"
      value={text}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        if (text.trim() === '') {
          setText('0');
        }
      }}
      onChange={(event) => {
        const next = event.target.value;
        setText(next);
        onChange(next.trim() === '' ? 0 : Number(next));
      }}
    />
  );
}

export function QuantityInput({
  weight,
  dailyQuantity,
  onWeightChange,
  onQuantityChange
}: {
  weight: number;
  dailyQuantity: number;
  onWeightChange: (weight: number) => void;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <section className="dish-section">
      <h3>Параметры</h3>
      <div className="dish-two-fields">
        <label>
          Вес
          <span>
            <NumericInput value={weight} onChange={onWeightChange} />
            г
          </span>
        </label>
        <label>
          Остаток на сегодня
          <span>
            <NumericInput value={dailyQuantity} step={1} onChange={onQuantityChange} />
            шт
          </span>
        </label>
      </div>
      {dailyQuantity === 0 && <p className="dish-stock-warning">Закончилось</p>}
    </section>
  );
}
