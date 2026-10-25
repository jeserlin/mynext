import type {
  NotionRecipe,
  NotionRecipeInput,
  RecipeType,
} from 'types/recipe';

const notionVersion = '2022-06-28';

interface NotionRichTextItem {
  plain_text?: string;
}

interface NotionProperty {
  title?: NotionRichTextItem[];
  rich_text?: NotionRichTextItem[];
  select?: { name?: string } | null;
  multi_select?: Array<{ name: string }>;
  url?: string | null;
  date?: { start?: string } | null;
  checkbox?: boolean;
}

interface NotionPage {
  id: string;
  created_time: string;
  properties?: Record<string, NotionProperty>;
}

interface NotionQueryResponse {
  results?: NotionPage[];
}

interface NotionRichTextInput {
  type: 'text';
  text: { content: string };
}

const getNotionHeaders = () => ({
  Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': notionVersion,
});

const isNotionConfigured = (): boolean => (
  Boolean(process.env.NOTION_TOKEN) && Boolean(process.env.NOTION_DATABASE_ID)
);

const getPlainText = (items: NotionRichTextItem[] = []): string => (
  items.map((item) => item.plain_text || '').join('')
);

const chunkText = (text = '', size = 1900): string[] => {
  if (!text) return [];

  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }
  return chunks;
};

const toRichText = (text = ''): NotionRichTextInput[] => (
  chunkText(text).map((content) => ({
    type: 'text',
    text: { content },
  }))
);

const getRecipeFromPage = (page: NotionPage): NotionRecipe => {
  const properties = page.properties || {};

  return {
    id: page.id,
    title: getPlainText(properties.Title?.title),
    slug: getPlainText(properties.Slug?.rich_text),
    type: properties.Type?.select?.name || '',
    desc: getPlainText(properties.Description?.rich_text),
    ingredient: getPlainText(properties.Ingredients?.rich_text)
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    labels: (properties.Labels?.multi_select || []).map(({ name }) => name),
    coverImage: properties['Cover Image']?.url || '',
    gallery: getPlainText(properties.Gallery?.rich_text)
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    content: getPlainText(properties['Content Markdown']?.rich_text),
    date: properties['Publish Date']?.date?.start || page.created_time,
    published: Boolean(properties.Published?.checkbox),
  };
};

const notionRequest = async <Response>(
  path: string,
  options: RequestInit = {},
): Promise<Response> => {
  const headers = new Headers(options.headers);
  Object.entries(getNotionHeaders()).forEach(([name, value]) => {
    if (!headers.has(name)) headers.set(name, value);
  });

  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Notion request failed: ${response.status} ${errorBody}`);
  }

  return response.json() as Promise<Response>;
};

const withNotionReadFallback = async <Value>(
  fallbackValue: Value,
  callback: () => Promise<Value>,
): Promise<Value> => {
  try {
    return await callback();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Notion read fallback: ${message}`);
    return fallbackValue;
  }
};

export const notionEnabled = (): boolean => isNotionConfigured();

export const getPublishedRecipesByType = async (
  type: RecipeType,
): Promise<NotionRecipe[]> => {
  if (!isNotionConfigured()) {
    return [];
  }

  return withNotionReadFallback<NotionRecipe[]>([], async () => {
    const data = await notionRequest<NotionQueryResponse>(
      `/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        body: JSON.stringify({
          filter: {
            and: [
              {
                property: 'Type',
                select: { equals: type },
              },
              {
                property: 'Published',
                checkbox: { equals: true },
              },
            ],
          },
          sorts: [
            {
              property: 'Publish Date',
              direction: 'descending',
            },
          ],
          page_size: 100,
        }),
      },
    );

    return (data.results || []).map(getRecipeFromPage);
  });
};

export const getRecipeBySlugFromNotion = async (
  type: RecipeType,
  slug: string,
): Promise<NotionRecipe | null> => {
  if (!isNotionConfigured()) {
    return null;
  }

  return withNotionReadFallback<NotionRecipe | null>(null, async () => {
    const data = await notionRequest<NotionQueryResponse>(
      `/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        body: JSON.stringify({
          filter: {
            and: [
              {
                property: 'Type',
                select: { equals: type },
              },
              {
                property: 'Slug',
                rich_text: { equals: slug },
              },
              {
                property: 'Published',
                checkbox: { equals: true },
              },
            ],
          },
          page_size: 1,
        }),
      },
    );

    return data.results?.length ? getRecipeFromPage(data.results[0]) : null;
  });
};

