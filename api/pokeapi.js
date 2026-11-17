// PROXY PROTEGIDO da PokéAPI: só atende quem tem sessão válida (login Google)
// e só repassa os endpoints da lista em lib/endpoints.js.
import { lerCookie, lerToken } from "../lib/sessao.js";
import { ENDPOINTS } from "../lib/endpoints.js";

const BASE = "https://pokeapi.co/api/v2/";
const TTL = 60 * 60 * 1000; // 1 hora
const cache = new Map();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ erro: "Método não permitido." });

  const segredo = process.env.SESSION_SECRET;
  const usuario = segredo ? lerToken(lerCookie(req), segredo) : null;
  if (!usuario) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(401).json({ erro: "Faça login para consultar a PokéAPI." });
  }

  const caminho = String(req.query.caminho || "").replace(/^\/+|\/+$/g, "");
  const m = caminho.match(/^([a-z-]+)(?:\/([a-z0-9-]+))?(?:\/(encounters))?$/);
  if (!m || !ENDPOINTS.includes(m[1]) || (m[3] && (m[1] !== "pokemon" || !m[2]))) {
    return res.status(400).json({ erro: "Endpoint não permitido." });
  }

  const qs = new URLSearchParams();
  for (const k of ["limit", "offset"]) {
    const v = req.query[k];
    if (v === undefined) continue;
    if (!/^\d{1,5}$/.test(String(v))) return res.status(400).json({ erro: "Parâmetro inválido." });
    qs.set(k, String(Math.min(Number(v), 3000)));
  }
  const url = BASE + caminho + (m[3] ? "" : "/") + (qs.toString() ? "?" + qs : "");

  const guardado = cache.get(url);
  if (guardado && Date.now() - guardado.t < TTL) {
    res.setHeader("Cache-Control", "private, max-age=3600");
    return res.status(200).json(guardado.dados);
  }

  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (r.status === 404) return res.status(404).json({ erro: "Não encontrado na PokéAPI." });
    if (!r.ok) return res.status(502).json({ erro: "A PokéAPI respondeu com erro (" + r.status + ")." });
    const dados = await r.json();
    if (cache.size > 300) cache.clear();
    cache.set(url, { t: Date.now(), dados });
    res.setHeader("Cache-Control", "private, max-age=3600");
    return res.status(200).json(dados);
  } catch {
    return res.status(504).json({ erro: "A PokéAPI não respondeu a tempo. Tente de novo." });
  }
}
