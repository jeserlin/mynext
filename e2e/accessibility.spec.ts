import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/about-me', '/books', '/cooking', '/baking'];

test.describe('public page accessibility', () => {
  routes.forEach((route) => {
    test(`${route} has no WCAG 2.1 A/AA violations`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.ok()).toBe(true);

      const accessibilityScan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const violations = accessibilityScan.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      }));

      expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
    });
  });
});
