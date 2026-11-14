// Recebe o ID token do navegador, VALIDA no servidor e cria a sessão.
import { OAuth2Client } from "google-auth-library";
import { criarToken, cookieDeSessao, mesmaOrigem } from "../../lib/sessao.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido." });
  if (!mesmaOrigem(req)) return res.status(403).json({ erro: "Origem não autorizada." });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const segredo = process.env.SESSION_SECRET;
  if (!clientId || !segredo || segredo.length < 32) {
    return res.status(500).json({ erro: "Servidor sem GOOGLE_CLIENT_ID ou SESSION_SECRET (mín. 32 caracteres)." });
  }

  const idToken = req.body && req.body.id_token;
  if (typeof idToken !== "string" || !idToken) {
    return res.status(400).json({ erro: "id_token ausente." });
  }

  try {
    const client = new OAuth2Client(clientId);
    // Verifica assinatura, emissor, expiração e audiência.
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const d = ticket.getPayload();

    if (!d.email_verified) {
      return res.status(403).json({ erro: "E-mail do Google não verificado." });
    }

    const sessao = {
      sub: d.sub, // identificador estável da conta Google
      nome: d.name || "",
      email: d.email || "",
      foto: d.picture || "",
    };
    res.setHeader("Set-Cookie", cookieDeSessao(criarToken(sessao, segredo)));
    return res.status(200).json({ ok: true, usuario: sessao });
  } catch (e) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}
