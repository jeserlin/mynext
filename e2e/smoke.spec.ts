import { expect, test } from '@playwright/test';
import type { NotionRecipe } from '../types/recipe';
import { editorRecipeFixture } from './fixtures/recipe';

const publicRoutes = [
  { path: '/about-me', activeLink: 'About Me' },
  { path: '/books', activeLink: 'Books' },
];

test.describe('public route smoke tests', () => {
  publicRoutes.forEach(({ path, activeLink }) => {
    test(`${path} renders its navigation state`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.ok()).toBe(true);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
      await expect(page.getByRole('link', { name: activeLink })).toHaveAttribute('aria-current', 'page');
    });
  });
});

test('books show headings and open notes by keyboard only when notes exist', async ({ page }) => {
  await page.goto('/books');
  await expect(page.getByRole('heading', { name: 'Books', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Total: 3', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '2025', exact: true }).click();
  await expect(page.getByRole('button', { name: '2025', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Total: 2', { exact: true })).toBeVisible();
  await expect(page.getByText('在咖啡冷掉之前', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '小鳥：《博士熱愛的算式》' })).toBeDisabled();

  const noteButton = page.getByRole('button', { name: 'Read notes for 深夜圖書館的宵夜' });
  await noteButton.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('這是一段測試用的閱讀心得。');

  await page.goto('/tech');
  await expect(page.getByRole('heading', { name: 'Learning', level: 1 })).toBeVisible();
});

test('event propagation article renders all Mermaid diagrams', async ({ page }) => {
  await page.goto('/tech/event-bubbling-event-capturing');

  const diagrams = page.locator('.mermaid');
  await expect(diagrams).toHaveCount(3);
  for (const diagram of await diagrams.all()) {
    await expect(diagram.locator('svg .nodeLabel')).toHaveCount(5);
    await expect(diagram.locator('.error-text')).toHaveCount(0);
  }
});

test('bolognese ingredient quantities scale and reset on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/cooking/bolognese-sauce');
  const scaler = page.getByRole('region', { name: '材料與份量換算' });
  const beef = scaler.getByRole('listitem').filter({ hasText: '牛絞肉' });
  const garlic = scaler.getByRole('listitem').filter({ hasText: '蒜頭' });
  const salt = scaler.getByRole('listitem').filter({ hasText: /^鹽/ });
  await expect(beef).toHaveText('牛絞肉320 g');
  const pork = scaler.getByRole('listitem').filter({ hasText: '豬絞肉' });
  const amount = scaler.getByLabel('實際用量');
  await amount.fill('300');
  await expect(beef).toHaveText('牛絞肉300 g');
  await expect(pork).toHaveText('豬絞肉468.8 g');
  await expect(scaler.getByRole('status')).toContainText('依牛絞肉 300 g換算');
  await scaler.getByLabel('基準食材').selectOption({ label: '豬絞肉（原用量 500 g）' });
  await amount.fill('300');
  await expect(beef).toHaveText('牛絞肉192 g');
  await expect(pork).toHaveText('豬絞肉300 g');
  await amount.fill('0');
  await expect(amount).toHaveAttribute('aria-invalid', 'true');
  await expect(pork).toHaveText('豬絞肉300 g');
  await scaler.getByRole('button', { name: '半份', exact: true }).click();
  await expect(beef).toHaveText('牛絞肉160 g');
  await expect(amount).toHaveValue('250');
  await scaler.getByRole('button', { name: '一份', exact: true }).click();
  await expect(beef).toHaveText('牛絞肉320 g');
  await scaler.getByRole('button', { name: '兩份', exact: true }).click();
  await expect(beef).toHaveText('牛絞肉640 g');
  await expect(garlic).toHaveText('蒜頭6–8 個');
  await expect(salt).toHaveText('鹽適量');
  const servings = scaler.getByLabel('配方份數');
  await servings.fill('1/2');
  await expect(beef).toHaveText('牛絞肉160 g');
  await expect(garlic).toHaveText('蒜頭1.5–2 個');
  await servings.fill('0');
  await expect(servings).toHaveAttribute('aria-invalid', 'true');
  await expect(beef).toHaveText('牛絞肉160 g');
  await scaler.getByRole('button', { name: '還原原配方' }).click();
  await expect(servings).toHaveValue('1');
  await expect(beef).toHaveText('牛絞肉320 g');
  await expect(page.getByText('1.5小時', { exact: true })).toBeVisible();
  await page.goto('/cooking/pumpkin-soup');
  await expect(page.getByRole('region', { name: '材料與份量換算' })).toHaveCount(0);
});

test('legacy recipe indexes redirect to the recipes finder', async ({ page }) => {
  for (const route of ['/cooking', '/baking']) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/recipes$/);
    await expect(page.getByRole('heading', { name: 'Recipes' })).toBeVisible();
  }
});

test('admin recipe list distinguishes authentication and load errors from an empty list', async ({ page }) => {
  await page.goto('/admin/new-recipe');
  await expect(page.getByText('請先在上方輸入並儲存管理密鑰，驗證後即可載入現有食譜。')).toBeVisible();
  await expect(page.getByText('目前沒有料理食譜。')).toHaveCount(0);
  await page.route('**/api/admin/recipes?*', (route) => route.fulfill({ status: 401, json: { error: 'Unauthorized' } }));
  await page.getByPlaceholder('管理密鑰', { exact: true }).fill('test-only-secret');
  await page.getByRole('button', { name: '儲存密鑰', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: '食譜清單載入失敗' })).toContainText('管理密鑰不正確');
  await expect(page.getByText('目前沒有料理食譜。')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '重新載入食譜' })).toBeVisible();
});

