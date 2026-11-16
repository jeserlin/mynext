import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import SeoHeader from 'components/seoHeader';
import { adminHeaderName } from 'lib/admin';
import type { AdminBook } from 'lib/notionBooks';

interface BookForm {
  isbn: string;
  title: string;
  author: string;
  coverImage: string;
  date: string;
  content: string;
}

const localDate = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const emptyBook = (): BookForm => ({ isbn: '', title: '', author: '', coverImage: '', date: localDate(), content: '' });
const fieldClass = 'w-full rounded-lg border border-[#d8d0c3] bg-white px-4 py-3 text-sm text-primary-content outline-none focus:border-primary';
const buttonClass = 'btn shrink-0 !border-[#705c55] !bg-[#705c55] !text-white hover:!bg-[#5b4943] disabled:!border-[#d8cfca] disabled:!bg-[#d8cfca] disabled:!text-[#4a3c36]';

export default function NewBook() {
  const [secret, setSecret] = useState('');
  const [savedSecret, setSavedSecret] = useState('');
  const [form, setForm] = useState<BookForm>(emptyBook);
  const [pageId, setPageId] = useState('');
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [dirty, setDirty] = useState(false);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem('mynext-admin-secret');
    if (stored) {
      // Restore browser-only credentials after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSecret(stored);
      setSavedSecret(stored);
    }
  }, []);

  useEffect(() => {
    if (!savedSecret) return;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setListError('');
      try {
        const response = await fetch('/api/admin/books', {
          headers: { [adminHeaderName]: savedSecret }, signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || '無法載入書籍清單');
        if (!controller.signal.aborted) setBooks(data.books || []);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setBooks([]);
          setListError(cause instanceof Error ? cause.message : '無法載入書籍清單');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [savedSecret, reload]);

  const update = (field: keyof BookForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setDirty(true);
  };
  const canReplace = () => !dirty || window.confirm('目前有尚未儲存的修改，確定要捨棄嗎？');
  const clearMessages = () => { setError(''); setMessage(''); };
  const startNew = () => {
    if (!canReplace()) return;
    setForm(emptyBook()); setPageId(''); setSelectedId(''); setDirty(false); clearMessages();
  };
  const loadBook = () => {
    const book = books.find((item) => item.id === selectedId);
    if (!book || !canReplace()) return;
    setForm({ isbn: book.slug || '', title: book.title || '', author: book.author,
      coverImage: book.coverImage || '', date: book.date.slice(0, 10), content: book.content || '' });
    setPageId(book.id); setDirty(false); clearMessages();
  };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true); clearMessages();
    try {
      const response = await fetch('/api/admin/save-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', [adminHeaderName]: savedSecret },
        body: JSON.stringify({ ...form, isbn: form.isbn.replace(/[-\s]/g, ''), ...(pageId ? { pageId } : {}) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 401 ? '管理密鑰不正確，請重新輸入並儲存。' : data.error || '無法儲存書籍');
      setMessage(data.warning ? '書籍已儲存至 Notion，但 Books 頁更新失敗，請稍後重新整理。'
        : pageId ? '書籍已更新，Books 頁已同步。' : '書籍已新增，可在 Books 頁查看。');
      setDirty(false);
      if (!pageId) setForm(emptyBook());
      setReload((value) => value + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '無法儲存書籍');
    } finally {
      setIsSaving(false);
    }
  };
  const query = search.trim().toLowerCase();
  const filteredBooks = books.filter((book) => [book.title, book.author, book.slug].some((value) => value?.toLowerCase().includes(query)));

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <SeoHeader title="書籍編輯與發布" description="新增書籍與編輯閱讀筆記" path="/admin/new-book" />
      <h1 className="mb-3 text-2xl font-normal text-primary-content">書籍編輯與發布</h1>
      <p className="mb-6 text-sm text-primary-content/70">新增書籍，或載入現有書籍修改資料與閱讀筆記。</p>
      <div className="mb-6">
        <label htmlFor="book-secret" className="mb-2 block text-sm text-primary-content">管理密鑰</label>
        <div className="flex flex-wrap gap-2">
          <input id="book-secret" className={`${fieldClass} min-w-0 flex-1`} type="password" autoComplete="off" value={secret} onChange={(event) => setSecret(event.target.value)} />
          <button type="button" className={buttonClass} disabled={!secret.trim() || isSaving} onClick={() => {
            window.localStorage.setItem('mynext-admin-secret', secret.trim());
            setSavedSecret(secret.trim()); setReload((value) => value + 1);
          }}>儲存密鑰</button>
        </div>
      </div>
      <section aria-label="編輯現有書籍" className="mb-8 rounded-lg border border-[#d8d0c3] bg-white p-4">
        <h2 className="mb-2 text-lg text-primary-content">編輯現有書籍</h2>
        <p className="mb-4 text-sm text-primary-content/70">搜尋書名、作者或 ISBN，選擇書籍後載入編輯。</p>
        {!savedSecret ? <p className="text-sm text-primary-content">請先輸入並儲存管理密鑰，即可載入現有書籍。</p> : <>
          <label className="block text-sm text-primary-content">搜尋書籍
            <input className={`${fieldClass} mt-2 mb-3`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="書名、作者或 ISBN" />
          </label>
          {loading ? <p role="status">正在載入書籍…</p> : listError ? <p role="alert" className="text-sm text-red-700">書籍清單載入失敗：{listError}</p> : books.length === 0 ? <p>目前沒有書籍。</p> : <>
            <div>
              <label htmlFor="existing-book" className="block text-sm text-primary-content">選擇書籍</label>
              <select id="existing-book" className={`${fieldClass} mt-2 pr-10`} value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                <option value="">請選擇要編輯的書籍</option>
                {filteredBooks.map((book) => <option key={book.id} value={book.id}>{book.title}／{book.author}（{book.slug}）</option>)}
              </select>
            </div>
            {filteredBooks.length === 0 && <p className="mt-2 text-sm">找不到符合的書籍。</p>}
          </>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={buttonClass} disabled={loading || isSaving || Boolean(listError) || !filteredBooks.some((book) => book.id === selectedId)} onClick={loadBook}>載入書籍</button>
            <button type="button" className={buttonClass} disabled={loading || isSaving} onClick={() => setReload((value) => value + 1)}>重新載入清單</button>
          </div>
        </>}
      </section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg text-primary-content">{pageId ? '編輯書籍' : '新增書籍'}</h2>
        <button type="button" className={buttonClass} disabled={isSaving} onClick={startNew}>新增另一書籍</button>
      </div>
      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-4 text-sm text-green-800">{message}</p>}
      <form onSubmit={save} className="space-y-5">
        <fieldset disabled={isSaving} className="min-w-0 space-y-5">
          <div>
            <label htmlFor="book-title" className="block text-sm text-primary-content">書名</label>
            <div className="mt-2 flex flex-wrap gap-2">
              <input id="book-title" className={`${fieldClass} min-w-0 flex-1`} value={form.title} onChange={(event) => update('title', event.target.value)} maxLength={200} required />
              <a href={form.title.trim() ? `https://search.books.com.tw/search/query/key/${encodeURIComponent(form.title.trim())}/cat/all` : 'https://www.books.com.tw/'} target="_blank" rel="noopener noreferrer" className={buttonClass}>搜尋博客來</a>
            </div>
          </div>
          <label className="block text-sm text-primary-content">ISBN
            <input className={`${fieldClass} mt-2`} inputMode="numeric" value={form.isbn} onChange={(event) => update('isbn', event.target.value)} required />
          </label>
          <label className="block text-sm text-primary-content">作者
            <input className={`${fieldClass} mt-2`} value={form.author} onChange={(event) => update('author', event.target.value)} maxLength={200} required />
          </label>
          <label className="block text-sm text-primary-content">封面圖片網址（選填）
            <input className={`${fieldClass} mt-2`} type="url" value={form.coverImage} onChange={(event) => update('coverImage', event.target.value)} placeholder="https://…" />
          </label>
          {form.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.coverImage} alt="書籍封面預覽" className="max-h-48 w-auto rounded border border-[#d8d0c3]" />
          )}
          <label className="block text-sm text-primary-content">閱讀日期
            <input className={`${fieldClass} mt-2`} type="date" value={form.date} onChange={(event) => update('date', event.target.value)} required />
          </label>
          <label className="block text-sm text-primary-content">摘錄或閱讀筆記（選填）
            <textarea className={`${fieldClass} mt-2 min-h-48`} value={form.content} onChange={(event) => update('content', event.target.value)} maxLength={20000} placeholder="貼上喜歡的句子，或記下閱讀心得，支援 Markdown…" />
          </label>
          <button type="submit" className={buttonClass} disabled={!savedSecret || secret.trim() !== savedSecret}>
            {isSaving ? '儲存中…' : pageId ? '儲存修改' : '新增書籍'}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
