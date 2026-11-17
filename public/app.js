const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const GH = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const IMG = (id) => `${GH}other/official-artwork/${id}.png`;
const SPRITE = (id) => `${GH}${id}.png`;
const PALETA = ["#22c55e", "#f97316", "#3b82f6", "#eab308", "#ec4899", "#7c3aed", "#14b8a6", "#ef4444"];
const TIPOS = {
  normal: { pt: "Normal", cor: "#9ca3af" }, fire: { pt: "Fogo", cor: "#f97316" }, water: { pt: "Água", cor: "#3b82f6" },
  electric: { pt: "Elétrico", cor: "#eab308" }, grass: { pt: "Planta", cor: "#22c55e" }, ice: { pt: "Gelo", cor: "#38bdf8" },
  fighting: { pt: "Lutador", cor: "#dc2626" }, poison: { pt: "Veneno", cor: "#a855f7" }, ground: { pt: "Terrestre", cor: "#b45309" },
  flying: { pt: "Voador", cor: "#818cf8" }, psychic: { pt: "Psíquico", cor: "#ec4899" }, bug: { pt: "Inseto", cor: "#84cc16" },
  rock: { pt: "Pedra", cor: "#a8a29e" }, ghost: { pt: "Fantasma", cor: "#6d28d9" }, dragon: { pt: "Dragão", cor: "#4f46e5" },
  dark: { pt: "Sombrio", cor: "#374151" }, steel: { pt: "Aço", cor: "#64748b" }, fairy: { pt: "Fada", cor: "#f472b6" },
};
const STATS = { "hp": "HP", "attack": "Ataque", "defense": "Defesa", "special-attack": "Atq. Esp.", "special-defense": "Def. Esp.", "speed": "Velocidade" };
const bonito = (n) => String(n).split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const chipTipo = (t) => { const x = TIPOS[t] || { pt: bonito(t), cor: "#9ca3af" }; return `<span class="tipo" style="--c:${x.cor}">${x.pt}</span>`; };
const POR_PAGINA = 24, MAX_EQUIPE = 6, MAX_EQUIPES = 30;

let usuario = null, lista = [], porId = new Map(), favoritos = new Set(), equipes = [];
let rascunho = { id: null, nome: "", membros: [] }, idsTipo = null, pagina = 1, timerAviso;

/* ---------- Utilidades ---------- */
function ler(chave, padrao) { try { const v = JSON.parse(localStorage.getItem(chave)); return v == null ? padrao : v; } catch { return padrao; } }
function gravar(chave, v) { try { localStorage.setItem(chave, JSON.stringify(v)); } catch {} }
const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const idDaUrl = (u) => Number((String(u).match(/\/(\d+)\/?$/) || [])[1]);

