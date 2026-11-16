import Link from 'next/link';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ChevronDown } from 'lucide-react';

import SeoHeader from 'components/seoHeader';
import RecipeScalingEditor from 'components/recipeScalingEditor/RecipeScalingEditor';
import { fromScalingDraft, materialMarkdown, toScalingDraft, withoutMaterialSection } from 'lib/recipeScalingForm';
import type { ScalingDraft } from 'lib/recipeScalingForm';
import { adminHeaderName } from 'lib/admin';
import { getErrorMessage } from 'lib/errors';
import { publitBaseUrl } from 'lib/publit';
import type { PublitSignedQuery } from 'lib/publit';
import type { NotionRecipe, RecipeScaling, RecipeType } from 'types/recipe';

const defaultMarkdownTemplate = `### 材料

#### 食材

- 食材1 \`適量\`

#### 調味料

- 調味料1 \`適量\`

### 步驟

1. 第一步
2. 第二步
`;

interface RecipeForm {
  source: 'markdown' | 'notion';
  scalingEnabled: boolean;
  scalingDraft: ScalingDraft;
  originalScaling: RecipeScaling | null;
  pageId: string;
  title: string;
  slug: string;
  type: RecipeType;
  desc: string;
  ingredients: string;
  labels: string;
  coverImage: string;
  gallery: string;
  contentMarkdown: string;
  published: boolean;
  date: string;
}

interface EditLookup {
  type: RecipeType;
  search: string;
}

interface LoadedRecipeRef {
  type: RecipeType | '';
  slug: string;
}

interface AdminRecipe extends Omit<NotionRecipe, 'slug' | 'type'> {
  slug: string;
  type: RecipeType;
}

interface ErrorResponse {
  error?: string;
}

interface RecipeListResponse extends ErrorResponse {
  recipes?: AdminRecipe[];
}

interface RecipeDetailResponse extends ErrorResponse, Partial<NotionRecipe> {}

interface SaveRecipeResponse extends ErrorResponse {
  slug?: string;
  revalidationError?: string;
}

interface PublitUploadResponse extends ErrorResponse {
  success?: boolean;
  message?: string;
  url_preview?: string;
  url_download?: string;
  url_thumbnail?: string;
  url?: string;
}

const recipeEditorError = (error: unknown, fallback: string): string => {
  const message = getErrorMessage(error, fallback);
  const messages: Record<string, string> = {
    Unauthorized: '管理密鑰不正確，請確認後重新儲存密鑰。',
    'Recipe not found in Notion': '找不到這份食譜，請重新載入清單。',
    'Invalid recipe type': '食譜類別不正確，請選擇料理或烘焙。',
    'Type and slug are required': '請提供食譜類別與網址代稱。',
    'Another Notion recipe already uses this slug': '已有其他食譜使用這個網址代稱。',
    'A markdown recipe with this slug already exists': '已有 Markdown 食譜使用這個網址代稱，請從清單載入原食譜編輯。',
    'A recipe with this slug already exists in Notion': 'Notion 已有相同網址的食譜，請從清單載入後編輯。',
    'Reload the original Markdown recipe before saving; keep its type and slug unchanged': '請重新載入原本的 Markdown 食譜，並保留原類別與網址代稱。',
    'Notion is not configured': '尚未設定 Notion 連線，請先完成網站的 Notion 設定。',
    'Failed to fetch': '無法連線，請檢查網路後再試。',
  };
  return messages[message] || message;
};

const initialForm: RecipeForm = {
  source: 'notion',
  scalingEnabled: false,
  scalingDraft: toScalingDraft(),
  originalScaling: null,
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

const initialEditLookup: EditLookup = {
  type: 'cooking',
  search: '',
};

const slugify = (value = ''): string => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

const maxUploadSizeWithoutCompression = 4 * 1024 * 1024;

const readFileAsDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      resolve(reader.result);
      return;
    }
    reject(new Error('無法讀取圖片檔案'));
  };
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const getUploadFileName = (file: File): string => {
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return `${baseName || 'recipe-image'}.jpg`;
};