test('admin editor preserves scaling through load, edit, save, reload and disable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let recipe: NotionRecipe = structuredClone(editorRecipeFixture);
  let saves = 0;
  await page.route('**/api/admin/recipes?*', (route) => route.fulfill({ json: { recipes: [recipe] } }));
  await page.route('**/api/admin/recipe?*', (route) => route.fulfill({ json: recipe }));
  await page.route('**/api/admin/save-recipe', async (route) => {
    const body = route.request().postDataJSON();
    expect(body.previousSlug).toBe('bolognese-sauce');
    if (saves === 0) {
      expect(body.source).toBe('markdown');
      expect(body.scaling.groups[0].items[0].amount).toBe(300);
      expect(body.scaling.groups[1].items.find((item: { name: string }) => item.name === '蒜頭').maxAmount).toBe(4);
      expect(body.contentMarkdown).not.toContain('### 材料');
    } else {
      expect(body.pageId).toBe('notion-page');
      expect(body.scaling).toBeNull();
      expect(body.contentMarkdown).toContain('牛絞肉 300 g');
      expect(body.contentMarkdown).toContain('### 步驟');
    }
    recipe = { ...recipe, id: 'notion-page', source: 'notion', scaling: body.scaling || undefined, content: body.contentMarkdown };
    saves++;
    await route.fulfill({ json: { ...recipe, revalidationError: '' } });
  });
  await page.goto('/admin/new-recipe');
  await page.getByPlaceholder('管理密鑰', { exact: true }).fill('test-only-secret');
  await page.getByRole('button', { name: '儲存密鑰', exact: true }).click();
  await page.getByRole('button', { name: /義大利經典肉醬/ }).click();
  await expect(page.getByLabel('啟用份量換算')).toBeChecked();
  await expect(page.getByLabel('原配方份數')).toHaveValue('1');
  const beef = page.getByRole('group', { name: '材料 1-1', exact: true });
  await expect(beef.getByLabel('材料名稱', { exact: true })).toHaveValue('牛絞肉');
  await beef.getByLabel('數量', { exact: true }).fill('1/0');
  await page.getByRole('button', { name: '儲存食譜至 Notion' }).click();
  await expect(page.getByText(/份量換算：/)).toBeVisible();
  expect(saves).toBe(0);
  await beef.getByLabel('數量', { exact: true }).fill('300');
  await page.getByRole('button', { name: '儲存食譜至 Notion' }).click();
  await expect(page.getByText('食譜已儲存至 Notion：bolognese-sauce', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /義大利經典肉醬/ }).click();
  await expect(beef.getByLabel('數量', { exact: true })).toHaveValue('300');
  await page.getByLabel('啟用份量換算').uncheck();
  await page.getByRole('button', { name: '儲存食譜至 Notion' }).click();
  await expect(page.getByText('已更新 Notion 食譜：bolognese-sauce', { exact: true })).toBeVisible();
  expect(saves).toBe(2);
});

