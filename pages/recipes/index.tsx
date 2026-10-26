import { useMemo, useState } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';

import RecipeCard from 'components/recipeCard';
import RecipeFilters from 'components/recipeFilters';
import type { RecipeCategory } from 'components/recipeFilters';
import SeoHeader from 'components/seoHeader';
import { getRecipesByType } from 'lib/recipes';
import type { RecipeType } from 'types/recipe';

interface RecipeFinderItem {
  slug: string;
  title: string;
  type: RecipeType;
  coverImage?: string;
  labels: string[];
}

interface RecipesProps {
  recipes: RecipeFinderItem[];
}

const Recipes = ({ recipes }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>('all');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const availableLabels = useMemo(() => {
    if (selectedCategory === 'all') return [];

    const counts = new Map<string, number>();
    recipes.filter(({ type }) => type === selectedCategory).forEach(({ labels: recipeLabels }) => {
      new Set(recipeLabels.map((label) => label.trim())).forEach((label) => {
        if (label.toLowerCase() !== 'others') {
          counts.set(label, (counts.get(label) || 0) + 1);
        }
      });
    });

    return [...counts.entries()]
      .filter(([, count]) => count >= 2)
      .sort(([labelA, countA], [labelB, countB]) => countB - countA || labelA.localeCompare(labelB))
      .slice(0, 8)
      .map(([label]) => label);
  }, [recipes, selectedCategory]);

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return recipes.filter((recipe) => {
      const matchesCategory = selectedCategory === 'all' || recipe.type === selectedCategory;
      const matchesLabel = !selectedLabel || recipe.labels.some(
        (label) => label.toLocaleLowerCase() === selectedLabel.toLocaleLowerCase(),
      );
      const matchesQuery = !normalizedQuery
        || recipe.title.toLocaleLowerCase().includes(normalizedQuery)
        || recipe.labels.some((label) => label.toLocaleLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesLabel && matchesQuery;
    });
  }, [query, recipes, selectedCategory, selectedLabel]);

  return (
    <div>
      <SeoHeader
        title="Recipes"
        description="Find a recipe by title or dish type."
      />

      <RecipeFilters
        query={query}
        onQueryChange={setQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        availableLabels={availableLabels}
        selectedLabel={selectedLabel}
        onLabelChange={setSelectedLabel}
      />

      <div className="mb-2 flex min-h-5 items-center justify-between text-xs text-[#766458]" aria-live="polite">
        <span>{filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}</span>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard
              key={`${recipe.type}-${recipe.slug}`}
              {...recipe}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#d9cbbc] bg-[#fcfaf6] px-6 py-12 text-center">
          <p className="font-normal text-xl text-[#3d2a20]">找不到食譜</p>
          <p className="mt-1 text-sm text-[#75665b]">試試其他食譜名稱或料理類型。</p>
          {(query || selectedLabel || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedLabel(null);
                setSelectedCategory('all');
              }}
              className="mt-4 text-sm font-semibold text-[#a65f40] underline underline-offset-4"
            >
              清除篩選
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps<RecipesProps> = async () => {
  const [cookingRecipes, bakingRecipes] = await Promise.all([
    getRecipesByType({ type: 'cooking', fields: ['slug', 'title', 'coverImage', 'labels'] }),
    getRecipesByType({ type: 'baking', fields: ['slug', 'title', 'coverImage', 'labels'] }),
  ]);

  const recipes: RecipeFinderItem[] = [];
  for (const [type, items] of [
    ['cooking', cookingRecipes],
    ['baking', bakingRecipes],
  ] as const) {
    items.forEach((recipe) => {
      if (!recipe.slug || !recipe.title) return;
      recipes.push({
        slug: recipe.slug,
        title: recipe.title,
        type,
        coverImage: recipe.coverImage,
        labels: recipe.labels || [],
      });
    });
  }

  return {
    props: { recipes },
    revalidate: 60,
  };
};

export default Recipes;
