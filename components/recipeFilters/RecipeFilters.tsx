import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

import type { RecipeType } from 'types/recipe';

export type RecipeCategory = 'all' | RecipeType;

interface RecipeFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCategory: RecipeCategory;
  onCategoryChange: (category: RecipeCategory) => void;
  availableLabels: string[];
  selectedLabel: string | null;
  onLabelChange: (label: string | null) => void;
}

const categoryOptions: Array<{ value: RecipeCategory; label: string }> = [
  { value: 'all', label: 'All recipes' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'baking', label: 'Baking' },
];

const RecipeFilters = ({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  availableLabels,
  selectedLabel,
  onLabelChange,
}: RecipeFiltersProps) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileSearchInput = useRef<HTMLInputElement>(null);
  const mobileSearchToggle = useRef<HTMLButtonElement>(null);
  const wasMobileSearchOpen = useRef(false);

  useEffect(() => {
    if (isMobileSearchOpen) {
      mobileSearchInput.current?.focus();
    } else if (wasMobileSearchOpen.current) {
      mobileSearchToggle.current?.focus();
    }
    wasMobileSearchOpen.current = isMobileSearchOpen;
  }, [isMobileSearchOpen]);

  return (
    <>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full items-center justify-between gap-3">
          <h1 className="font-normal text-2xl leading-tight text-[#3d2a20] sm:text-3xl">Recipes</h1>

          <label className="relative hidden w-[min(58%,280px)] shrink-0 sm:block">
            <span className="sr-only">Search recipes by title or type</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#806d5d]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Try “pasta” or “soup”"
              className="input recipe-search-input h-9 w-full rounded-md border-[#dfd2c2] bg-[#fcfaf6] pl-9 pr-10 text-sm text-[#3d2a20] placeholder:text-[#9a8a7c] outline-none focus:border-[#6b5e53] focus:outline-2 focus:outline-[#6b5e53]/25"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#806d5d] hover:bg-[#f0e6d9]"
                aria-label="Clear recipe search"
              >
                <X size={17} />
              </button>
            )}
          </label>

          <button
            ref={mobileSearchToggle}
            type="button"
            className="btn btn-ghost btn-sm btn-circle text-[#765f5f] sm:hidden"
            aria-label={isMobileSearchOpen ? 'Hide recipe search' : 'Open recipe search'}
            aria-expanded={isMobileSearchOpen}
            onClick={() => setIsMobileSearchOpen((open) => !open)}
          >
            <Search size={19} />
          </button>
        </div>

        <div
          className={`grid w-full overflow-hidden transition-[grid-template-rows,opacity,transform] duration-300 motion-reduce:transition-none sm:hidden ${isMobileSearchOpen
            ? 'grid-rows-[1fr] translate-y-0 opacity-100'
            : 'pointer-events-none grid-rows-[0fr] -translate-y-2 opacity-0'
          }`}
          aria-hidden={!isMobileSearchOpen}
        >
          <label className="relative min-h-0 overflow-hidden">
            <span className="sr-only">Search recipes by title or type</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#806d5d]" aria-hidden="true" />
            <input
              ref={mobileSearchInput}
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Try “pasta” or “soup”"
              tabIndex={isMobileSearchOpen ? 0 : -1}
              className="input recipe-search-input h-9 w-full rounded-md border-[#dfd2c2] bg-[#fcfaf6] pl-9 pr-10 text-sm text-[#3d2a20] placeholder:text-[#9a8a7c] outline-none focus:border-[#6b5e53] focus:outline-2 focus:outline-[#6b5e53]/25"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#806d5d] hover:bg-[#f0e6d9]"
                aria-label="Clear recipe search"
                tabIndex={isMobileSearchOpen ? 0 : -1}
              >
                <X size={17} />
              </button>
            )}
          </label>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Recipe categories">
          {categoryOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={selectedCategory === value}
              onClick={() => {
                onCategoryChange(value);
                onLabelChange(null);
              }}
              className={`btn btn-sm btn-secondary rounded-lg hover:!text-white ${selectedCategory === value
                ? '!border-[#6b5e53] !bg-[#6b5e53] !text-white'
                : 'btn-outline'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {availableLabels.length > 0 && (
          <label className="flex h-8 items-center gap-2 rounded-lg border border-[#765f5f] px-2.5 text-xs text-[#765f5f]">
            <span className="whitespace-nowrap">Label:</span>
            <select
              value={selectedLabel || ''}
              onChange={(event) => onLabelChange(event.target.value || null)}
              className="max-w-32 bg-transparent text-xs outline-none"
              aria-label="Filter by recipe type"
            >
              <option value="">All types</option>
              {availableLabels.map((label) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </label>
        )}
      </div>
    </>
  );
};

export default RecipeFilters;
