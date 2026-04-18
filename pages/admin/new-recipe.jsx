import React, { useEffect, useMemo, useState } from 'react';

import SeoHeader from 'components/seoHeader';
import { adminHeaderName } from 'lib/admin';
import { publitBaseUrl } from 'lib/publit';

const defaultMarkdownTemplate = `### 材料

#### 食材

- 食材1 \`適量\`

#### 調味料

- 調味料1 \`適量\`

### 步驟

1. 第一步
2. 第二步
`;

const initialForm = {
  title: '',
  slug: '',
  type: 'cooking',
  desc: '',
  ingredients: '',
  labels: 'others',
  coverImage: '',
  gallery: '',
  contentMarkdown: defaultMarkdownTemplate,
  published: true,
  date: new Date().toISOString().slice(0, 10),
};

const slugify = (value = '') => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

const maxUploadSizeWithoutCompression = 4 * 1024 * 1024;

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const getUploadFileName = (file) => {
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return `${baseName || 'recipe-image'}.jpg`;
};

const compressImage = async (file) => {
  const dataUrl = await readFileAsDataUrl(file);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 1200;
      const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * ratio);
      canvas.height = Math.round(image.height * ratio);

      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not prepare image for upload'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.8);
    };
    image.onerror = reject;
    image.src = dataUrl;
  });
};

const fieldClassName = 'w-full rounded-lg border border-[#d8d0c3] bg-white px-4 py-3 text-sm outline-none transition focus:border-primary';
const actionButtonClassName = 'rounded-lg border-0 bg-[#8f746c] px-6 text-white hover:bg-[#7e655d] disabled:bg-[#c8b7b2] disabled:text-white';

