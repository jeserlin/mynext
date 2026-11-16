import type { NotionRecipe } from '../../types/recipe';

// Minimal legacy recipe used only by isolated editor tests.
export const editorRecipeFixture: NotionRecipe = {
  id: 'markdown:cooking:bolognese-sauce', source: 'markdown',
  title: '義大利經典肉醬', slug: 'bolognese-sauce', type: 'cooking', published: true,
  date: '2023-09-15', ingredient: ['牛絞肉', '蒜頭'], labels: ['pasta'],
  coverImage: '/assets/posts/cooking/bolognese_sauce.png', gallery: [],
  content: '### 步驟\n\n1. 小火慢燉 1.5 小時。',
  scaling: { baseServings: 1, groups: [
    { title: '食材', items: [{ name: '牛絞肉', amount: 320, unit: 'g' }] },
    { title: '調味料', items: [{ name: '蒜頭', amount: 3, maxAmount: 4, unit: '個' }] },
  ] },
};
