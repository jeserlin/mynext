import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

export default async function markdownToHtml(markdown) {
  const md = new MarkdownIt({
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code>
        </pre>`;
      }

      return `<pre><code class="hljs language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
    },
  });
  const result = md.render(markdown);

  return result.toString();
}
