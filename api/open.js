import { list } from '@vercel/blob';

const notFound = (res, msg) =>
  res.status(404).setHeader('content-type', 'text/html; charset=utf-8').send(
    `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>PDF não encontrado · QR-CODE app</title>` +
    `<body style="font-family:system-ui,sans-serif;max-width:420px;margin:15vh auto;padding:0 16px;text-align:center;color:#1f2333">` +
    `<h1 style="font-size:1.3rem">${msg}</h1><p><a href="/" style="color:#4f46e5">Enviar um PDF</a></p></body></html>`
  );

export default async function handler(req, res) {
  const id = String(req.query.id || '');
  if (!/^[a-z0-9]{10}$/.test(id)) return notFound(res, 'Link inválido.');
  const { blobs } = await list({ prefix: `pdfs/${id}/`, limit: 1 });
  if (!blobs.length) return notFound(res, 'PDF não encontrado.');
  res.setHeader('cache-control', 'no-store');
  res.redirect(302, blobs[0].url);
}
