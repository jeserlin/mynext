// Fixed public book data; browser tests do not depend on a private Notion database.
const books = [
  { isbn: '9786263143630', title: '小鳥：《博士熱愛的算式》', date: '2025-11-01', notes: '' },
  { isbn: '9786267483794', title: '深夜圖書館的宵夜', date: '2025-10-01', notes: '### 閱讀筆記\n\n這是一段測試用的閱讀心得。' },
  { isbn: '9789869462518', title: '在咖啡冷掉之前', date: '2024-01-01', notes: '' },
];
const richText = (content) => [{ type: 'text', plain_text: content, text: { content } }];

export const notionBookPages = books.map((book, index) => ({
  id: `e2e-book-${index + 1}`,
  properties: {
    Name: { title: richText(book.title) },
    ISBN: { rich_text: richText(book.isbn) },
    Author: { rich_text: richText('測試作者') },
    'Cover Image': { url: '/yuan.png' },
    'Read Date': { date: { start: book.date } },
    Notes: { rich_text: richText(book.notes) },
  },
}));
