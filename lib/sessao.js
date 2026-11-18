// Sessão própria assinada (HMAC-SHA256) guardada em cookie HttpOnly.
import crypto from "node:crypto";

const NOME_COOKIE = "sessao";
const DURACAO = 60 * 60 * 8; // 8 horas

function assinar(corpo, segredo) {
  return crypto.createHmac("sha256", segredo).update(corpo).digest("base64url");
}

export function criarToken(dados, segredo) {
  const corpo = Buffer.from(
    JSON.stringify({ ...dados, exp: Math.floor(Date.now() / 1000) + DURACAO })
  ).toString("base64url");
  return `${corpo}.${assinar(corpo, segredo)}`;
}

export function lerToken(token, segredo) {
  if (!token) return null;
  const [corpo, assinatura] = token.split(".");
  if (!corpo || !assinatura) return null;
  const a = Buffer.from(assinatura);
  const b = Buffer.from(assinar(corpo, segredo));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const dados = JSON.parse(Buffer.from(corpo, "base64url").toString());
    if (!dados.exp || dados.exp < Math.floor(Date.now() / 1000)) return null;
    return dados;
  } catch {
    return null;
  }
}

export function cookieDeSessao(token) {
  return `${NOME_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${DURACAO}`;
}

export function cookieExpirado() {
  return `${NOME_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function lerCookie(req) {
  const par = (req.headers.cookie || "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(NOME_COOKIE + "="));
  return par ? par.slice(NOME_COOKIE.length + 1) : null;
}

// Proteção CSRF simples: aceita apenas requisições vindas do próprio site.
export function mesmaOrigem(req) {
  const origem = req.headers.origin;
  if (!origem) return true;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return origem === `${proto}://${req.headers.host}`;
}
