import type { NextApiRequest, NextApiResponse } from 'next';

interface HelloResponse {
  name: string;
}

const handler = (_req: NextApiRequest, res: NextApiResponse<HelloResponse>) => {
  res.status(200).json({ name: 'John Doe' });
};

export default handler;