function aviso(msg) {
  $("eq-msg").textContent = msg;
  const t = $("toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(timerAviso); timerAviso = setTimeout(() => { t.hidden = true; }, 2600);
}

/* ---------- Erros do Google na tela ---------- */
function mostrarErro(msg) { $("erro").textContent = msg; $("erro").hidden = false; }
["warn", "error"].forEach((nivel) => {
  const original = console[nivel];
  console[nivel] = function () {
    const texto = Array.from(arguments).join(" ");
    if (texto.indexOf("GSI_LOGGER") !== -1) {
      mostrarErro(/origin is not allowed/i.test(texto)
        ? "O Google não aceitou este endereço (" + location.origin + "). Cadastre-o em Origens JavaScript autorizadas."
        : "Aviso do Google: " + texto);
    }
    original.apply(console, arguments);
  };
});

/* ---------- Acesso à PokéAPI (via servidor protegido) ---------- */
const cacheApi = new Map();
async function api(caminho, params) {
  const q = new URLSearchParams(Object.assign({ caminho }, params || {})).toString();
  if (cacheApi.has(q)) return cacheApi.get(q);
  const r = await fetch("/api/pokeapi?" + q);
  if (r.status === 401) { mostrarLogin(); throw new Error("Sessão expirada. Entre novamente."); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.erro || "Erro ao consultar a PokéAPI.");
  cacheApi.set(q, d);
  return d;
}

/* ---------- Telas ---------- */
function mostrarLogin() { $("tela-app").hidden = true; $("tela-login").hidden = false; }

async function mostrarApp(u) {
  usuario = u;
  $("nome").textContent = u.nome || "Treinador";
  $("email").textContent = u.email || "";
  if (u.foto) { $("foto").src = u.foto; $("foto").hidden = false; } else { $("foto").hidden = true; }
  favoritos = new Set(ler("favoritos:" + u.sub, []));
  equipes = ler("equipes:" + u.sub, []);
  rascunho = { id: null, nome: "", membros: [] };
  $("eq-nome").value = "";
  $("tela-login").hidden = true; $("tela-app").hidden = false;
  $("grade").innerHTML = '<p class="vazio">Carregando Pokédex…</p>';
  desenharEditor(); desenharEquipes(); atualizarResumo();
  try {
    const d = await api("pokemon", { limit: 2000 });
    lista = d.results.map((r) => ({ id: idDaUrl(r.url), nome: r.name })).filter((p) => p.id && p.id < 10000).sort((a, b) => a.id - b.id);
    porId = new Map(lista.map((p) => [p.id, p]));
  } catch (e) { $("grade").innerHTML = `<p class="vazio erro">${esc(e.message)}</p>`; return; }
  $("filtro-tipo").innerHTML = '<option value="">Todos os tipos</option>' +
    Object.entries(TIPOS).map(([en, t]) => `<option value="${en}">${t.pt}</option>`).join("");
  atualizarResumo(); desenharGrade();
}

function atualizarResumo() {
  $("r-total").textContent = lista.length;
  $("r-fav").textContent = favoritos.size;
  $("r-eq").textContent = equipes.length;
  $("r-mem").textContent = equipes.reduce((s, e) => s + e.membros.length, 0);
}

/* ---------- Grade da Pokédex ---------- */
function filtrar() {
  const termo = $("busca").value.trim().toLowerCase().replace("#", "");
  const soFav = $("so-fav").getAttribute("aria-pressed") === "true";
  return lista.filter((p) =>
    (!termo || p.nome.includes(termo) || String(p.id) === termo) &&
    (!idsTipo || idsTipo.has(p.id)) && (!soFav || favoritos.has(p.id)));
}

const cartao = (p) => `
  <article class="cartao" tabindex="0" data-id="${p.id}" style="--cor:${PALETA[p.id % PALETA.length]}">
    <span class="num">#${String(p.id).padStart(3, "0")}</span>
    <button type="button" class="fav ${favoritos.has(p.id) ? "ativo" : ""}" data-fav="${p.id}"
      aria-label="Favoritar ${esc(bonito(p.nome))}" aria-pressed="${favoritos.has(p.id)}">★</button>
    <img src="${IMG(p.id)}" alt="${esc(bonito(p.nome))}" loading="lazy" onerror="this.outerHTML='<div class=&quot;sem-img&quot;>❓</div>'">
    <h3>${esc(bonito(p.nome))}</h3>
    <button type="button" class="chip mini-btn" data-add="${p.id}">+ Equipe</button>
  </article>`;

function desenharGrade() {
  const itens = filtrar();
  const paginas = Math.max(1, Math.ceil(itens.length / POR_PAGINA));
  pagina = Math.min(pagina, paginas);
  $("grade").innerHTML = itens.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA).map(cartao).join("");
  $("vazio").hidden = itens.length > 0;
  $("pag-info").textContent = `Página ${pagina} de ${paginas} · ${itens.length} Pokémon`;
  $("pag-ant").disabled = pagina <= 1;
  $("pag-prox").disabled = pagina >= paginas;
}

function alternarFavorito(id) {
  favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
  gravar("favoritos:" + usuario.sub, [...favoritos]);
  atualizarResumo(); desenharGrade();
}

/* ---------- Equipes ---------- */
function desenharEditor() {
  let h = "";
  for (let i = 0; i < MAX_EQUIPE; i++) {
    const m = rascunho.membros[i];
    h += m
      ? `<div class="slot cheio" style="--cor:${PALETA[m.id % PALETA.length]}">
           <button type="button" class="slot-rm" data-rm="${i}" aria-label="Remover ${esc(bonito(m.nome))}">✕</button>
           <img src="${SPRITE(m.id)}" alt="" data-det="${m.id}"><span>${esc(bonito(m.nome))}</span></div>`
      : `<div class="slot"><span>Slot ${i + 1}<br>vazio</span></div>`;
  }
  $("eq-slots").innerHTML = h;
  $("eq-salvar").textContent = rascunho.id ? "Atualizar equipe" : "Salvar equipe";
}

