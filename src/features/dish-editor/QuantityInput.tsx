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
            <input
              inputMode="numeric"
              min={0}
              type="number"
              value={weight}
              onChange={(event) => onWeightChange(Number(event.target.value))}
            />
            г
          </span>
        </label>
        <label>
          Остаток на сегодня
          <span>
            <input
              inputMode="numeric"
              min={0}
              step={1}
              type="number"
              value={dailyQuantity}
              onChange={(event) => onQuantityChange(Number(event.target.value))}
            />
            шт
          </span>
        </label>
      </div>
      {dailyQuantity === 0 && <p className="dish-stock-warning">Закончилось</p>}
    </section>
  );
}
