import { describe, expect, it } from 'vitest';

import markdownToHtml from './markdownToHtml';

describe('markdownToHtml', () => {
  it('removes scripts and unsafe links', async () => {
    const html = await markdownToHtml('<a href="javascript:alert(1)">unsafe</a><script>alert(1)</script>');

    expect(html).not.toContain('<script');
    expect(html).not.toContain('href="javascript:');
  });

  it('allows CodePen embeds but removes untrusted iframes', async () => {
    const html = await markdownToHtml(`
<iframe src="https://evil.example/embed"></iframe>
<iframe src="https://codepen.io/example/embed/demo"></iframe>
`);

    expect(html).not.toContain('evil.example');
    expect(html).toContain('https://codepen.io/example/embed/demo');
  });

  it('adds safe relationship attributes to links', async () => {
    const html = await markdownToHtml('[Example](https://example.com)');

    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('highlights recognized fenced code blocks', async () => {
    const html = await markdownToHtml('```js\nconst answer = 42;\n```');

    expect(html).toContain('class="hljs language-js"');
    expect(html).toContain('answer =');
  });
});
