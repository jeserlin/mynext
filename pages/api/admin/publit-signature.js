import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { createPublitSignedQuery } from 'lib/publit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    return res.status(200).json(createPublitSignedQuery());
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to sign upload' });
  }
}
