const scaling = {
  baseServings: 1,
  groups: [
    { title: '食材', items: [{ name: '牛絞肉', amount: 320, unit: 'g' }, { name: '豬絞肉', amount: 500, unit: 'g' }] },
    { title: '調味料', items: [{ name: '蒜頭', amount: 3, maxAmount: 4, unit: '個' }, { name: '鹽', note: '適量' }] },
  ],
};

const recipes = [
  { slug: 'bolognese-sauce', title: '義大利經典肉醬', type: 'cooking', labels: ['pasta'], content: `---\nscaling: ${JSON.stringify(scaling)}\n---\n### 步驟\n\n1. 小火慢燉\`1.5小時\`。` },
  { slug: 'dried-borchi-mushroom', title: '牛肝菌義大利麵', type: 'cooking', labels: ['pasta'] },
  { slug: 'pumpkin-soup', title: '南瓜濃湯', type: 'cooking', labels: ['soup'] },
  { slug: 'pork-bone-soup-with-yam', title: '山藥排骨湯', type: 'cooking', labels: ['soup'] },
  { slug: 'bagel', title: '全麥貝果', type: 'baking', labels: ['貝果'] },
  { slug: 'sesame-bagel', title: '芝麻貝果', type: 'baking', labels: ['貝果'] },
];

const richText = (content) => [{ type: 'text', plain_text: content, text: { content } }];

export const notionRecipePages = recipes.map((recipe, index) => ({
  id: `e2e-recipe-${index + 1}`,
  created_time: '2026-01-01T00:00:00.000Z',
  properties: {
    Title: { title: richText(recipe.title) },
    Slug: { rich_text: richText(recipe.slug) },
    Type: { select: { name: recipe.type } },
    Published: { checkbox: true },
    Description: { rich_text: richText(recipe.title) },
    Ingredients: { rich_text: richText('測試材料') },
    Labels: { multi_select: recipe.labels.map((name) => ({ name })) },
    'Cover Image': { url: null },
    Gallery: { rich_text: [] },
    'Publish Date': { date: { start: '2026-01-01' } },
    'Content Markdown': { rich_text: richText(recipe.content || '### 材料\n\n- 測試材料 適量\n\n### 步驟\n\n1. 完成料理。') },
  },
}));
