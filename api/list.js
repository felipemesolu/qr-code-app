import { list } from '@vercel/blob';

export default async function handler(req, res) {
  const id = String(req.query.id || '');
  if (!/^[a-z0-9]{10}$/.test(id)) return res.status(400).json({ error: 'ID inválido' });
  const { blobs } = await list({ prefix: `pastas/${id}/` });
  res.status(200).json(
    blobs.map((b) => ({
      name: b.pathname.split('/').pop(),
      size: b.size,
      url: b.url,
      downloadUrl: b.downloadUrl,
    }))
  );
}
