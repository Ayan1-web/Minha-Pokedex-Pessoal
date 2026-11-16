// ROTA PROTEGIDA: só responde se existir uma sessão válida (criada após o login com Google).
import { lerCookie, lerToken } from "../lib/sessao.js";
import { POKEMON } from "../lib/pokemon.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ erro: "Método não permitido." });

  const segredo = process.env.SESSION_SECRET;
  const usuario = segredo ? lerToken(lerCookie(req), segredo) : null;
  if (!usuario) return res.status(401).json({ erro: "Faça login para ver a Pokédex." });

  res.status(200).json({ pokemon: POKEMON });
}