const compressImage = async (file: File): Promise<Blob> => {
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
      if (!context) {
        reject(new Error('無法處理要上傳的圖片'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('無法處理要上傳的圖片'));
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
  const [form, setForm] = useState<RecipeForm>(initialForm);
  const [editLookup, setEditLookup] = useState<EditLookup>(initialEditLookup);
  const [adminRecipes, setAdminRecipes] = useState<AdminRecipe[]>([]);
  const [loadedRecipeRef, setLoadedRecipeRef] = useState<LoadedRecipeRef>({ type: '', slug: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isEditTypeDropdownOpen, setIsEditTypeDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isLoadingRecipeList, setIsLoadingRecipeList] = useState(false);
  const [recipeListError, setRecipeListError] = useState('');
  const recipeListRequest = useRef(0);
  const editTypeDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSecret = window.localStorage.getItem('mynext-admin-secret') || '';
    if (storedSecret) {
      // Restore client-only storage after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdminSecret(storedSecret);
      setHasSavedSecret(true);
    }
  }, []);

  useEffect(() => {
    if (!isTypeDropdownOpen) {
      return undefined;
    }

    const closeDropdown = (event: MouseEvent) => {
      if (typeDropdownRef.current?.contains(event.target as Node)) {
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
    if (!isEditTypeDropdownOpen) {
      return undefined;
    }

    const closeDropdown = (event: MouseEvent) => {
      if (editTypeDropdownRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsEditTypeDropdownOpen(false);
    };

    document.addEventListener('click', closeDropdown);

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [isEditTypeDropdownOpen]);

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
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [adminRecipes, editLookup.search, editLookup.type]);

  const updateField = (field: keyof RecipeForm) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
      ? event.target.checked
      : event.target.value;
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(!slugTouched && field === 'title'
        ? { slug: slugify(typeof value === 'string' ? value : '') }
        : {}),
    } as RecipeForm));
  };

  const updateEditLookup = (field: keyof EditLookup) => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setEditLookup((current) => ({ ...current, [field]: value } as EditLookup));
  };

  const loadRecipeList = useCallback(async (type: RecipeType) => {
    const requestId = ++recipeListRequest.current;
    if (!adminSecret || !hasSavedSecret) {
      setAdminRecipes([]);
      return;
    }

    setIsLoadingRecipeList(true);
    setRecipeListError('');

    try {
      const query = new URLSearchParams({ type }).toString();
      const response = await fetch(`/api/admin/recipes?${query}`, {
        method: 'GET',
        headers: {
          [adminHeaderName]: adminSecret,
        },
      });

      const data = await response.json() as RecipeListResponse;
      if (!response.ok) {
        throw new Error(data.error || '無法載入食譜清單');
      }

      if (requestId === recipeListRequest.current) setAdminRecipes(data.recipes || []);
    } catch (loadError) {
      if (requestId === recipeListRequest.current) {
        setAdminRecipes([]);
        const message = recipeEditorError(loadError, '無法載入食譜清單');
        setRecipeListError(message);
        setError(message);
      }
    } finally {
      if (requestId === recipeListRequest.current) setIsLoadingRecipeList(false);
    }
  }, [adminSecret, hasSavedSecret]);

  const persistSecret = () => {
    window.localStorage.setItem('mynext-admin-secret', adminSecret);
    setHasSavedSecret(true);
    setStatus('管理密鑰已儲存在此裝置。');
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
    setStatus('已切換至新增食譜模式。');
    setError('');
  };

  const loadRecipeForEditing = async ({
    type,
    slug,
  }: Pick<AdminRecipe, 'type' | 'slug'>) => {
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

      const data = await response.json() as RecipeDetailResponse;
      if (!response.ok) {
        throw new Error(data.error || '無法載入食譜');
      }

      const recipeType = data.type === 'baking' || data.type === 'cooking'
        ? data.type
        : type;
      setForm({
        source: data.source || 'notion',
        scalingEnabled: Boolean(data.scaling),
        scalingDraft: toScalingDraft(data.scaling),
        originalScaling: data.scaling || null,
        pageId: data.source === 'markdown' ? '' : data.id || '',
        title: data.title || '',
        slug: data.slug || '',
        type: recipeType,
        desc: data.desc || '',
        ingredients: (data.ingredient || []).join('\n'),
        labels: (data.labels || []).join('\n'),
        coverImage: data.coverImage || '',
        gallery: (data.gallery || []).join('\n'),
        contentMarkdown: data.content ?? defaultMarkdownTemplate,
        published: Boolean(data.published),
        date: (data.date || new Date().toISOString()).slice(0, 10),
      });
      setLoadedRecipeRef({
        type: recipeType,
        slug: data.slug || slug.trim(),
      });
      setEditLookup({
        type: recipeType,
        search: '',
      });
      setSlugTouched(true);
      setStatus(`已載入食譜：${data.slug}，可以開始編輯。`);
    } catch (loadError) {
      setError(recipeEditorError(loadError, '無法載入食譜'));
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  useEffect(() => {
    if (!adminSecret || !hasSavedSecret) {
      return;
    }

    // Fetch when the saved credentials or selected recipe type changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecipeList(editLookup.type);
  }, [adminSecret, editLookup.type, hasSavedSecret, loadRecipeList]);

  const uploadSingleImage = async (file: File, publicId: string): Promise<string> => {
    setUploadStatus('正在處理圖片⋯');
    const uploadFile = file.size > maxUploadSizeWithoutCompression
      ? await compressImage(file)
      : file;
    setUploadStatus('正在準備上傳⋯');

    const signatureResponse = await fetch('/api/admin/publit-signature', {
      method: 'POST',
      headers,
    });

    const signatureData = await signatureResponse.json() as PublitSignedQuery & ErrorResponse;
    if (!signatureResponse.ok) {
      throw new Error(signatureData.error || '無法取得圖片上傳授權');
    }

    const formData = new FormData();
    formData.append('file', uploadFile, uploadFile instanceof File ? uploadFile.name : getUploadFileName(file));
    formData.append('public_id', publicId);
    formData.append('folder', form.type);
    const query = new URLSearchParams(signatureData).toString();

    const data = await new Promise<PublitUploadResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${publitBaseUrl}/files/create?${query}`);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.timeout = 60000;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadStatus(`正在上傳圖片⋯ ${percentage}%`);
        } else {
          setUploadStatus('正在上傳圖片⋯');
        }
      };

      xhr.onload = () => {
        let responseData: PublitUploadResponse | null = null;

        try {
          responseData = xhr.responseText
            ? JSON.parse(xhr.responseText) as PublitUploadResponse
            : null;
        } catch {
          responseData = null;
        }

        if (
          xhr.status >= 200
          && xhr.status < 300
          && responseData
          && responseData.success !== false
        ) {
          resolve(responseData);
          return;
        }

        reject(new Error(
          responseData?.message
          || responseData?.error
          || xhr.responseText
          || `圖片上傳失敗（狀態碼：${xhr.status}）`,
        ));
      };

      xhr.onerror = () => reject(new Error('圖片上傳至 Publit.io 失敗'));
      xhr.ontimeout = () => reject(new Error('圖片上傳逾時（超過 60 秒）'));
      xhr.send(formData);
    });

    setUploadStatus('圖片上傳完成。');
    return data.url_preview || data.url_download || data.url_thumbnail || data.url || '';
  };

  const onUploadCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setStatus('');
    setError('');
    setUploadStatus('');

    try {
      const url = await uploadSingleImage(file, form.slug || slugify(form.title));
      setForm((current) => ({ ...current, coverImage: url }));
      setStatus('封面圖片已上傳。');
    } catch (uploadError) {
      setError(recipeEditorError(uploadError, '無法上傳封面圖片'));
    } finally {
      setIsUploadingCover(false);
      setUploadStatus('');
      event.target.value = '';
    }
  };

  const onUploadGallery = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setIsUploadingGallery(true);
    setStatus('');
    setError('');
    setUploadStatus('');

    try {
      const uploadedUrls: string[] = [];
      for (const [index, file] of files.entries()) {
        const publicId = `${form.slug || slugify(form.title)}-gallery-${Date.now()}-${index + 1}`;
        const url = await uploadSingleImage(file, publicId);
        uploadedUrls.push(url);
      }

      setForm((current) => ({
        ...current,
        gallery: [current.gallery, ...uploadedUrls].filter(Boolean).join('\n'),
      }));
      setStatus('食譜照片已上傳。');
    } catch (uploadError) {
      setError(recipeEditorError(uploadError, '無法上傳食譜照片'));
    } finally {
      setIsUploadingGallery(false);
      setUploadStatus('');
      event.target.value = '';
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setStatus('');
    setError('');

    try {
      const scaling = form.scalingEnabled ? fromScalingDraft(form.scalingDraft) : null;
      const contentMarkdown = scaling
        ? withoutMaterialSection(form.contentMarkdown)
        : form.originalScaling && !/^#{1,6}\s+材料\s*$/m.test(form.contentMarkdown)
          ? `${materialMarkdown(form.originalScaling)}\n\n${form.contentMarkdown}`
          : form.contentMarkdown;
      const response = await fetch('/api/admin/save-recipe', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...form,
          scaling,
          contentMarkdown,
          ingredients: scaling ? scaling.groups.flatMap((group) => group.items.map((item) => item.name)).join('\n') : form.ingredients,
          previousType: loadedRecipeRef.type,
          previousSlug: loadedRecipeRef.slug,
        }),
      });

      const data = await response.json() as SaveRecipeResponse;
      if (!response.ok) {
        throw new Error(data.error || '無法儲存食譜');
      }

      setStatus(data.revalidationError
        ? `食譜已儲存至 Notion，但網站更新失敗：${data.revalidationError}`
        : form.pageId
          ? `已更新 Notion 食譜：${data.slug}`
          : `食譜已儲存至 Notion：${data.slug}`);
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
      setError(recipeEditorError(saveError, '無法儲存食譜'));
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
      <Link href="/admin" className="mb-5 inline-flex text-sm text-primary-content underline underline-offset-4">返回管理首頁</Link>
      <SeoHeader
        title="新增與編輯食譜"
        description="私人食譜編輯與發布工具"
        path="/admin/new-recipe"
      />
      <div className="mb-8 rounded-lg border border-[#e5ddd0] bg-[#faf6ef] p-5">
        <div className="mb-2 text-xl font-semibold text-primary-content">食譜編輯與發布</div>
        <p className="!mx-0 mb-4 text-sm text-primary-content/70">
          在這裡上傳圖片、編輯食譜，並儲存至 Notion。
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={adminSecret}
            onChange={(event) => setAdminSecret(event.target.value)}
            className={fieldClassName}
            placeholder="管理密鑰"
          />
          <button
            type="button"
            className={`btn ${actionButtonClassName}`}
            onClick={persistSecret}
          >
            儲存密鑰
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-[#e5ddd0] bg-white p-5">
        <div className="mb-2 text-xl font-semibold text-primary-content">編輯現有食譜</div>
        <p className="!mx-0 mb-4 text-sm text-primary-content/70">
          以名稱或網址代稱搜尋食譜，點選後即可編輯。Markdown 食譜的原始檔會保留，儲存後建立 Notion 版本，發布後優先顯示。
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr_auto]">
          <div className="relative w-full" ref={editTypeDropdownRef}>
            <button
              type="button"
              className={dropdownButtonClassName}
              aria-expanded={isEditTypeDropdownOpen}
              aria-haspopup="listbox"
              onClick={() => setIsEditTypeDropdownOpen((current) => !current)}
            >
              <span className="flex-1 text-left">{editLookup.type === 'baking' ? '烘焙' : '料理'}</span>
              <ChevronDown size={18} className="text-primary-content/60" />
            </button>
            {isEditTypeDropdownOpen && (
              <div
                className="absolute left-0 top-full z-10 mt-2 w-full rounded-lg border border-[#d8d0c3] bg-white p-2 shadow-lg"
                role="listbox"
                aria-label="食譜類別"
              >
                {(['cooking', 'baking'] as RecipeType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`${dropdownOptionClassName} ${editLookup.type === type ? dropdownOptionActiveClassName : dropdownOptionInactiveClassName}`}
                    role="option"
                    aria-selected={editLookup.type === type}
                    onClick={() => {
                      setEditLookup((current) => ({ ...current, type, search: '' }));
                      setLoadedRecipeRef({ type: '', slug: '' });
                      setIsEditTypeDropdownOpen(false);
                    }}
                  >
                    {type === 'baking' ? '烘焙' : '料理'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            className={fieldClassName}
            placeholder="搜尋食譜名稱或網址代稱"
            value={editLookup.search}
            onChange={updateEditLookup('search')}
          />
          <button
            type="button"
            className="btn rounded-lg border border-[#d8d0c3] bg-white px-5 text-sm font-normal text-text-primary shadow-none hover:border-[#d8d0c3] hover:bg-white"
            onClick={resetToCreateMode}
          >
            新增食譜
          </button>
        </div>
        <div className="mt-4 rounded-lg border border-[#ece3d6] bg-[#fcfaf6] p-2">
          {!adminSecret || !hasSavedSecret ? (
            <div className="px-3 py-6 text-center text-sm text-primary-content">
              請先在上方輸入並儲存管理密鑰，驗證後即可載入現有食譜。
            </div>
          ) : isLoadingRecipeList ? (
            <div className="px-3 py-8 text-center text-sm text-primary-content/60">正在載入食譜⋯</div>
          ) : recipeListError ? (
            <div className="px-3 py-6 text-center text-sm text-primary-content">
              <p className="!mx-0" role="alert">食譜清單載入失敗：{recipeListError}</p>
              <button type="button" className="btn btn-sm btn-outline btn-secondary rounded-lg" onClick={() => loadRecipeList(editLookup.type)}>重新載入食譜</button>
            </div>
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
                      {recipe.source === 'markdown' ? ' · Markdown' : ' · Notion'}
                      {recipe.published ? ' · 已發布' : ' · 草稿'}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-primary-content/60">
              {editLookup.search.trim()
                ? '找不到符合搜尋條件的食譜。'
                : `目前沒有${editLookup.type === 'baking' ? '烘焙' : '料理'}食譜。`}
            </div>
          )}
        </div>
      </div>

      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="rounded-lg border border-[#e5ddd0] bg-[#faf6ef] px-4 py-3 text-sm text-primary-content">
          {form.source === 'markdown'
            ? `編輯 Markdown 食譜：${loadedRecipeRef.slug}。儲存後建立 Notion 版本，發布後優先顯示，原始檔案保留；類別與網址請維持原值。`
            : form.pageId
            ? `編輯模式：${loadedRecipeRef.slug || form.slug}`
            : '新增模式：儲存為新的 Notion 食譜'}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">食譜名稱</span>
            <input className={fieldClassName} value={form.title} onChange={updateField('title')} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">網址代稱（英文）</span>
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
            <span className="text-sm font-medium text-primary-content">食譜類別</span>
            <div className="relative w-full" ref={typeDropdownRef}>
              <button
                type="button"
                className={dropdownButtonClassName}
                onClick={() => setIsTypeDropdownOpen((current) => !current)}
              >
                <span className="flex-1 text-left">{form.type === 'baking' ? '烘焙' : '料理'}</span>
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
                    料理
                  </button>
                  <button
                    type="button"
                    className={`${dropdownOptionClassName} ${form.type === 'baking' ? dropdownOptionActiveClassName : dropdownOptionInactiveClassName}`}
                    onClick={() => {
                      setForm((current) => ({ ...current, type: 'baking' }));
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    烘焙
                  </button>
                </div>
              )}
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">發布日期</span>
            <input
              type="date"
              className={`${fieldClassName} appearance-none`}
              value={form.date}
              onChange={updateField('date')}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-primary-content">食譜簡介</span>
          <textarea className={`${fieldClassName} min-h-24`} value={form.desc} onChange={updateField('desc')} />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">材料名稱</span>
            <textarea
              className={`${fieldClassName} min-h-36`}
              value={form.scalingEnabled ? form.scalingDraft.groups.flatMap((group) => group.items.map((item) => item.name)).filter(Boolean).join('\n') : form.ingredients}
              readOnly={form.scalingEnabled}
              onChange={updateField('ingredients')}
              placeholder={form.scalingEnabled ? '使用下方換算材料，儲存時自動同步' : '每行填寫一項材料'}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-content">標籤</span>
            <textarea
              className={`${fieldClassName} min-h-36`}
              value={form.labels}
              onChange={updateField('labels')}
              placeholder={'每行填寫一個標籤'}
            />
          </label>
        </div>

        <section className="min-w-0 rounded-lg border border-[#e5ddd0] bg-[#faf6ef] p-4" aria-label="份量換算設定">
          <label className="flex items-center gap-3 text-sm font-medium text-primary-content">
            <input type="checkbox" checked={form.scalingEnabled} onChange={(event) => setForm((current) => ({ ...current, scalingEnabled: event.target.checked }))} />
            啟用份量換算
          </label>
          {form.scalingEnabled ? (
            <RecipeScalingEditor value={form.scalingDraft} onChange={(scalingDraft) => setForm((current) => ({ ...current, scalingDraft }))} />
          ) : (
            <p className="!mx-0 text-sm text-primary-content">關閉時依原本 Markdown 顯示材料，不提供換算；重新開啟可繼續編輯尚未儲存的材料設定。</p>
          )}
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[#e5ddd0] bg-white p-4">
            <div className="mb-2 text-sm font-medium text-primary-content">封面圖片</div>
            <div className="mb-3 text-xs text-primary-content/60">
              可直接從手機上傳封面，系統會自動填入圖片網址。
            </div>
            <input type="file" accept="image/*" className={fileInputClassName} onChange={onUploadCover} />
            {isUploadingCover && <div className="mt-3 text-sm text-primary-content/70">{uploadStatus || '正在上傳封面圖片⋯'}</div>}
            {form.coverImage && (
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt="封面預覽" className="w-full rounded-lg object-cover" />
                <input className={`${fieldClassName} mt-3`} value={form.coverImage} onChange={updateField('coverImage')} />
              </div>
            )}
          </div>

          <div className="rounded-lg border border-[#e5ddd0] bg-white p-4">
            <div className="mb-2 text-sm font-medium text-primary-content">食譜照片</div>
            <div className="mb-3 text-xs text-primary-content/60">
              可一次上傳多張照片，圖片網址會自動加入下方清單。
            </div>
            <input type="file" accept="image/*" multiple className={fileInputClassName} onChange={onUploadGallery} />
            {isUploadingGallery && <div className="mt-3 text-sm text-primary-content/70">{uploadStatus || '正在上傳食譜照片⋯'}</div>}
            <textarea
              className={`${fieldClassName} mt-4 min-h-36`}
              value={form.gallery}
              onChange={updateField('gallery')}
              placeholder={'每行填寫一個圖片網址'}
            />
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-primary-content">食譜內容（Markdown）</span>
          <textarea
            className={`${fieldClassName} min-h-[420px] font-mono`}
            value={form.contentMarkdown}
            onChange={updateField('contentMarkdown')}
            placeholder={'### 材料\n\n#### 食材\n\n- 食材 `適量`\n\n### 步驟\n\n1. 第一步'}
          />
        </label>

        <label className="flex items-center gap-3 text-sm text-primary-content">
          <input type="checkbox" checked={form.published} onChange={updateField('published')} />
          立即發布
        </label>

        <button
          type="submit"
          className={`btn ${actionButtonClassName}`}
          disabled={isSaving || isUploadingCover || isUploadingGallery}
        >
          {isSaving ? '正在儲存⋯' : '儲存食譜至 Notion'}
        </button>
      </form>
    </div>
  );
};

export default NewRecipeAdmin;
