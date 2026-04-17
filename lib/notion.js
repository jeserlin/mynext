const notionVersion = '2022-06-28';

const getNotionHeaders = () => ({
  Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': notionVersion,
});

const isNotionConfigured = () => (
  Boolean(process.env.NOTION_TOKEN) && Boolean(process.env.NOTION_DATABASE_ID)
);

const getPlainText = (items = []) => items.map((item) => item.plain_text || '').join('');

const chunkText = (text = '', size = 1900) => {
  if (!text) return [];

  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

const toRichText = (text = '') => chunkText(text).map((content) => ({
  type: 'text',
  text: { content },
}));

const getRecipeFromPage = (page) => {
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

const notionRequest = async (path, options = {}) => {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      ...getNotionHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Notion request failed: ${response.status} ${errorBody}`);
  }

  return response.json();
};

export const notionEnabled = () => isNotionConfigured();

export const getPublishedRecipesByType = async (type) => {
  if (!isNotionConfigured()) {
    return [];
  }

  const data = await notionRequest(`/databases/${process.env.NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          {
            property: 'Type',
            select: {
              equals: type,
            },
          },
          {
            property: 'Published',
            checkbox: {
              equals: true,
            },
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
  });

  return (data.results || []).map(getRecipeFromPage);
};

export const getRecipeBySlugFromNotion = async (type, slug) => {
  if (!isNotionConfigured()) {
    return null;
  }

  const data = await notionRequest(`/databases/${process.env.NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          {
            property: 'Type',
            select: {
              equals: type,
            },
          },
          {
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'Published',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      page_size: 1,
    }),
  });

  if (!data.results?.length) {
    return null;
  }

  return getRecipeFromPage(data.results[0]);
};

export const recipeSlugExistsInNotion = async (type, slug) => {
  if (!isNotionConfigured()) {
    return false;
  }

  const data = await notionRequest(`/databases/${process.env.NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          {
            property: 'Type',
            select: {
              equals: type,
            },
          },
          {
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
      page_size: 1,
    }),
  });

  return Boolean(data.results?.length);
};

export const createRecipeInNotion = async ({
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
}) => {
  if (!isNotionConfigured()) {
    throw new Error('Notion is not configured');
  }

  const payload = {
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      Title: {
        title: toRichText(title),
      },
      Slug: {
        rich_text: toRichText(slug),
      },
      Type: {
        select: {
          name: type,
        },
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
        date: {
          start: date,
        },
      },
    },
  };

  const page = await notionRequest('/pages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return getRecipeFromPage(page);
};