test('admin can add scaling groups and fractional ingredients to a new recipe', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let saved = false;
  await page.route('**/api/admin/save-recipe', async (route) => {
    const body = route.request().postDataJSON();
    expect(body.scaling.baseServings).toBe(2);
    expect(body.scaling.groups).toHaveLength(2);
    expect(body.scaling.groups[0].items[0]).toEqual(expect.objectContaining({ name: '糖', amount: 0.5, unit: '湯匙' }));
    expect(body.scaling.groups[1].items[0]).toEqual(expect.objectContaining({ name: '鹽', note: '適量' }));
    expect(body.ingredients).toBe('糖\n鹽');
    expect(body.contentMarkdown).not.toContain('食材1');
    expect(body.contentMarkdown).toContain('### 步驟');
    saved = true;
    await route.fulfill({ json: { slug: 'scaling-test', revalidationError: '' } });
  });
  await page.goto('/admin/new-recipe');
  await page.getByLabel('食譜名稱', { exact: true }).fill('Scaling test');
  await page.getByLabel('啟用份量換算').check();
  await page.getByLabel('原配方份數').fill('2');
  const first = page.getByRole('group', { name: '材料 1-1', exact: true });
  await first.getByLabel('材料名稱', { exact: true }).fill('糖');
  await first.getByLabel('數量', { exact: true }).fill('1/2');
  await first.getByLabel('單位', { exact: true }).fill('湯匙');
  await page.getByRole('button', { name: '新增材料至分組 1', exact: true }).click();
  await page.getByRole('button', { name: '移除材料 1-2', exact: true }).click();
  await page.getByRole('button', { name: '新增材料分組', exact: true }).click();
  const second = page.getByRole('group', { name: '材料 2-1', exact: true });
  await second.getByLabel('材料名稱', { exact: true }).fill('鹽');
  await second.getByLabel('備註', { exact: true }).fill('適量');
  await page.getByRole('button', { name: '儲存食譜至 Notion' }).click();
  await expect(page.getByText('食譜已儲存至 Notion：scaling-test', { exact: true })).toBeVisible();
  expect(saved).toBe(true);
});

test('admin recipe type uses an interactive selector', async ({ page }) => {
  const response = await page.goto('/admin/new-recipe');

  expect(response?.ok()).toBe(true);
  await expect(page.getByText('編輯現有食譜', { exact: true })).toBeVisible();

  const selector = page.getByRole('button', { name: '料理', exact: true }).first();
  await selector.click();

  const listbox = page.getByRole('listbox', { name: '食譜類別' });
  await expect(listbox).toBeVisible();
  await expect(listbox.getByRole('option', { name: '料理' })).toBeVisible();
  await listbox.getByRole('option', { name: '烘焙' }).click();

  await expect(page.getByRole('button', { name: '烘焙', exact: true }).first()).toBeVisible();
  await expect(listbox).toBeHidden();
});

