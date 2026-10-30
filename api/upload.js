import { handleUploadPresigned } from '@vercel/blob/client';
import { issueSignedToken } from '@vercel/blob';

const MAX_BYTES = 50 * 1024 * 1024;
const PDF = ['application/pdf'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const json = await handleUploadPresigned({
      body: req.body,
      request: req,
      getSignedToken: async (pathname) => {
        if (!/^pdfs\/[a-z0-9]{10}\/[\w .()\-]+\.pdf$/.test(pathname)) throw new Error('Caminho inválido');
        const token = await issueSignedToken({ pathname, operations: ['put'], maximumSizeInBytes: MAX_BYTES, allowedContentTypes: PDF });
        return { token, urlOptions: { maximumSizeInBytes: MAX_BYTES, allowedContentTypes: PDF, addRandomSuffix: false } };
      },
    });
    res.status(200).json(json);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
