// Entrega ao navegador somente o Client ID (que é público por natureza).
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ clientId: process.env.GOOGLE_CLIENT_ID || null });
}