test('recipe finder searches titles and dish types', async ({ page }) => {
  const response = await page.goto('/recipes');

  expect(response?.ok()).toBe(true);
  const search = page.getByRole('searchbox', { name: 'Search recipes by title or type' });
  const dishTypeFilter = page.getByRole('combobox', { name: 'Filter by recipe type' });

  await page.getByRole('button', { name: 'Baking', exact: true }).click();
  await expect(dishTypeFilter).toBeVisible();
  await expect(dishTypeFilter.getByRole('option', { name: 'soup', exact: true })).toHaveCount(0);
  await expect(dishTypeFilter.getByRole('option', { name: 'pasta', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Cooking', exact: true }).click();
  await expect(dishTypeFilter.getByRole('option', { name: 'soup', exact: true })).toHaveCount(1);
  await expect(dishTypeFilter.getByRole('option', { name: 'pasta', exact: true })).toHaveCount(1);
  await dishTypeFilter.selectOption({ label: 'pasta' });
  await expect(page.getByText('2 recipes')).toBeVisible();

  await search.fill('pasta');
  await expect(page.getByRole('heading', { name: '牛肝菌義大利麵' })).toBeVisible();
  await expect(page.getByText('2 recipes')).toBeVisible();

  await search.fill('soup');
  await dishTypeFilter.selectOption('');
  await expect(page.getByRole('heading', { name: '南瓜濃湯' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '牛肝菌義大利麵' })).toHaveCount(0);

  await page.getByRole('link', { name: /南瓜濃湯/ }).click();
  await expect(page).toHaveURL(/\/cooking\/pumpkin-soup$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/recipes$/);
  await expect(page.getByRole('button', { name: 'All recipes', exact: true })).toHaveClass(/btn-sm/);
});

test('recipe finder search expands from an icon on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/recipes');

  const searchToggle = page.getByRole('button', { name: 'Open recipe search' });
  const search = page.getByRole('searchbox', { name: 'Search recipes by title or type' });

  await expect(searchToggle).toBeVisible();
  await expect(search).toBeHidden();
  await searchToggle.click();
  await expect(search).toBeVisible();
  await expect(search).toBeFocused();
  await search.fill('pasta');
  await expect(page.getByRole('heading', { name: '牛肝菌義大利麵' })).toBeVisible();
  await page.getByRole('button', { name: 'Hide recipe search' }).click();
  await expect(search).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open recipe search' })).toBeFocused();
});

test('book editor loads, edits, saves and starts a new book in Chinese', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const id = '406ea919-6e46-80aa-9958-e44b3b8a2457';
  let book = { id, slug: '9786263143630', title: '小鳥', author: '小川洋子', coverImage: '', date: '2025-11-01T00:00:00.000Z', content: '### 原始筆記\n\n喜歡的一句話。' };
  const writes: Record<string, string>[] = [];
  await page.route('**/api/admin/books', (route) => route.fulfill({ json: { books: [book] } }));
  await page.route('**/api/admin/save-book', async (route) => {
    const body = route.request().postDataJSON();
    writes.push(body);
    book = { ...book, ...body, slug: body.isbn };
    await route.fulfill({ json: { isbn: body.isbn, refreshed: true } });
  });
  await page.goto('/admin/new-book');
  await expect(page.getByText('請先輸入並儲存管理密鑰，即可載入現有書籍。')).toBeVisible();
  await page.getByLabel('管理密鑰').fill('test-only-secret');
  await page.getByRole('button', { name: '儲存密鑰', exact: true }).click();
  await page.getByLabel('搜尋書籍', { exact: true }).fill('小川');
  await page.getByLabel('選擇書籍', { exact: true }).selectOption(id);
  await page.getByRole('button', { name: '載入書籍', exact: true }).click();
  await expect(page.getByLabel('閱讀日期', { exact: true })).toHaveValue('2025-11-01');
  await expect(page.getByLabel('摘錄或閱讀筆記（選填）')).toHaveValue(book.content);
  await page.getByLabel('摘錄或閱讀筆記（選填）').fill('### 新筆記\n\n修改後的心得。');
  await page.getByRole('button', { name: '儲存修改', exact: true }).click();
  await expect(page.getByText('書籍已更新，Books 頁已同步。')).toBeVisible();
  expect(writes[0]).toMatchObject({ pageId: id, isbn: '9786263143630', content: '### 新筆記\n\n修改後的心得。' });
  await page.getByRole('button', { name: '載入書籍', exact: true }).click();
  await expect(page.getByLabel('摘錄或閱讀筆記（選填）')).toHaveValue('### 新筆記\n\n修改後的心得。');
  await page.getByRole('button', { name: '新增另一書籍', exact: true }).click();
  await expect(page.getByLabel('書名', { exact: true })).toHaveValue('');
  await page.getByLabel('書名', { exact: true }).fill('另一本書');
  await page.getByLabel('作者', { exact: true }).fill('另一位作者');
  await page.getByLabel('ISBN', { exact: true }).fill('9786263582309');
  await page.getByRole('button', { name: '新增書籍', exact: true }).click();
  await expect(page.getByText('書籍已新增，可在 Books 頁查看。')).toBeVisible();
  expect(writes[1]).not.toHaveProperty('pageId');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('book editor shows load errors separately from an empty collection', async ({ page }) => {
  await page.route('**/api/admin/books', (route) => route.fulfill({ status: 401, json: { error: '管理密鑰不正確，請重新輸入。' } }));
  await page.goto('/admin/new-book');
  await page.getByLabel('管理密鑰').fill('incorrect-secret');
  await page.getByRole('button', { name: '儲存密鑰', exact: true }).click();
  await expect(page.getByRole('region', { name: '編輯現有書籍' }).getByRole('alert')).toContainText('管理密鑰不正確');
  await expect(page.getByText('目前沒有書籍。')).toHaveCount(0);
  await page.route('**/api/admin/books', (route) => route.fulfill({ json: { books: [] } }));
  await page.getByRole('button', { name: '重新載入清單', exact: true }).click();
  await expect(page.getByText('目前沒有書籍。')).toBeVisible();
  await expect(page.getByRole('region', { name: '編輯現有書籍' }).getByRole('alert')).toHaveCount(0);
});

test('admin home shares and clears the secret across both editors', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const credentials: string[] = [];
  await page.route('**/api/admin/books', (route) => {
    credentials.push(route.request().headers()['x-admin-secret']);
    return route.fulfill({ json: { books: [] } });
  });
  await page.route('**/api/admin/recipes?*', (route) => {
    credentials.push(route.request().headers()['x-admin-secret']);
    return route.fulfill({ json: { recipes: [] } });
  });
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: '內容管理', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '清除密鑰', exact: true })).toBeDisabled();
  await page.getByLabel('輸入管理密鑰').fill('test-only-secret');
  await page.getByRole('button', { name: '儲存密鑰', exact: true }).click();
  await page.getByRole('link', { name: /^管理書籍/ }).click();
  await expect(page.getByText('目前沒有書籍。')).toBeVisible();
  await expect(page.getByLabel('管理密鑰', { exact: true })).toHaveValue('test-only-secret');
  await page.getByRole('link', { name: '返回管理首頁', exact: true }).click();
  await expect(page.getByLabel('輸入管理密鑰')).toHaveValue('test-only-secret');
  await page.getByRole('link', { name: /^管理食譜/ }).click();
  await expect(page.getByPlaceholder('管理密鑰', { exact: true })).toHaveValue('test-only-secret');
  await expect.poll(() => credentials.length).toBeGreaterThanOrEqual(2);
  expect(credentials.every((secret) => secret === 'test-only-secret')).toBe(true);
  await page.getByRole('link', { name: '返回管理首頁', exact: true }).click();
  await page.getByRole('button', { name: '清除密鑰', exact: true }).click();
  await expect(page.getByLabel('輸入管理密鑰')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('mynext-admin-secret'))).toBeNull();
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('尚未儲存管理密鑰。');
  await page.getByRole('link', { name: /^管理書籍/ }).click();
  await expect(page.getByText('請先輸入並儲存管理密鑰，即可載入現有書籍。')).toBeVisible();
  await page.getByRole('link', { name: '返回管理首頁', exact: true }).click();
  await page.getByRole('link', { name: /^管理食譜/ }).click();
  await expect(page.getByText('請先在上方輸入並儲存管理密鑰，驗證後即可載入現有食譜。')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).locator('a[href^="/admin"]')).toHaveCount(0);
});


test('admin pages stay out of public navigation and request no indexing', async ({ page }) => {
  for (const path of ['/admin', '/admin/new-book', '/admin/new-recipe']) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  }
  await page.goto('/about-me');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).locator('a[href^="/admin"]')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).locator('a[href^="/admin"]')).toHaveCount(0);
});
