import { emptyIngredient } from 'lib/recipeScalingForm';
import type { ScalingDraft } from 'lib/recipeScalingForm';

const field = 'w-full min-w-0 rounded-lg border border-[#d8d0c3] bg-white px-3 py-2 text-sm text-[#3d2a20]';
const button = 'btn btn-sm rounded-lg border-[#765f5f] bg-white text-[#765f5f] shadow-none';

export default function RecipeScalingEditor({ value, onChange }: { value: ScalingDraft; onChange: (value: ScalingDraft) => void }) {
  const updateGroup = (index: number, group: ScalingDraft['groups'][number]) => onChange({
    ...value, groups: value.groups.map((current, i) => i === index ? group : current),
  });
  return (
    <div className="mt-4 flex flex-col gap-4">
      <label className="flex max-w-48 flex-col gap-2 text-sm text-primary-content">
        原配方份數
        <input className={field} inputMode="decimal" value={value.baseServings} onChange={(event) => onChange({ ...value, baseServings: event.target.value })} />
      </label>
      <p className="!m-0 text-sm text-primary-content">數量可填 0.5 或 1/2；範圍用量填「數量」與「上限」。適量、少許等材料不填數量，改填備註。啟用後材料表以此處為準，Markdown 的「材料」段落會自動取代，其他段落保留。</p>
      {value.groups.map((group, groupIndex) => (
        <fieldset key={groupIndex} className="min-w-0 rounded-lg border border-[#e5ddd0] bg-white p-3">
          <legend className="px-1 text-sm text-primary-content">材料分組 {groupIndex + 1}</legend>
          <div className="flex items-end gap-2">
            <label className="min-w-0 flex-1 text-sm text-primary-content">分組名稱
              <input className={`${field} mt-1`} value={group.title} onChange={(event) => updateGroup(groupIndex, { ...group, title: event.target.value })} />
            </label>
            <button type="button" className={button} disabled={value.groups.length <= 1} onClick={() => onChange({ ...value, groups: value.groups.filter((_, index) => index !== groupIndex) })}>移除分組 {groupIndex + 1}</button>
          </div>
          {group.items.map((item, itemIndex) => (
            <fieldset key={itemIndex} className="mt-4 min-w-0 rounded-lg bg-[#fcfaf6] p-3">
              <legend className="px-1 text-sm text-primary-content">材料 {groupIndex + 1}-{itemIndex + 1}</legend>
              <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3">
                {([
                  ['name', '材料名稱'], ['amount', '數量'], ['maxAmount', '上限（選填）'], ['unit', '單位'], ['note', '備註'],
                ] as const).map(([key, label]) => (
                  <label key={key} className={`min-w-0 text-sm text-primary-content ${key === 'name' ? 'col-span-2 sm:col-span-1' : ''}`}>
                    {label}
                    <input
                      className={`${field} mt-1`}
                      inputMode={key === 'amount' || key === 'maxAmount' ? 'decimal' : 'text'}
                      value={item[key]}
                      onChange={(event) => updateGroup(groupIndex, { ...group, items: group.items.map((current, index) => index === itemIndex ? { ...current, [key]: event.target.value } : current) })}
                    />
                  </label>
                ))}
              </div>
              <button type="button" className={`${button} mt-3`} disabled={group.items.length <= 1} onClick={() => updateGroup(groupIndex, { ...group, items: group.items.filter((_, index) => index !== itemIndex) })}>移除材料 {groupIndex + 1}-{itemIndex + 1}</button>
            </fieldset>
          ))}
          <button type="button" className={`${button} mt-3`} onClick={() => updateGroup(groupIndex, { ...group, items: [...group.items, emptyIngredient()] })}>新增材料至分組 {groupIndex + 1}</button>
        </fieldset>
      ))}
      <button type="button" className={`${button} self-start`} onClick={() => onChange({ ...value, groups: [...value.groups, { title: '調味料', items: [emptyIngredient()] }] })}>新增材料分組</button>
    </div>
  );
}