export const getRecipeBySlugForAdminFromNotion = async (
  type: string,
  slug: string,
): Promise<NotionRecipe | null> => {
  if (!isNotionConfigured()) {
    return null;
  }

  const data = await notionRequest<NotionQueryResponse>(
    `/databases/${process.env.NOTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      body: JSON.stringify({
        filter: {
          and: [
            {
              property: 'Type',
              select: { equals: type },
            },
            {
              property: 'Slug',
              rich_text: { equals: slug },
            },
          ],
        },
        page_size: 1,
      }),
    },
  );

  return data.results?.length ? getRecipeFromPage(data.results[0]) : null;
};

export const getRecipesForAdminFromNotion = async (
  type = '',
): Promise<NotionRecipe[]> => {
  if (!isNotionConfigured()) {
    return [];
  }

  const data = await notionRequest<NotionQueryResponse>(
    `/databases/${process.env.NOTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      body: JSON.stringify({
        ...(type
          ? {
              filter: {
                property: 'Type',
                select: { equals: type },
              },
            }
          : {}),
        sorts: [
          {
            property: 'Publish Date',
            direction: 'descending',
          },
          {
            timestamp: 'created_time',
            direction: 'descending',
          },
        ],
        page_size: 100,
      }),
    },
  );

  return (data.results || []).map(getRecipeFromPage);
};

export const recipeSlugExistsInNotion = async (
  type: RecipeType,
  slug: string,
): Promise<boolean> => {
  if (!isNotionConfigured()) {
    return false;
  }

  const data = await notionRequest<NotionQueryResponse>(
    `/databases/${process.env.NOTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      body: JSON.stringify({
        filter: {
          and: [
            {
              property: 'Type',
              select: { equals: type },
            },
            {
              property: 'Slug',
              rich_text: { equals: slug },
            },
          ],
        },
        page_size: 1,
      }),
    },
  );

  return Boolean(data.results?.length);
};

const buildRecipeProperties = ({
  title,
  slug,
  type,
  desc,
  ingredient,
  labels,
  coverImage,
  gallery,
  contentMarkdown,
  published,
  date,
}: NotionRecipeInput) => ({
  Title: {
    title: toRichText(title),
  },
  Slug: {
    rich_text: toRichText(slug),
  },
  Type: {
    select: { name: type },
  },
  Description: {
    rich_text: toRichText(desc),
  },
  Ingredients: {
    rich_text: toRichText(ingredient.join('\n')),
  },
  Labels: {
    multi_select: labels.map((name) => ({ name })),
  },
  'Cover Image': {
    url: coverImage || null,
  },
  Gallery: {
    rich_text: toRichText(gallery.join('\n')),
  },
  'Content Markdown': {
    rich_text: toRichText(contentMarkdown),
  },
  Published: {
    checkbox: Boolean(published),
  },
  'Publish Date': {
    date: { start: date },
  },
});

export const createRecipeInNotion = async (
  recipeInput: NotionRecipeInput,
): Promise<NotionRecipe> => {
  if (!isNotionConfigured()) {
    throw new Error('Notion is not configured');
  }

  const page = await notionRequest<NotionPage>('/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: buildRecipeProperties(recipeInput),
    }),
  });

  return getRecipeFromPage(page);
};

export const updateRecipeInNotion = async (
  pageId: string,
  recipeInput: NotionRecipeInput,
): Promise<NotionRecipe> => {
  if (!isNotionConfigured()) {
    throw new Error('Notion is not configured');
  }

  const page = await notionRequest<NotionPage>(`/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      properties: buildRecipeProperties(recipeInput),
    }),
  });

  return getRecipeFromPage(page);
};
