import { expect, test } from '@playwright/test';

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
  await page.getByRole('button', { name: '2025', exact: true }).click();
  await expect(page.getByRole('button', { name: '2025', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: '小鳥：《博士熱愛的算式》' })).toBeDisabled();

  const noteButton = page.getByRole('button', { name: 'Read notes for 深夜圖書館的宵夜' });
  await noteButton.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('dialog')).toBeVisible();

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

test('admin recipe type uses an interactive selector', async ({ page }) => {
  const response = await page.goto('/admin/new-recipe');

  expect(response?.ok()).toBe(true);
  await expect(page.getByText('Edit Existing', { exact: true })).toBeVisible();

  const selector = page.getByRole('button', { name: 'Cooking', exact: true }).first();
  await selector.click();

  const listbox = page.getByRole('listbox', { name: 'Recipe type' });
  await expect(listbox).toBeVisible();
  await expect(listbox.getByRole('option', { name: 'Cooking' })).toBeVisible();
  await listbox.getByRole('option', { name: 'Baking' }).click();

  await expect(page.getByRole('button', { name: 'Baking', exact: true }).first()).toBeVisible();
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
