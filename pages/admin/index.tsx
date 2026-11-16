import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { BookOpen, UtensilsCrossed } from 'lucide-react';

import SeoHeader from 'components/seoHeader';

const storageKey = 'mynext-admin-secret';
const buttonClass = 'btn !border-[#705c55] !bg-[#705c55] !text-white hover:!bg-[#5b4943] disabled:!border-[#d8cfca] disabled:!bg-[#d8cfca] disabled:!text-[#4a3c36]';

export default function Admin() {
  const [secret, setSecret] = useState('');
  const [hasSecret, setHasSecret] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) || '';
    // Restore browser-only credentials after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSecret(stored);
    setHasSecret(Boolean(stored));
  }, []);

  const saveSecret = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = secret.trim();
    if (!value) return;
    window.localStorage.setItem(storageKey, value);
    setSecret(value);
    setHasSecret(true);
    setMessage('管理密鑰已儲存，食譜與書籍編輯頁會共用此密鑰。');
  };
  const clearSecret = () => {
    window.localStorage.removeItem(storageKey);
    setSecret('');
    setHasSecret(false);
    setMessage('已清除此瀏覽器儲存的管理密鑰。');
  };

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <SeoHeader title="內容管理" description="管理食譜、書籍與閱讀筆記" path="/admin" />
      <h1 className="mb-3 text-2xl font-normal text-primary-content">內容管理</h1>
      <p className="!mx-0 mb-6 text-sm text-primary-content">新增與編輯食譜、書籍及閱讀筆記。</p>
      <section aria-labelledby="admin-secret-title" className="mb-6 rounded-lg border border-[#d8d0c3] bg-white p-5">
        <h2 id="admin-secret-title" className="mb-2 text-lg text-primary-content">管理密鑰</h2>
        <p className="!mx-0 mb-4 text-sm text-primary-content">密鑰會儲存在此瀏覽器，並供兩個編輯頁共用。載入或儲存內容時會驗證密鑰。</p>
        <form onSubmit={saveSecret}>
          <label htmlFor="admin-secret" className="mb-2 block text-sm text-primary-content">輸入管理密鑰</label>
          <input id="admin-secret" type="password" autoComplete="off" value={secret} onChange={(event) => setSecret(event.target.value)} className="w-full rounded-lg border border-[#d8d0c3] bg-white px-4 py-3 text-sm text-primary-content outline-none focus:border-primary" />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="submit" className={buttonClass} disabled={!secret.trim()}>儲存密鑰</button>
            <button type="button" className="btn btn-outline border-[#705c55] text-primary-content" disabled={!hasSecret} onClick={clearSecret}>清除密鑰</button>
          </div>
        </form>
        <p role="status" className="!mx-0 mt-3 text-sm text-primary-content">{message || (hasSecret ? '此瀏覽器已儲存管理密鑰。' : '尚未儲存管理密鑰。')}</p>
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/admin/new-recipe" className="flex items-start gap-3 rounded-lg border border-[#d8d0c3] bg-white p-5 text-primary-content transition-colors hover:bg-[#faf6ef]">
          <UtensilsCrossed size={24} aria-hidden="true" className="mt-1 shrink-0" />
          <div><h2 className="mb-2 text-lg">管理食譜</h2><p className="!mx-0 text-sm text-primary-content">新增與編輯料理、烘焙食譜及份量換算。</p></div>
        </Link>
        <Link href="/admin/new-book" className="flex items-start gap-3 rounded-lg border border-[#d8d0c3] bg-white p-5 text-primary-content transition-colors hover:bg-[#faf6ef]">
          <BookOpen size={24} aria-hidden="true" className="mt-1 shrink-0" />
          <div><h2 className="mb-2 text-lg">管理書籍</h2><p className="!mx-0 text-sm text-primary-content">新增與編輯書籍資料、摘錄和閱讀筆記。</p></div>
        </Link>
      </div>
    </div>
  );
}
