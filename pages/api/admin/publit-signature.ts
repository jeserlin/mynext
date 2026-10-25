import type { NextApiRequest, NextApiResponse } from 'next';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getErrorMessage } from 'lib/errors';
import { createPublitSignedQuery } from 'lib/publit';
import type { PublitSignedQuery } from 'lib/publit';

type SignatureResponse = PublitSignedQuery | { error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignatureResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    return res.status(200).json(createPublitSignedQuery());
  } catch (error) {
    return res.status(500).json({
      error: getErrorMessage(error, 'Unable to sign upload'),
    });
  }
}
