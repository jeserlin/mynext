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
