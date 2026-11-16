import { afterEach, describe, expect, it, vi } from 'vitest';
import matter from 'gray-matter';

import { readRecipeDocument, writeRecipeDocument } from './recipeDocument';
import { createRecipeInNotion, getRecipeBySlugFromNotion } from './notion';
import type { RecipeScaling } from 'types/recipe';

const scaling: RecipeScaling = {
  baseServings: 1,
  groups: [{ title: '食材', items: [{ name: '牛絞肉', amount: 320, unit: 'g' }, { name: '鹽', note: '適量' }] }],
};

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('recipe document storage', () => {
  it('round-trips quantities and body through the existing Markdown field', () => {
    const document = writeRecipeDocument('### 步驟\n\n1. 慢燉\n', scaling);
    expect(readRecipeDocument(document)).toEqual({ content: '### 步驟\n\n1. 慢燉\n', scaling });
  });

  it('preserves legacy Markdown and unrelated metadata; explicit null records a disable', () => {
    const body = '### 材料\n- 鹽 適量\n';
    expect(readRecipeDocument(body)).toEqual({ content: body });
    const document = matter.stringify(body, { author: 'test', scaling });
    expect(matter(writeRecipeDocument(document)).data).toEqual({ author: 'test', scaling });
    expect(matter(writeRecipeDocument(document, null)).data).toEqual({ author: 'test', scaling: null });
    expect(readRecipeDocument(writeRecipeDocument(document, null))).toEqual({ content: body, scalingDisabled: true });
  });

  it('writes and reads Notion without adding database properties', async () => {
    vi.stubEnv('NOTION_TOKEN', 'fake-token');
    vi.stubEnv('NOTION_DATABASE_ID', 'fake-db');
    const page = { id: 'page-1', created_time: '2026-11-16', properties: {} };
    const fetch = vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method === 'POST' && _url.endsWith('/pages')) {
        const body = JSON.parse(String(init.body));
        page.properties = body.properties;
        const markdown = body.properties['Content Markdown'].rich_text.map((part: { text: { content: string } }) => part.text.content).join('');
        const returned = { ...page, properties: { ...body.properties, 'Content Markdown': { rich_text: [{ plain_text: markdown }] } } };
        return new Response(JSON.stringify(returned));
      }
      const properties = page.properties as Record<string, { rich_text?: Array<{ text: { content: string } }> }>;
      const markdown = properties['Content Markdown'].rich_text!.map((part) => part.text.content).join('');
      return new Response(JSON.stringify({ results: [{ ...page, properties: { ...properties, 'Content Markdown': { rich_text: [{ plain_text: markdown }] } } }] }));
    });
    vi.stubGlobal('fetch', fetch);
    const created = await createRecipeInNotion({ title: '肉醬', slug: 'bolognese-sauce', type: 'cooking', desc: '', ingredient: ['牛絞肉', '鹽'], labels: [], coverImage: '', gallery: [], contentMarkdown: '### 步驟\n1. 慢燉', scaling, published: true, date: '2026-11-16' });
    expect(created.scaling).toEqual(scaling);
    const loaded = await getRecipeBySlugFromNotion('cooking', 'bolognese-sauce');
    expect(loaded?.scaling).toEqual(scaling);
    expect(loaded?.content).not.toContain('baseServings');
    expect(Object.keys(page.properties)).not.toContain('Scaling');
  });
});
