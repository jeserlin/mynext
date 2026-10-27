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

export default function NewBook() {
  const [secret, setSecret] = useState('');
  const [form, setForm] = useState<BookForm>(emptyBook);
  const [isLookingUp, setIsLookingUp] = useState(false);
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

  const lookup = async () => {
    setIsLookingUp(true);
    setError('');
    setMessage('');
    try {
      const isbn = form.isbn.replace(/[-\s]/g, '');
      const response = await fetch(`/api/admin/lookup-book?isbn=${encodeURIComponent(isbn)}`, {
        headers: { [adminHeaderName]: secret },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'ISBN lookup failed');
      setForm((current) => ({
        ...current,
        isbn,
        title: data.title || current.title,
        author: data.author || current.author,
        coverImage: data.coverImage || current.coverImage,
      }));
      setMessage('Book found. Check the details before saving.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ISBN lookup failed');
    } finally {
      setIsLookingUp(false);
    }
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
      <p className="mb-6 text-sm text-primary-content/70">Look up the ISBN, check the details, then paste your notes and cover URL.</p>
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
          <label htmlFor="isbn" className="block text-sm text-primary-content">ISBN</label>
          <div className="mt-2 flex gap-2">
            <input id="isbn" className={fieldClass} inputMode="numeric" value={form.isbn} onChange={(event) => update('isbn', event.target.value)} required />
            <button type="button" className="btn btn-secondary shrink-0" onClick={lookup} disabled={isLookingUp || !secret || !form.isbn.trim()}>
              {isLookingUp ? 'Looking up…' : 'Look up'}
            </button>
          </div>
        </div>
        <label className="block text-sm text-primary-content">
          Title
          <input className={`${fieldClass} mt-2`} value={form.title} onChange={(event) => update('title', event.target.value)} required />
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
        <button type="submit" className="btn btn-secondary" disabled={isSaving || !secret}>
          {isSaving ? 'Saving…' : 'Save book'}
        </button>
      </form>
    </div>
  );
}
