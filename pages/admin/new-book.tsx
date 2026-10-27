import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import SeoHeader from 'components/seoHeader';
import { adminHeaderName } from 'lib/admin';

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

const emptyBook = (): BookForm => ({
  isbn: '', title: '', author: '', coverImage: '',
  date: localDate(), content: '',
});

const fieldClass = 'w-full rounded-lg border border-[#d8d0c3] bg-white px-4 py-3 text-sm text-primary-content outline-none focus:border-primary';
const buttonClass = 'btn shrink-0 !border-[#705c55] !bg-[#705c55] !text-white hover:!bg-[#5b4943] disabled:!border-[#d8cfca] disabled:!bg-[#d8cfca] disabled:!text-[#4a3c36]';

export default function NewBook() {
  const [secret, setSecret] = useState('');
  const [form, setForm] = useState<BookForm>(emptyBook);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedSecret = window.localStorage.getItem('mynext-admin-secret');
    if (storedSecret) {
      // Restore client-only storage after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSecret(storedSecret);
    }
  }, []);

  const update = (field: keyof BookForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/save-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', [adminHeaderName]: secret },
        body: JSON.stringify({ ...form, isbn: form.isbn.replace(/[-\s]/g, '') }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save book');
      setMessage(data.warning
        ? `Book saved to Notion, but the Books page did not refresh: ${data.warning}`
        : 'Book saved. You can now find it on the Books page.');
      setForm(emptyBook());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save book');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <SeoHeader title="New Book" description="Private book publishing tool" path="/admin/new-book" />
      <h1 className="mb-3 text-2xl font-normal text-primary-content">Add book</h1>
      <p className="mb-6 text-sm text-primary-content/70">Search 博客來 for the book, then paste its ISBN and add your notes.</p>
      <label className="mb-6 block text-sm text-primary-content">
        Admin secret
        <input
          className={`${fieldClass} mt-2`}
          type="password"
          autoComplete="off"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
        />
      </label>
      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-4 text-sm text-green-800">{message}</p>}
      <form onSubmit={save} className="space-y-5">
        <div>
          <label htmlFor="book-title" className="block text-sm text-primary-content">Title</label>
          <div className="mt-2 flex gap-2">
            <input id="book-title" className={`${fieldClass} min-w-0`} value={form.title} onChange={(event) => update('title', event.target.value)} required />
            <a
              href={form.title.trim() ? `https://search.books.com.tw/search/query/key/${encodeURIComponent(form.title.trim())}/cat/all` : 'https://www.books.com.tw/'}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
            >
              Search 博客來
            </a>
          </div>
        </div>
        <label className="block text-sm text-primary-content">
          ISBN
          <input id="isbn" className={`${fieldClass} mt-2`} inputMode="numeric" value={form.isbn} onChange={(event) => update('isbn', event.target.value)} required />
        </label>
        <label className="block text-sm text-primary-content">
          Author
          <input className={`${fieldClass} mt-2`} value={form.author} onChange={(event) => update('author', event.target.value)} required />
        </label>
        <label className="block text-sm text-primary-content">
          Cover image URL (optional)
          <input className={`${fieldClass} mt-2`} type="url" value={form.coverImage} onChange={(event) => update('coverImage', event.target.value)} placeholder="https://…" />
        </label>
        {form.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.coverImage} alt="Book cover preview" className="max-h-48 w-auto rounded border border-[#d8d0c3]" />
        )}
        <label className="block text-sm text-primary-content">
          Date read
          <input className={`${fieldClass} mt-2`} type="date" value={form.date} onChange={(event) => update('date', event.target.value)} required />
        </label>
        <label className="block text-sm text-primary-content">
          Sentence or notes (optional)
          <textarea className={`${fieldClass} mt-2 min-h-36`} value={form.content} onChange={(event) => update('content', event.target.value)} placeholder="Paste a sentence or write your notes…" />
        </label>
        <button type="submit" className={buttonClass} disabled={isSaving || !secret}>
          {isSaving ? 'Saving…' : 'Save book'}
        </button>
      </form>
    </div>
  );
}
