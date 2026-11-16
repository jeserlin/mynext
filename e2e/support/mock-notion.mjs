import process from 'node:process';
import { notionRecipePages } from '../fixtures/notion-recipes.mjs';
import { notionBookPages } from '../fixtures/notion-books.mjs';

// This preload is installed only by run-with-fixtures.mjs, never by the app.
if (process.env.MYNEXT_E2E_NOTION === '1') {
  const originalFetch = globalThis.fetch;
  const matches = (page, filter) => {
    if (!filter) return true;
    if (filter.and) return filter.and.every((item) => matches(page, item));
    if (filter.or) return filter.or.some((item) => matches(page, item));
    const property = page.properties[filter.property];
    if (filter.select) return property?.select?.name === filter.select.equals;
    if (filter.checkbox) return property?.checkbox === filter.checkbox.equals;
    if (filter.rich_text) return property?.rich_text?.map((item) => item.plain_text).join('') === filter.rich_text.equals;
    throw new Error(`Unsupported fixture filter: ${JSON.stringify(filter)}`);
  };

  globalThis.fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
    if (url.hostname !== 'api.notion.com') return originalFetch(input, init);
    const pages = url.pathname === '/v1/databases/e2e-recipes/query' ? notionRecipePages
      : url.pathname === '/v1/databases/e2e-books/query' ? notionBookPages : null;
    if (!pages || (init?.method || input.method || 'GET') !== 'POST') {
      throw new Error(`Unexpected Notion request in browser test: ${url.pathname}`);
    }
    const body = JSON.parse(init?.body || await input.clone().text());
    const results = pages.filter((page) => matches(page, body.filter));
    return new Response(JSON.stringify({ results, has_more: false, next_cursor: null }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  };
}