function desenharEquipes() {
  $("eq-qtd").textContent = `(${equipes.length}/${MAX_EQUIPES})`;
  $("eq-lista").innerHTML = equipes.length ? equipes.map((e) => `
    <article class="eq-card" data-eq="${e.id}">
      <h4>${esc(e.nome)}</h4>
      <div class="mini-linha">${e.membros.map((m) =>
        `<img src="${SPRITE(m.id)}" alt="${esc(bonito(m.nome))}" title="${esc(bonito(m.nome))}" width="48" height="48">`).join("")}</div>
      <div class="linha">
        <button type="button" class="chip mini-btn" data-acao="editar">Editar</button>
        <button type="button" class="chip mini-btn" data-acao="duplicar">Duplicar</button>
        <button type="button" class="chip mini-btn" data-acao="excluir">Excluir</button>
      </div>
    </article>`).join("") : '<p class="dica">Nenhuma equipe salva ainda.</p>';
  atualizarResumo();
}

function addMembro(p, botao) {
  if (rascunho.membros.length >= MAX_EQUIPE) { aviso("A equipe já tem 6 Pokémon. Remova um para adicionar outro."); return false; }
  rascunho.membros.push({ id: p.id, nome: p.nome });
  desenharEditor();
  aviso(`${bonito(p.nome)} adicionado (${rascunho.membros.length}/${MAX_EQUIPE}).`);
  if (botao) botao.textContent = "✔ Adicionado";
  return true;
}
const addPorId = (id, botao) => { const p = porId.get(id); if (p) addMembro(p, botao); };

function salvarEquipe() {
  if (!rascunho.membros.length) return aviso("Adicione pelo menos 1 Pokémon antes de salvar.");
  const existente = rascunho.id && equipes.find((x) => x.id === rascunho.id);
  const nome = $("eq-nome").value.trim() || (existente ? existente.nome : "Equipe " + (equipes.length + 1));
  if (existente) { existente.nome = nome; existente.membros = rascunho.membros.slice(); }
  else {
    if (equipes.length >= MAX_EQUIPES) return aviso("Limite de " + MAX_EQUIPES + " equipes. Exclua uma para salvar outra.");
    equipes.push({ id: novoId(), nome, membros: rascunho.membros.slice() });
  }
  gravar("equipes:" + usuario.sub, equipes);
  rascunho = { id: null, nome: "", membros: [] };
  $("eq-nome").value = "";
  desenharEditor(); desenharEquipes();
  aviso(`Equipe "${nome}" salva!`);
}

function novaEquipe() {
  rascunho = { id: null, nome: "", membros: [] };
  $("eq-nome").value = ""; desenharEditor(); aviso("Nova equipe em branco.");
}

$("eq-salvar").addEventListener("click", salvarEquipe);
$("eq-nova").addEventListener("click", novaEquipe);

$("eq-slots").addEventListener("click", (e) => {
  const rm = e.target.closest("[data-rm]");
  if (rm) { rascunho.membros.splice(Number(rm.dataset.rm), 1); return desenharEditor(); }
  const d = e.target.closest("[data-det]");
  if (d) abrirDetalhe(Number(d.dataset.det));
});

$("eq-lista").addEventListener("click", (e) => {
  const b = e.target.closest("[data-acao]");
  if (!b) return;
  const id = b.closest("[data-eq]").dataset.eq;
  const eq = equipes.find((x) => x.id === id);
  if (!eq) return;
  if (b.dataset.acao === "editar") {
    rascunho = { id: eq.id, nome: eq.nome, membros: eq.membros.slice() };
    $("eq-nome").value = eq.nome; desenharEditor();
    $("eq-nome").scrollIntoView({ behavior: "smooth", block: "center" });
    aviso(`Editando "${eq.nome}". Altere e clique em Atualizar equipe.`);
  } else if (b.dataset.acao === "duplicar") {
    if (equipes.length >= MAX_EQUIPES) return aviso("Limite de " + MAX_EQUIPES + " equipes.");
    equipes.push({ id: novoId(), nome: eq.nome + " (cópia)", membros: eq.membros.slice() });
    gravar("equipes:" + usuario.sub, equipes); desenharEquipes(); aviso("Equipe duplicada.");
  } else if (b.dataset.acao === "excluir" && confirm(`Excluir a equipe "${eq.nome}"?`)) {
    equipes = equipes.filter((x) => x.id !== id);
    if (rascunho.id === id) novaEquipe();
    gravar("equipes:" + usuario.sub, equipes); desenharEquipes(); aviso("Equipe excluída.");
  }
});

