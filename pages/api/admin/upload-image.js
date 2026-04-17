import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { createPublitSignedQuery, publitBaseUrl } from 'lib/publit';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const query = new URLSearchParams(createPublitSignedQuery());
    const response = await fetch(`${publitBaseUrl}/files/create?${query.toString()}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': req.headers['content-type'],
      },
      // Node fetch requires duplex when streaming a request body.
      duplex: 'half',
      body: req,
    });

    const rawBody = await response.text();
    let data = null;

    try {
      data = rawBody ? JSON.parse(rawBody) : null;
    } catch (error) {
      data = null;
    }

    if (!response.ok || data?.success === false) {
      return res.status(response.status || 500).json({
        error: data?.message || data?.error || rawBody || 'Upload failed',
      });
    }

    return res.status(200).json({
      id: data.id,
      url: data.url_preview || data.url_download || data.url_thumbnail || data.url || '',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
}
