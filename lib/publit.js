import crypto from 'crypto';

export const publitBaseUrl = 'https://api.publit.io/v1';

export const publitEnabled = () => (
  Boolean(process.env.PUBLIT_API_KEY) && Boolean(process.env.PUBLIT_API_SECRET)
);

const createPublitSignature = ({ timestamp, nonce }) => {
  const hash = crypto.createHash('sha1');
  hash.update(`${timestamp}${nonce}${process.env.PUBLIT_API_SECRET}`);
  return hash.digest('hex');
};

const createPublitNonce = () => Math.floor(10000000 + (Math.random() * 90000000)).toString();

export const createPublitSignedQuery = () => {
  if (!publitEnabled()) {
    throw new Error('Publit.io is not configured');
  }

  const api_timestamp = Math.floor(Date.now() / 1000).toString();
  const api_nonce = createPublitNonce();
  const api_signature = createPublitSignature({ timestamp: api_timestamp, nonce: api_nonce });

  return {
    api_key: process.env.PUBLIT_API_KEY,
    api_timestamp,
    api_nonce,
    api_signature,
  };
};

export const uploadImageToPublit = async ({
  buffer,
  fileName,
  mimeType,
  publicId,
  folder,
}) => {
  const query = new URLSearchParams(createPublitSignedQuery());

  const formData = new FormData();
  formData.append('file', new Blob([buffer], { type: mimeType }), fileName);

  if (publicId) {
    formData.append('public_id', publicId);
  }

  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(`${publitBaseUrl}/files/create?${query.toString()}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  });

  const rawBody = await response.text();
  let data = null;

  try {
    data = rawBody ? JSON.parse(rawBody) : null;
  } catch (error) {
    data = null;
  }

  if (!response.ok || data?.success === false) {
    const errorMessage = data?.message || data?.error || rawBody || 'Unknown upload error';
    throw new Error(`Publit.io upload failed: ${response.status} ${errorMessage}`);
  }

  const fileUrl = data.url_preview || data.url_download || data.url_thumbnail || data.url || '';

  if (!fileUrl) {
    throw new Error('Publit.io upload succeeded but returned no usable URL');
  }

  return {
    id: data.id,
    url: fileUrl,
  };
};
