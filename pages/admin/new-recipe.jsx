import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
  pageId: '',
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

const initialEditLookup = {
  type: 'cooking',
  search: '',
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

const fieldClassName = 'block w-full min-w-0 max-w-full rounded-lg border border-[#d8d0c3] bg-white px-4 py-3 text-sm outline-none transition focus:border-primary';
const actionButtonClassName = 'rounded-lg border-0 bg-[#8f746c] px-6 text-sm text-white hover:bg-[#7e655d] disabled:bg-[#c8b7b2] disabled:text-white';
const dropdownButtonClassName = 'btn flex w-full min-w-0 max-w-full list-none items-center justify-between rounded-lg border border-[#d8d0c3] bg-white px-4 text-sm font-normal text-text-primary shadow-none hover:border-[#d8d0c3] hover:bg-white [&::-webkit-details-marker]:hidden';
const dropdownOptionClassName = 'block w-full rounded-lg px-4 py-3 text-left text-sm text-text-primary transition';
const dropdownOptionInactiveClassName = '!bg-white hover:!bg-white focus:!bg-white active:!bg-white';
const dropdownOptionActiveClassName = '!bg-[#8f746c] !text-white hover:!bg-[#8f746c] focus:!bg-[#8f746c] active:!bg-[#8f746c]';
const fileInputClassName = 'file-input block h-12 w-full rounded-lg border border-[#d8d0c3] bg-white text-sm text-text-primary shadow-none file:h-full file:border-0 file:border-r file:border-[#d8d0c3] file:bg-[#f7f1e8] file:px-5 file:text-sm file:font-medium file:normal-case file:text-[#6f6258] focus:border-[#cdbfa9] focus:outline-none';

const NewRecipeAdmin = () => {
  const [adminSecret, setAdminSecret] = useState('');
  const [hasSavedSecret, setHasSavedSecret] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editLookup, setEditLookup] = useState(initialEditLookup);
  const [adminRecipes, setAdminRecipes] = useState([]);
  const [loadedRecipeRef, setLoadedRecipeRef] = useState({ type: '', slug: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isLoadingRecipeList, setIsLoadingRecipeList] = useState(false);
  const typeDropdownRef = useRef(null);

  useEffect(() => {
    const storedSecret = window.localStorage.getItem('mynext-admin-secret') || '';
    if (storedSecret) {
      setAdminSecret(storedSecret);
      setHasSavedSecret(true);
    }
  }, []);

  useEffect(() => {
    if (!isTypeDropdownOpen) {
      return undefined;
    }

    const closeDropdown = (event) => {
      if (typeDropdownRef.current?.contains(event.target)) {
        return;
      }

      setIsTypeDropdownOpen(false);
    };

    document.addEventListener('click', closeDropdown);

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [isTypeDropdownOpen]);

  useEffect(() => {
    if (!slugTouched) {
      setForm((current) => ({ ...current, slug: slugify(current.title) }));
    }
  }, [form.title, slugTouched]);

  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    [adminHeaderName]: adminSecret,
  }), [adminSecret]);

  const filteredAdminRecipes = useMemo(() => {
    const query = editLookup.search.trim().toLowerCase();

    return adminRecipes.filter((recipe) => {
      if (recipe.type !== editLookup.type) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [recipe.title, recipe.slug]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [adminRecipes, editLookup.search, editLookup.type]);

  const updateField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateEditLookup = (field) => (event) => {
    const value = event.target.value;
    setEditLookup((current) => ({ ...current, [field]: value }));
  };

  const loadRecipeList = useCallback(async (type) => {
    if (!adminSecret || !hasSavedSecret) {
      setAdminRecipes([]);
      return;
    }

    setIsLoadingRecipeList(true);

    try {
      const query = new URLSearchParams({ type }).toString();
      const response = await fetch(`/api/admin/recipes?${query}`, {
        method: 'GET',
        headers: {
          [adminHeaderName]: adminSecret,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to load recipes');
      }

      setAdminRecipes(data.recipes || []);
    } catch (loadError) {
      setAdminRecipes([]);
      setError(loadError.message);
    } finally {
      setIsLoadingRecipeList(false);
    }
  }, [adminSecret, hasSavedSecret]);

  const persistSecret = () => {
    window.localStorage.setItem('mynext-admin-secret', adminSecret);
    setHasSavedSecret(true);
    setStatus('Admin secret saved on this device.');
    setError('');
  };

  const resetToCreateMode = () => {
    setForm((current) => ({
      ...initialForm,
      type: current.type || 'cooking',
    }));
    setEditLookup((current) => ({
      ...current,
      search: '',
      type: current.type || 'cooking',
    }));
    setLoadedRecipeRef({ type: '', slug: '' });
    setSlugTouched(false);
    setStatus('Switched to create mode.');
    setError('');
  };

  const loadRecipeForEditing = async ({ type, slug }) => {
    setIsLoadingRecipe(true);
    setStatus('');
    setError('');

    try {
      const query = new URLSearchParams({
        type,
        slug: slug.trim(),
      }).toString();

      const response = await fetch(`/api/admin/recipe?${query}`, {
        method: 'GET',
        headers: {
          [adminHeaderName]: adminSecret,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to load recipe');
      }

      setForm({
        pageId: data.id,
        title: data.title || '',
        slug: data.slug || '',
        type: data.type || type,
        desc: data.desc || '',
        ingredients: (data.ingredient || []).join('\n'),
        labels: (data.labels || []).join('\n'),
        coverImage: data.coverImage || '',
        gallery: (data.gallery || []).join('\n'),
        contentMarkdown: data.content || defaultMarkdownTemplate,
        published: Boolean(data.published),
        date: (data.date || new Date().toISOString()).slice(0, 10),
      });
      setLoadedRecipeRef({
        type: data.type || type,
        slug: data.slug || slug.trim(),
      });
      setEditLookup({
        type: data.type || type,
        search: '',
      });
      setSlugTouched(true);
      setStatus(`Loaded ${data.slug} for editing.`);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  useEffect(() => {
    if (!adminSecret || !hasSavedSecret) {
      return;
    }

    loadRecipeList(editLookup.type);
  }, [adminSecret, editLookup.type, hasSavedSecret, loadRecipeList]);

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
        body: JSON.stringify({
          ...form,
          previousType: loadedRecipeRef.type,
          previousSlug: loadedRecipeRef.slug,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to save recipe');
      }

      setStatus(data.revalidationError
        ? `Recipe saved to Notion, but production refresh failed: ${data.revalidationError}`
        : form.pageId
          ? `Recipe updated in Notion: ${data.slug}`
          : `Recipe saved to Notion: ${data.slug}`);
      setForm({
        ...initialForm,
        type: form.type,
      });
      setEditLookup({
        type: form.type,
        search: '',
      });
      setLoadedRecipeRef({ type: '', slug: '' });
      setSlugTouched(false);
      await loadRecipeList(form.type);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {(status || error) && (
        <div className="toast toast-top top-4 z-50">
          {status && (
            <div className="alert border-0 bg-[#edf8ef] text-[#2f6b3c] shadow-lg">
              <span>{status}</span>
            </div>
          )}
          {error && (
            <div className="alert border-0 bg-[#fff1ef] text-[#9f3a2d] shadow-lg">
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
      <SeoHeader
        title="New Recipe"
        description="Private recipe publishing tool"
        path="/admin/new-recipe"
      />
      <div className="mb-8 rounded-lg border border-[#e5ddd0] bg-[#faf6ef] p-5">
        <div className="mb-2 text-xl font-semibold text-primary-content">Private Recipe Publisher</div>
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

      <div className="mb-8 rounded-lg border border-[#e5ddd0] bg-white p-5">
        <div className="mb-2 text-xl font-semibold text-primary-content">Edit Existing</div>
        <p className="mb-4 text-sm text-primary-content/70">
          Browse your Notion recipes, search by title or slug, and tap one to load it into the editor.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr_auto]">
          <div className="relative w-full">
            <button
              type="button"
              className={dropdownButtonClassName}
              onClick={() => {
                setEditLookup((current) => ({
                  ...current,
                  type: current.type === 'baking' ? 'cooking' : 'baking',
                  search: '',
                }));
                setLoadedRecipeRef({ type: '', slug: '' });
              }}
            >
              <span className="flex-1 text-left">{editLookup.type === 'baking' ? 'Baking' : 'Cooking'}</span>
              <ChevronDown size={18} className="text-primary-content/60" />
            </button>
          </div>
          <input
            className={fieldClassName}
            placeholder="Search by title or slug"
            value={editLookup.search}
            onChange={updateEditLookup('search')}
          />
          <button
            type="button"
            className="btn rounded-lg border border-[#d8d0c3] bg-white px-5 text-sm font-normal text-text-primary shadow-none hover:border-[#d8d0c3] hover:bg-white"
            onClick={resetToCreateMode}
          >
            New
          </button>
        </div>
        <div className="mt-4 rounded-lg border border-[#ece3d6] bg-[#fcfaf6] p-2">
          {isLoadingRecipeList ? (
            <div className="px-3 py-8 text-center text-sm text-primary-content/60">Loading recipes...</div>
          ) : filteredAdminRecipes.length ? (
            <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
              {filteredAdminRecipes.map((recipe) => {
                const isLoaded = loadedRecipeRef.slug === recipe.slug && loadedRecipeRef.type === recipe.type;

                return (
                  <button
                    key={recipe.id}
                    type="button"
                    className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                      isLoaded
                        ? 'border-[#8f746c] bg-[#f3e9e4]'
                        : 'border-[#ece3d6] bg-white'
                    }`}
                    disabled={isLoadingRecipe}
                    onClick={() => loadRecipeForEditing({ type: recipe.type, slug: recipe.slug })}
                  >
                    <div className="font-medium text-primary-content">{recipe.title || recipe.slug}</div>
                    <div className="mt-1 text-xs text-primary-content/60">
                      {recipe.slug}
                      {recipe.published ? ' · Published' : ' · Draft'}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-primary-content/60">
              {editLookup.search.trim()
                ? 'No recipes match that search yet.'
                : `No ${editLookup.type} recipes found in Notion yet.`}
            </div>
          )}
        </div>
      </div>

      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="rounded-lg border border-[#e5ddd0] bg-[#faf6ef] px-4 py-3 text-sm text-primary-content">
          {form.pageId
            ? `Edit mode: updating ${loadedRecipeRef.slug || form.slug}`
            : 'Create mode: saving a new Notion recipe'}
        </div>
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
            <div className="relative w-full" ref={typeDropdownRef}>
              <button
                type="button"
                className={dropdownButtonClassName}
                onClick={() => setIsTypeDropdownOpen((current) => !current)}
              >
                <span className="flex-1 text-left">{form.type === 'baking' ? 'Baking' : 'Cooking'}</span>
                <ChevronDown size={18} className="text-primary-content/60" />
              </button>
              {isTypeDropdownOpen && (
                <div className="absolute left-0 top-full z-10 mt-2 w-full rounded-lg border border-[#d8d0c3] bg-white p-2 shadow-lg">
                  <button
                    type="button"
                    className={`${dropdownOptionClassName} ${form.type === 'cooking' ? dropdownOptionActiveClassName : dropdownOptionInactiveClassName}`}
                    onClick={() => {
                      setForm((current) => ({ ...current, type: 'cooking' }));
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    Cooking
                  </button>
                  <button
                    type="button"
                    className={`${dropdownOptionClassName} ${form.type === 'baking' ? dropdownOptionActiveClassName : dropdownOptionInactiveClassName}`}
                    onClick={() => {
                      setForm((current) => ({ ...current, type: 'baking' }));
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    Baking
                  </button>
                </div>
              )}
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">Publish Date</span>
            <input
              type="date"
              className={`${fieldClassName} appearance-none`}
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
            <input type="file" accept="image/*" className={fileInputClassName} onChange={onUploadCover} />
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
            <input type="file" accept="image/*" multiple className={fileInputClassName} onChange={onUploadGallery} />
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
