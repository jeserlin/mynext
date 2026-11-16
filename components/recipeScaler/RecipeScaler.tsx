import { useId, useState } from 'react';
import { Utensils } from 'lucide-react';

import { parseServings, scaleIngredient, servingsFromIngredient } from 'lib/recipeScaling';
import type { RecipeScaling } from 'types/recipe';

const RecipeScaler = ({ scaling }: { scaling: RecipeScaling }) => {
  const inputId = useId();
  const [draft, setDraft] = useState(String(scaling.baseServings));
  const [servings, setServings] = useState(scaling.baseServings);
  const measurable = scaling.groups.flatMap((group) => group.items)
    .filter((item) => item.amount !== undefined && item.amount > 0 && item.maxAmount === undefined);
  const [basisIndex, setBasisIndex] = useState(0);
  const basis = measurable[basisIndex];
  const [amountDraft, setAmountDraft] = useState(String(basis?.amount || ''));
  const [ingredientBased, setIngredientBased] = useState(false);
  const invalid = parseServings(draft) === null;
  const amountInvalid = basis && servingsFromIngredient(amountDraft, basis.amount!, scaling.baseServings) === null;
  const selectServings = (value: number, text = String(value)) => {
    setServings(value);
    setDraft(text);
    setIngredientBased(false);
    if (basis) setAmountDraft(String(Number((basis.amount! * value / scaling.baseServings).toPrecision(10))));
  };

  return (
    <section aria-label="材料與份量換算" className="recipe-scaler mb-8 rounded-lg border px-3 py-4 sm:p-6 [&_p]:!mx-0">
      <h2 className="text-2xl font-normal leading-[1.33em] text-primary-content">材料</h2>
      <p className="mt-2 text-sm text-primary-content">原配方 {scaling.baseServings} 份，以整份配方計算，非人數。</p>
      {basis && (
        <fieldset className="recipe-scaler-basis mt-4 rounded-md p-3">
          <legend className="px-1 text-sm text-primary-content">依手上食材換算</legend>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-0 flex-1">
              <label htmlFor={`${inputId}-basis`} className="mb-1 block text-sm text-base-content">基準食材</label>
              <select
                id={`${inputId}-basis`}
                className="select w-full bg-white text-base-content"
                value={basisIndex}
                onChange={(event) => {
                  const index = Number(event.target.value);
                  setBasisIndex(index);
                  setAmountDraft(String(Number((measurable[index].amount! * servings / scaling.baseServings).toPrecision(10))));
                }}
              >
                {measurable.map((item, index) => <option key={item.name} value={index}>{item.name}（原用量 {scaleIngredient(item, 1)}）</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${inputId}-amount`} className="mb-1 block text-sm text-base-content">實際用量{basis.unit ? `（${basis.unit}）` : ''}</label>
              <input
                id={`${inputId}-amount`}
                className="input w-28 bg-white text-base-content"
                type="text"
                inputMode="decimal"
                value={amountDraft}
                aria-invalid={Boolean(amountInvalid)}
                aria-describedby={`${inputId}-amount-help`}
                onChange={(event) => {
                  setAmountDraft(event.target.value);
                  const value = servingsFromIngredient(event.target.value, basis.amount!, scaling.baseServings);
                  if (value !== null) {
                    setServings(value);
                    setDraft(String(Number(value.toPrecision(10))));
                    setIngredientBased(true);
                  }
                }}
              />
            </div>
          </div>
          <p id={`${inputId}-amount-help`} className="!mb-0 mt-2 text-sm text-primary-content">
            {amountInvalid ? '請輸入大於零、換算後介於 0.01–100 份的用量。材料保留上次有效用量。' : '依原用量等比例調整全部材料，也可使用下方份數快捷鍵。'}
          </p>
        </fieldset>
      )}
      <div className="mt-4 flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor={inputId} className="mb-1 block text-sm text-base-content">配方份數</label>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-outline btn-sm" aria-label="減少半份" disabled={servings <= 0.5} onClick={() => selectServings(Math.max(0.01, servings - 0.5))}>−</button>
            <input
              id={inputId}
              className="input input-bordered w-24 bg-white text-base-content"
              type="text"
              inputMode="decimal"
              value={draft}
              aria-invalid={invalid}
              aria-describedby={`${inputId}-help`}
              onChange={(event) => {
                setDraft(event.target.value);
                const value = parseServings(event.target.value);
                if (value !== null) selectServings(value, event.target.value);
              }}
            />
            <button type="button" className="btn btn-outline btn-sm" aria-label="增加半份" disabled={servings >= 100} onClick={() => selectServings(Math.min(100, servings + 0.5))}>＋</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => selectServings(scaling.baseServings)}>還原原配方</button>
          </div>
        </div>
      </div>
      <p id={`${inputId}-help`} className="mt-2 text-sm text-primary-content">
        {invalid ? '請輸入 0.01–100 之間的份數，例如 0.5 或 1/2。材料暫時保留上次有效用量。' : '可輸入小數或分數，例如 0.5、1/2。'}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[0.5, 1, 2, 3].map((factor) => (
          <button key={factor} type="button" className="btn btn-outline btn-sm" aria-pressed={servings === scaling.baseServings * factor} onClick={() => selectServings(scaling.baseServings * factor)}>
            {factor === 0.5 ? '半份' : factor === 1 ? '一份' : factor === 2 ? '兩份' : '三份'}
          </button>
        ))}
      </div>
      <p role="status" className="recipe-scaler-status mt-3 text-sm">
        <Utensils size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          {ingredientBased && basis ? `依${basis.name} ${scaleIngredient(basis, servings / scaling.baseServings)}換算；` : '目前用量：'}
          原配方的 {Number((servings / scaling.baseServings).toPrecision(4))} 倍
        </span>
      </p>
      {scaling.groups.map((group) => (
        <div key={group.title} className="mt-5">
          <h3 className="!text-[22px] !font-bold leading-[1.33em] text-secondary-content">{group.title}</h3>
          <ul className="mt-2 !list-none !pl-0">
            {group.items.map((item) => (
              <li key={item.name} className="flex justify-between gap-4 py-2 text-base-content">
                <span>{item.name}</span>
                <span className="text-right tabular-nums">{scaleIngredient(item, servings / scaling.baseServings)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="mt-4 text-sm text-primary-content">調味與烹調時間需依實際情況調整；步驟中的時間、溫度不隨份量改變。</p>
    </section>
  );
};

export default RecipeScaler;