$("eq-busca").addEventListener("input", () => {
  const t = $("eq-busca").value.trim().toLowerCase().replace("#", "");
  const box = $("eq-sugestoes");
  if (!t) { box.hidden = true; return; }
  const achados = lista.filter((p) => p.nome.includes(t) || String(p.id) === t).slice(0, 8);
  box.innerHTML = achados.map((p) =>
    `<button type="button" data-add="${p.id}"><img src="${SPRITE(p.id)}" alt="" width="32" height="32"> ${esc(bonito(p.nome))} <small>#${p.id}</small></button>`
  ).join("") || "<p>Nada encontrado.</p>";
  box.hidden = false;
});
$("eq-busca").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const b = $("eq-sugestoes").querySelector("[data-add]");
  if (b) { addPorId(Number(b.dataset.add)); $("eq-busca").value = ""; $("eq-sugestoes").hidden = true; }
});
$("eq-sugestoes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-add]");
  if (b) { addPorId(Number(b.dataset.add)); $("eq-busca").value = ""; $("eq-sugestoes").hidden = true; $("eq-busca").focus(); }
});

$("eq-exportar").addEventListener("click", async () => {
  const texto = JSON.stringify(equipes);
  try { await navigator.clipboard.writeText(texto); aviso("Equipes copiadas! Cole em um bloco de notas para guardar."); }
  catch { prompt("Copie este texto para guardar suas equipes:", texto); }
});
$("eq-importar").addEventListener("click", () => {
  const texto = prompt("Cole aqui o texto exportado das suas equipes:");
  if (!texto) return;
  try {
    const dados = JSON.parse(texto);
    if (!Array.isArray(dados)) throw new Error();
    let n = 0;
    for (const e of dados) {
      if (equipes.length >= MAX_EQUIPES) break;
      if (!e || typeof e.nome !== "string" || !Array.isArray(e.membros)) continue;
      const membros = e.membros.filter((m) => m && Number.isInteger(m.id) && typeof m.nome === "string").slice(0, MAX_EQUIPE)
        .map((m) => ({ id: m.id, nome: m.nome }));
      if (membros.length) { equipes.push({ id: novoId(), nome: e.nome.slice(0, 30), membros }); n++; }
    }
    gravar("equipes:" + usuario.sub, equipes); desenharEquipes(); aviso(n + " equipe(s) importada(s).");
  } catch { aviso("Texto inválido. Use o texto gerado por Exportar equipes."); }
});

/* ---------- Detalhes do Pokémon ---------- */
function achatar(no, acc) {
  acc.push({ id: idDaUrl(no.species.url), nome: no.species.name });
  (no.evolves_to || []).forEach((n) => achatar(n, acc));
  return acc;
}

