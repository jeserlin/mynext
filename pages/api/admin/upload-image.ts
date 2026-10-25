import type { NextApiRequest, NextApiResponse } from 'next';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getErrorMessage } from 'lib/errors';
import { createPublitSignedQuery, publitBaseUrl } from 'lib/publit';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface PublitUploadResponse {
  success?: boolean;
  message?: string;
  error?: string;
  id?: string;
  url_preview?: string;
  url_download?: string;
  url_thumbnail?: string;
  url?: string;
}

type UploadResponse =
  | { id?: string; url: string }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const query = new URLSearchParams(createPublitSignedQuery());
    const headers = new Headers({ Accept: 'application/json' });
    const contentType = req.headers['content-type'];
    if (contentType) headers.set('Content-Type', contentType);

    const uploadRequest: RequestInit & { duplex: 'half' } = {
      method: 'POST',
      headers,
      // Node fetch requires duplex when streaming a request body.
      duplex: 'half',
      body: req as unknown as BodyInit,
    };
    const response = await fetch(
      `${publitBaseUrl}/files/create?${query.toString()}`,
      uploadRequest,
    );

    const rawBody = await response.text();
    let data: PublitUploadResponse | null = null;

    try {
      data = rawBody ? JSON.parse(rawBody) as PublitUploadResponse : null;
    } catch {
      data = null;
    }

    if (!response.ok || data?.success === false) {
      return res.status(response.status || 500).json({
        error: data?.message || data?.error || rawBody || 'Upload failed',
      });
    }

    return res.status(200).json({
      id: data?.id,
      url: data?.url_preview
        || data?.url_download
        || data?.url_thumbnail
        || data?.url
        || '',
    });
  } catch (error) {
    return res.status(500).json({
      error: getErrorMessage(error, 'Upload failed'),
    });
  }
}
