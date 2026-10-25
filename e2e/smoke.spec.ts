import { expect, test } from '@playwright/test';

const publicRoutes = [
  { path: '/about-me', activeLink: 'About Me' },
  { path: '/books', activeLink: 'Books' },
  { path: '/cooking', activeLink: 'Cooking' },
  { path: '/baking', activeLink: 'Baking' },
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
