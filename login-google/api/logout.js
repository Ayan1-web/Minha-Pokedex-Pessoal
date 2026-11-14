// Encerra a sessão: expira o cookie.
import { cookieExpirado, mesmaOrigem } from "../lib/sessao.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido." });
  if (!mesmaOrigem(req)) return res.status(403).json({ erro: "Origem não autorizada." });
  res.setHeader("Set-Cookie", cookieExpirado());
  res.status(200).json({ ok: true });
}