async function abrirDetalhe(id) {
  const dlg = $("detalhe");
  dlg.innerHTML = '<div class="det-corpo"><p>Carregando…</p></div>';
  if (!dlg.open) dlg.showModal();
  try {
    const [p, esp] = await Promise.all([api("pokemon/" + id), api("pokemon-species/" + id)]);
    let evo = [];
    try { evo = achatar((await api("evolution-chain/" + idDaUrl(esp.evolution_chain.url))).chain, []); } catch {}
    const cor = (TIPOS[p.types[0].type.name] || {}).cor || "#7c3aed";
    const nome = bonito(p.name);
    const pt = esp.flavor_text_entries.find((x) => x.language.name === "pt-BR");
    const tx = pt || esp.flavor_text_entries.find((x) => x.language.name === "en");
    const desc = tx ? tx.flavor_text.replace(/[\n\f\r]+/g, " ") + (pt ? "" : " (texto em inglês)") : "";
    const genero = (esp.genera.find((g) => g.language.name === "en") || {}).genus || "";
    dlg.innerHTML = `
      <div class="det-topo" style="--cor:${cor}">
        <img src="${IMG(id)}" alt="${esc(nome)}">
        <h2>${esc(nome)} <small>#${String(id).padStart(3, "0")}</small></h2>
        <div class="tipos">${p.types.map((t) => chipTipo(t.type.name)).join("")}</div>
      </div>
      <div class="det-corpo">
        <p>${esc(desc)}</p>
        <div class="medidas"><span>${esc(genero)}</span><span>Altura: ${p.height / 10} m</span><span>Peso: ${p.weight / 10} kg</span></div>
        <h4>Habilidades</h4>
        <div class="tipos">${p.abilities.map((a) => `<span class="tipo" style="--c:#7c3aed">${esc(bonito(a.ability.name))}${a.is_hidden ? " (oculta)" : ""}</span>`).join("")}</div>
        <h4>Atributos base</h4>
        ${p.stats.map((s) => `<div class="barra"><span>${STATS[s.stat.name] || esc(s.stat.name)}</span><strong>${s.base_stat}</strong>
          <div class="trilho"><div class="preench" style="width:${Math.min(100, (s.base_stat / 200) * 100)}%;--cor:${cor}"></div></div></div>`).join("")}
        <h4>Linha evolutiva</h4>
        <div class="tipos">${evo.map((x) => `<button type="button" class="chip mini-btn" data-det="${x.id}">${esc(bonito(x.nome))}</button>`).join("") || "–"}</div>
        <h4>Alguns golpes</h4>
        <p>${p.moves.slice(0, 8).map((m) => esc(bonito(m.move.name))).join(", ") || "–"}</p>
        <div class="linha">
          <button type="button" class="chip destaque" data-add="${id}">+ Adicionar à equipe</button>
          <button type="button" class="chip" data-fechar="1">Fechar</button>
        </div>
      </div>`;
  } catch (e) {
    dlg.innerHTML = `<div class="det-corpo"><p class="erro">${esc(e.message)}</p><button type="button" class="chip" data-fechar="1">Fechar</button></div>`;
  }
}

$("detalhe").addEventListener("click", (e) => {
  const dlg = $("detalhe");
  if (e.target === dlg || e.target.closest("[data-fechar]")) return dlg.close();
  const d = e.target.closest("[data-det]");
  if (d) return abrirDetalhe(Number(d.dataset.det));
  const a = e.target.closest("[data-add]");
  if (a) addPorId(Number(a.dataset.add), a);
});

/* ---------- Grade: eventos ---------- */
$("grade").addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) return alternarFavorito(Number(fav.dataset.fav));
  const add = e.target.closest("[data-add]");
  if (add) return addPorId(Number(add.dataset.add));
  const c = e.target.closest(".cartao");
  if (c) abrirDetalhe(Number(c.dataset.id));
});
$("grade").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.classList.contains("cartao")) abrirDetalhe(Number(e.target.dataset.id));
});
$("busca").addEventListener("input", () => { pagina = 1; desenharGrade(); });
$("so-fav").addEventListener("click", (e) => {
  const b = e.currentTarget;
  b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
  pagina = 1; desenharGrade();
});
$("filtro-tipo").addEventListener("change", async () => {
  const t = $("filtro-tipo").value; pagina = 1;
  if (!t) { idsTipo = null; return desenharGrade(); }
  try { idsTipo = new Set((await api("type/" + t)).pokemon.map((x) => idDaUrl(x.pokemon.url))); }
  catch (e) { aviso(e.message); idsTipo = null; }
  desenharGrade();
});
$("pag-ant").addEventListener("click", () => { pagina--; desenharGrade(); window.scrollTo({ top: 0, behavior: "smooth" }); });
$("pag-prox").addEventListener("click", () => { pagina++; desenharGrade(); window.scrollTo({ top: 0, behavior: "smooth" }); });

document.querySelectorAll("[data-aba]").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll("[data-aba]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  $("aba-pokedex").hidden = b.dataset.aba !== "pokedex";
  $("aba-explorador").hidden = b.dataset.aba !== "explorador";
}));

