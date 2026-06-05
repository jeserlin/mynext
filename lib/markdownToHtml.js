import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  'br',
  'div',
  'iframe',
  'img',
];

const allowedAttributes = {
  ...sanitizeHtml.defaults.allowedAttributes,
  a: [
    ...(sanitizeHtml.defaults.allowedAttributes.a || []),
    'target',
    'rel',
  ],
  code: ['class'],
  div: ['class', 'style'],
  iframe: [
    'allowfullscreen',
    'allowtransparency',
    'frameborder',
    'height',
    'loading',
    'scrolling',
    'src',
    'title',
    'width',
  ],
  img: ['alt', 'height', 'loading', 'src', 'title', 'width'],
  pre: ['class'],
};

const allowedStyles = {
  div: {
    overflow: [/^auto$/, /^hidden$/, /^scroll$/],
    'overflow-x': [/^auto$/, /^hidden$/, /^scroll$/],
  },
};

export default async function markdownToHtml(markdown) {
  const md = new MarkdownIt({
    html: true,
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code>
        </pre>`;
      }

      return `<pre><code class="hljs language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
    },
  });
  const result = md.render(markdown);

  return sanitizeHtml(result.toString(), {
    allowedAttributes,
    allowedIframeHostnames: ['codepen.io'],
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    allowedStyles,
    allowedTags,
    allowProtocolRelative: true,
    exclusiveFilter: (frame) => frame.tag === 'iframe' && !frame.attribs.src,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        rel: 'noopener noreferrer',
      }),
    },
  });
}
