// Informa quem está logado (lê o cookie de sessão).
import { lerCookie, lerToken } from "../lib/sessao.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const segredo = process.env.SESSION_SECRET;
  const usuario = segredo ? lerToken(lerCookie(req), segredo) : null;
  if (!usuario) return res.status(401).json({ logado: false });
  const { sub, nome, email, foto } = usuario;
  res.status(200).json({ logado: true, usuario: { sub, nome, email, foto } });
}