const NewRecipeAdmin = () => {
  const [adminSecret, setAdminSecret] = useState('');
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    const storedSecret = window.localStorage.getItem('mynext-admin-secret') || '';
    if (storedSecret) {
      setAdminSecret(storedSecret);
    }
  }, []);

  useEffect(() => {
    if (!slugTouched) {
      setForm((current) => ({ ...current, slug: slugify(current.title) }));
    }
  }, [form.title, slugTouched]);

  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    [adminHeaderName]: adminSecret,
  }), [adminSecret]);

  const updateField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const persistSecret = () => {
    window.localStorage.setItem('mynext-admin-secret', adminSecret);
    setStatus('Admin secret saved on this device.');
    setError('');
  };

  const uploadSingleImage = async (file, publicId) => {
    setUploadStatus('Preparing image...');
    const uploadFile = file.size > maxUploadSizeWithoutCompression
      ? await compressImage(file)
      : file;
    setUploadStatus('Getting upload signature...');

    const signatureResponse = await fetch('/api/admin/publit-signature', {
      method: 'POST',
      headers,
    });

    const signatureData = await signatureResponse.json();
    if (!signatureResponse.ok) {
      throw new Error(signatureData.error || 'Unable to sign image upload');
    }

    const formData = new FormData();
    formData.append('file', uploadFile, uploadFile instanceof File ? uploadFile.name : getUploadFileName(file));
    formData.append('public_id', publicId);
    formData.append('folder', form.type);
    const query = new URLSearchParams(signatureData).toString();

    const data = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${publitBaseUrl}/files/create?${query}`);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.timeout = 60000;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadStatus(`Uploading image... ${percentage}%`);
        } else {
          setUploadStatus('Uploading image...');
        }
      };

      xhr.onload = () => {
        let responseData = null;

        try {
          responseData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        } catch (error) {
          responseData = null;
        }

        if (xhr.status >= 200 && xhr.status < 300 && responseData?.success !== false) {
          resolve(responseData);
          return;
        }

        reject(new Error(
          responseData?.message
          || responseData?.error
          || xhr.responseText
          || `Upload failed with status ${xhr.status}`,
        ));
      };

      xhr.onerror = () => reject(new Error('Browser upload to Publit.io failed'));
      xhr.ontimeout = () => reject(new Error('Upload timed out after 60 seconds'));
      xhr.send(formData);
    });

    setUploadStatus('Upload complete.');
    return data.url_preview || data.url_download || data.url_thumbnail || data.url || '';
  };

  const onUploadCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setStatus('');
    setError('');
    setUploadStatus('');

    try {
      const url = await uploadSingleImage(file, form.slug || slugify(form.title));
      setForm((current) => ({ ...current, coverImage: url }));
      setStatus('Cover image uploaded.');
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploadingCover(false);
      setUploadStatus('');
      event.target.value = '';
    }
  };

  const onUploadGallery = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setIsUploadingGallery(true);
    setStatus('');
    setError('');
    setUploadStatus('');

    try {
      const uploadedUrls = [];
      for (const [index, file] of files.entries()) {
        const publicId = `${form.slug || slugify(form.title)}-gallery-${Date.now()}-${index + 1}`;
        const url = await uploadSingleImage(file, publicId);
        uploadedUrls.push(url);
      }

      setForm((current) => ({
        ...current,
        gallery: [current.gallery, ...uploadedUrls].filter(Boolean).join('\n'),
      }));
      setStatus('Gallery image(s) uploaded.');
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploadingGallery(false);
      setUploadStatus('');
      event.target.value = '';
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setStatus('');
    setError('');

    try {
      const response = await fetch('/api/admin/save-recipe', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to save recipe');
      }

      const revalidatePaths = [`/${form.type}`, `/${form.type}/${data.slug}`];
      const revalidateResponse = await fetch('/api/admin/revalidate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ paths: revalidatePaths }),
      });

      if (!revalidateResponse.ok) {
        const revalidateData = await revalidateResponse.json();
        throw new Error(revalidateData.error || 'Recipe saved, but revalidation failed');
      }

      setStatus(`Recipe saved to Notion: ${data.slug}`);
      setForm({
        ...initialForm,
        type: form.type,
      });
      setSlugTouched(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SeoHeader
        title="New Recipe"
        description="Private recipe publishing tool"
        path="/admin/new-recipe"
      />
      <div className="mb-8 rounded-lg border border-[#e5ddd0] bg-[#faf6ef] p-5">
        <div className="mb-2 text-lg font-semibold text-primary-content">Private Recipe Publisher</div>
        <p className="mb-4 text-sm text-primary-content/70">
          Upload images to Publit.io and save markdown recipes to Notion from one page.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={adminSecret}
            onChange={(event) => setAdminSecret(event.target.value)}
            className={fieldClassName}
            placeholder="Admin secret"
          />
          <button
            type="button"
            className={`btn ${actionButtonClassName}`}
            onClick={persistSecret}
          >
            Save Secret
          </button>
        </div>
      </div>

      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">Title</span>
            <input className={fieldClassName} value={form.title} onChange={updateField('title')} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">Slug</span>
            <input
              className={fieldClassName}
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                updateField('slug')(event);
              }}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">Type</span>
            <select className={fieldClassName} value={form.type} onChange={updateField('type')}>
              <option value="cooking">Cooking</option>
              <option value="baking">Baking</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">Publish Date</span>
            <input
              type="date"
              className={fieldClassName}
              value={form.date}
              onChange={updateField('date')}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-primary-content">Description</span>
          <textarea className={`${fieldClassName} min-h-24`} value={form.desc} onChange={updateField('desc')} />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">Ingredients</span>
            <textarea
              className={`${fieldClassName} min-h-36`}
              value={form.ingredients}
              onChange={updateField('ingredients')}
              placeholder={'One ingredient per line'}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">Labels</span>
            <textarea
              className={`${fieldClassName} min-h-36`}
              value={form.labels}
              onChange={updateField('labels')}
              placeholder={'One label per line'}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[#e5ddd0] bg-white p-4">
            <div className="mb-2 text-sm font-medium text-primary-content">Cover Image</div>
            <div className="mb-3 text-xs text-primary-content/60">
              Upload from phone and the page will store the returned Publit.io URL.
            </div>
            <input type="file" accept="image/*" onChange={onUploadCover} />
            {isUploadingCover && <div className="mt-3 text-sm text-primary-content/70">{uploadStatus || 'Uploading cover image...'}</div>}
            {form.coverImage && (
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt="Cover preview" className="w-full rounded-lg object-cover" />
                <input className={`${fieldClassName} mt-3`} value={form.coverImage} onChange={updateField('coverImage')} />
              </div>
            )}
          </div>

          <div className="rounded-lg border border-[#e5ddd0] bg-white p-4">
            <div className="mb-2 text-sm font-medium text-primary-content">Gallery Images</div>
            <div className="mb-3 text-xs text-primary-content/60">
              Upload one or more extra images. They will be appended as newline-separated URLs.
            </div>
            <input type="file" accept="image/*" multiple onChange={onUploadGallery} />
            {isUploadingGallery && <div className="mt-3 text-sm text-primary-content/70">{uploadStatus || 'Uploading gallery images...'}</div>}
            <textarea
              className={`${fieldClassName} mt-4 min-h-36`}
              value={form.gallery}
              onChange={updateField('gallery')}
              placeholder={'One image URL per line'}
            />
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-primary-content">Content Markdown</span>
          <textarea
            className={`${fieldClassName} min-h-[420px] font-mono`}
            value={form.contentMarkdown}
            onChange={updateField('contentMarkdown')}
            placeholder={'### 材料\n\n#### 食材\n\n- 食材 `適量`\n\n### 步驟\n\n1. 第一步'}
          />
        </label>

        <label className="flex items-center gap-3 text-sm text-primary-content">
          <input type="checkbox" checked={form.published} onChange={updateField('published')} />
          Publish immediately
        </label>

        {status && <div className="rounded-lg bg-[#edf8ef] px-4 py-3 text-sm text-[#2f6b3c]">{status}</div>}
        {error && <div className="rounded-lg bg-[#fff1ef] px-4 py-3 text-sm text-[#9f3a2d]">{error}</div>}

        <button
          type="submit"
          className={`btn ${actionButtonClassName}`}
          disabled={isSaving || isUploadingCover || isUploadingGallery}
        >
          {isSaving ? 'Saving...' : 'Save Recipe To Notion'}
        </button>
      </form>
    </div>
  );
};

export default NewRecipeAdmin;