/* ---------- Explorador da API (todos os endpoints) ---------- */
// [endpoint, rótulo, "in" = número ou nome | "i" = só número]
const CATALOGO = [
  ["pokemon", "Pokémon", "in"], ["pokemon/encounters", "Pokémon: locais de encontro", "in"], ["pokemon-species", "Pokémon: espécie", "in"],
  ["pokemon-form", "Pokémon: forma", "in"], ["pokemon-color", "Pokémon: cor", "in"], ["pokemon-habitat", "Pokémon: habitat", "in"],
  ["pokemon-shape", "Pokémon: formato", "in"], ["type", "Tipo", "in"], ["ability", "Habilidade", "in"], ["move", "Golpe", "in"],
  ["move-ailment", "Golpe: condição", "in"], ["move-battle-style", "Golpe: estilo de batalha", "in"], ["move-category", "Golpe: categoria", "in"],
  ["move-damage-class", "Golpe: classe de dano", "in"], ["move-learn-method", "Golpe: método de aprendizado", "in"],
  ["move-target", "Golpe: alvo", "in"], ["machine", "Máquina (TM/HM)", "i"], ["stat", "Atributo (stat)", "in"], ["nature", "Natureza", "in"],
  ["characteristic", "Característica", "i"], ["egg-group", "Grupo de ovos", "in"], ["gender", "Gênero", "in"],
  ["growth-rate", "Taxa de crescimento", "in"], ["pokeathlon-stat", "Pokéathlon stat", "in"], ["evolution-chain", "Cadeia de evolução", "i"],
  ["evolution-trigger", "Gatilho de evolução", "in"], ["evolution-variable", "Variável de evolução", "in"], ["item", "Item", "in"],
  ["item-attribute", "Item: atributo", "in"], ["item-category", "Item: categoria", "in"], ["item-fling-effect", "Item: efeito de arremesso", "in"],
  ["item-price", "Item: preço", "in"], ["item-pocket", "Item: bolso", "in"], ["berry", "Fruta (berry)", "in"],
  ["berry-firmness", "Fruta: firmeza", "in"], ["berry-flavor", "Fruta: sabor", "in"], ["contest-type", "Concurso: tipo", "in"],
  ["contest-effect", "Concurso: efeito", "i"], ["super-contest-effect", "Super concurso: efeito", "i"], ["location", "Local", "in"],
  ["location-area", "Área de local", "in"], ["pal-park-area", "Área do Pal Park", "in"], ["region", "Região", "in"],
  ["encounter-method", "Encontro: método", "in"], ["encounter-condition", "Encontro: condição", "in"],
  ["encounter-condition-value", "Encontro: valor da condição", "in"], ["generation", "Geração", "in"], ["pokedex", "Pokédex", "in"],
  ["version", "Versão", "in"], ["version-group", "Grupo de versões", "in"], ["currency", "Moeda", "in"], ["language", "Idioma", "in"],
];
let pilha = [];

$("ex-endpoint").innerHTML = CATALOGO.map(([ep, rot], i) => `<option value="${i}">${esc(rot)} (${ep})</option>`).join("");
function dicaParam() {
  $("ex-param").placeholder = CATALOGO[Number($("ex-endpoint").value)][2] === "i"
    ? "número (ex.: 1) — vazio = lista" : "número ou nome (ex.: pikachu) — vazio = lista";
}
dicaParam();
$("ex-endpoint").addEventListener("change", dicaParam);

function textoJson(s) {
  const m = s.match(/^https:\/\/pokeapi\.co\/api\/v2\/(.+?)\/?$/);
  if (m) return `<a href="#" data-api="${esc(m[1])}">${esc(s)}</a>`;
  if (/^https:\/\/\S+\.(png|svg|gif)$/i.test(s)) return `<img class="j-img" loading="lazy" src="${esc(s)}" alt="">`;
  return esc(s);
}
function noJson(v) {
  if (v === null) return "<i>null</i>";
  if (typeof v === "string") return textoJson(v);
  if (typeof v !== "object") return `<span class="j-num">${esc(v)}</span>`;
  const ent = Array.isArray(v) ? v.map((x, i) => [i, x]) : Object.entries(v);
  if (!ent.length) return Array.isArray(v) ? "[ ]" : "{ }";
  return ent.map(([k, x]) => (x === null || typeof x !== "object")
    ? `<div class="j-linha"><b>${esc(k)}:</b> ${noJson(x)}</div>`
    : `<details data-i="${pilha.push(x) - 1}"><summary><b>${esc(k)}</b> <small>${Array.isArray(x) ? "[" + x.length + "]" : "{…}"}</small></summary></details>`
  ).join("");
}
// Abre os blocos só quando clicados (evita travar com respostas grandes)
$("ex-resultado").addEventListener("toggle", (e) => {
  const d = e.target;
  if (d.open && d.dataset.i !== undefined && !d.dataset.feito) {
    d.dataset.feito = "1";
    d.insertAdjacentHTML("beforeend", noJson(pilha[Number(d.dataset.i)]));
  }
}, true);
$("ex-resultado").addEventListener("click", (e) => {
  const a = e.target.closest("[data-api]");
  if (a) { e.preventDefault(); executar(a.dataset.api); }
});

async function executar(caminho, params) {
  if (caminho.includes("?")) { const [c, q] = caminho.split("?"); caminho = c; params = Object.fromEntries(new URLSearchParams(q)); }
  caminho = caminho.replace(/\/+$/, "");
  const box = $("ex-resultado");
  $("ex-url").textContent = "https://pokeapi.co/api/v2/" + caminho + "/";
  box.innerHTML = "Consultando…";
  try {
    const d = await api(caminho, params);
    pilha = [];
    if (Array.isArray(d.results) && "count" in d) {
      const base = caminho.split("/")[0];
      box.innerHTML = `<p><b>${d.count}</b> itens no total (mostrando ${d.results.length}). Clique para abrir:</p><div class="lista-res">` +
        d.results.map((r) => {
          const rot = r.name || "nº " + idDaUrl(r.url);
          return `<a href="#" class="chip mini-btn" data-api="${esc(base + "/" + (r.name || idDaUrl(r.url)))}">${esc(rot)}</a>`;
        }).join("") + "</div>";
    } else {
      box.innerHTML = noJson(d);
    }
  } catch (e) { box.innerHTML = `<p class="erro">${esc(e.message)}</p>`; }
}

$("ex-ir").addEventListener("click", () => {
  const ep = CATALOGO[Number($("ex-endpoint").value)][0];
  const [base, suf] = ep.split("/");
  const param = $("ex-param").value.trim().toLowerCase();
  if (!param) {
    if (suf) return ($("ex-resultado").innerHTML = '<p class="erro">Informe o número ou nome do Pokémon para ver os encontros.</p>');
    return executar(base, { limit: 60 });
  }
  executar(base + "/" + encodeURIComponent(param) + (suf ? "/" + suf : ""));
});
$("ex-param").addEventListener("keydown", (e) => { if (e.key === "Enter") $("ex-ir").click(); });

/* ---------- Sair ---------- */
$("sair").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
  usuario = null; cacheApi.clear();
  mostrarLogin();
});

/* ---------- Login com Google ---------- */
async function aoReceberCredencial({ credential }) {
  $("erro").hidden = true;
  try {
    const r = await fetch("/api/auth/google", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: credential }),
    });
    const dados = await r.json();
    if (!r.ok) return mostrarErro(dados.erro || "Não foi possível entrar.");
    await mostrarApp(dados.usuario);
  } catch { mostrarErro("Falha de conexão. Tente novamente."); }
}

function iniciarGoogle(clientId, tentativas) {
  tentativas = tentativas || 0;
  if (!window.google || !google.accounts) {
    if (tentativas > 50) return mostrarErro("A biblioteca do Google não carregou. Desative bloqueadores e tente em janela anônima.");
    return setTimeout(() => iniciarGoogle(clientId, tentativas + 1), 200);
  }
  google.accounts.id.initialize({ client_id: clientId, callback: aoReceberCredencial, ux_mode: "popup" });
  google.accounts.id.renderButton($("botao-google"), { theme: "filled_blue", size: "large", text: "continue_with", shape: "pill", locale: "pt-BR" });
}

(async function iniciar() {
  try {
    const me = await fetch("/api/me");
    if (me.ok) {
      await mostrarApp((await me.json()).usuario);
    } else {
      const { clientId } = await (await fetch("/api/config")).json();
      mostrarLogin();
      const id = (clientId || "").trim();
      if (!id) mostrarErro("GOOGLE_CLIENT_ID não configurado na Vercel.");
      else iniciarGoogle(id);
    }
  } catch { mostrarLogin(); mostrarErro("Não foi possível carregar a aplicação."); }
  finally { $("carregando").hidden = true; }
})();
