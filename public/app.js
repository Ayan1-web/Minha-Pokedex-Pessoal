const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const GH = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/";
const IMG = (id) => `${GH}pokemon/other/official-artwork/${id}.png`;
const SPRITE = (id) => `${GH}pokemon/${id}.png`;
const ITEMIMG = (n) => `${GH}items/${n}.png`;
const PALETA = ["#22c55e", "#f97316", "#3b82f6", "#eab308", "#ec4899", "#7c3aed", "#14b8a6", "#ef4444"];
const TIPOS = {
  normal: { pt: "Normal", cor: "#9ca3af" }, fire: { pt: "Fogo", cor: "#f97316" }, water: { pt: "Água", cor: "#3b82f6" },
  electric: { pt: "Elétrico", cor: "#eab308" }, grass: { pt: "Planta", cor: "#22c55e" }, ice: { pt: "Gelo", cor: "#38bdf8" },
  fighting: { pt: "Lutador", cor: "#dc2626" }, poison: { pt: "Veneno", cor: "#a855f7" }, ground: { pt: "Terrestre", cor: "#b45309" },
  flying: { pt: "Voador", cor: "#818cf8" }, psychic: { pt: "Psíquico", cor: "#ec4899" }, bug: { pt: "Inseto", cor: "#84cc16" },
  rock: { pt: "Pedra", cor: "#a8a29e" }, ghost: { pt: "Fantasma", cor: "#6d28d9" }, dragon: { pt: "Dragão", cor: "#4f46e5" },
  dark: { pt: "Sombrio", cor: "#374151" }, steel: { pt: "Aço", cor: "#64748b" }, fairy: { pt: "Fada", cor: "#f472b6" },
};
const STATS = { "hp": "HP", "attack": "Ataque", "defense": "Defesa", "special-attack": "Atq. Esp.", "special-defense": "Def. Esp.", "speed": "Velocidade", "accuracy": "Precisão", "evasion": "Evasão" };
const DANO = { physical: "Físico", special: "Especial", status: "Status" };
const ALVO = {
  "specific-move": "Golpe específico", "selected-pokemon-me-first": "Alvo (Me First)", "ally": "Aliado", "users-field": "Campo do usuário",
  "user-or-ally": "Usuário ou aliado", "opponents-field": "Campo do oponente", "user": "O próprio usuário", "random-opponent": "Oponente aleatório",
  "all-other-pokemon": "Todos os outros Pokémon", "selected-pokemon": "Um alvo escolhido", "all-opponents": "Todos os oponentes",
  "entire-field": "Campo inteiro", "user-and-allies": "Usuário e aliados", "all-pokemon": "Todos os Pokémon", "all-allies": "Todos os aliados", "fainting-pokemon": "Pokémon derrotado",
};
const AILMENT = { paralysis: "Paralisia", sleep: "Sono", freeze: "Congelamento", burn: "Queimadura", poison: "Envenenamento", confusion: "Confusão", infatuation: "Paixão", trap: "Prender", nightmare: "Pesadelo", torment: "Tormento", disable: "Desabilitar", yawn: "Bocejo", "heal-block": "Bloqueio de cura", "leech-seed": "Semente Sanguessuga", "perish-song": "Canção da Perdição", ingrain: "Enraizar", embargo: "Embargo", silence: "Silêncio", "tar-shot": "Alcatrão", "no-type-immunity": "Remove imunidades de tipo" };
const ATRIB = { countable: "Contável", consumable: "Consumível", "usable-overworld": "Usável fora da batalha", "usable-in-battle": "Usável em batalha", holdable: "Pode ser segurado", "holdable-passive": "Segurado: efeito passivo", "holdable-active": "Segurado: ativa em batalha", underground: "Pode ser achado no subsolo" };
const METODO = { "level-up": "Por nível", egg: "Ovo", tutor: "Tutor", machine: "TM / TR / HM", "form-change": "Mudança de forma" };
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
const en = (arr, campo) => { const x = (arr || []).find((e) => e.language && e.language.name === "en"); return x ? (campo ? x[campo] : x) : null; };
const ultimoEn = (arr) => [...(arr || [])].reverse().find((e) => e.language && e.language.name === "en") || null;
const traduzir = (t) => t ? ` <a href="https://translate.google.com/?sl=en&tl=pt&op=translate&text=${encodeURIComponent(t)}" target="_blank" rel="noopener">Traduzir ↗</a>` : "";
const geracao = (g) => g ? "Geração " + String(g.name).split("-")[1].toUpperCase() : "–";
window.imgErro = function (el, id) {
  if (!el.dataset.t) { el.dataset.t = "1"; el.src = SPRITE(id); } else { el.outerHTML = '<div class="sem-img">❓</div>'; }
};

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
let ordemVgP = null;
const ordemVg = () => ordemVgP || (ordemVgP = api("version-group", { limit: 100 }).then((d) => new Map(d.results.map((r, i) => [r.name, i]))));

/* ---------- Pokébolas decorativas ---------- */
const BOLAS = {
  poke: { topo: "#ef4444", marca: "" },
  great: { topo: "#2563eb", marca: "#ef4444" },
  ultra: { topo: "#1f2937", marca: "#facc15" },
  master: { topo: "#7c3aed", marca: "#ec4899" },
  premier: { topo: "#f3f4f6", marca: "#ef4444" },
};
function bolaSvg(t) {
  const b = BOLAS[t], T = "#1e1b4b";
  let marca = "";
  if (t === "great") marca = `<path d="M16 32Q26 18 40 15M84 32Q74 18 60 15" stroke="${b.marca}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if (t === "ultra") marca = `<path d="M26 34V20M40 27V14M74 34V20M60 27V14" stroke="${b.marca}" stroke-width="6" stroke-linecap="round"/>`;
  if (t === "master") marca = `<circle cx="27" cy="30" r="8" fill="${b.marca}"/><circle cx="73" cy="30" r="8" fill="${b.marca}"/>`;
  if (t === "premier") marca = `<path d="M12 36Q50 10 88 36" stroke="${b.marca}" stroke-width="6" fill="none"/>`;
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#fff" stroke="${T}" stroke-width="6"/>
    <path d="M4 50a46 46 0 0 1 92 0z" fill="${b.topo}" stroke="${T}" stroke-width="6" stroke-linejoin="round"/>${marca}
    <rect x="4" y="46" width="92" height="8" fill="${T}"/><circle cx="50" cy="50" r="14" fill="#fff" stroke="${T}" stroke-width="6"/>
    <circle cx="50" cy="50" r="5" fill="#e5e7eb" stroke="${T}" stroke-width="2"/></svg>`;
}
$("lat-esq").innerHTML = ["poke", "great", "ultra", "master", "premier"].map(bolaSvg).join("");
$("lat-dir").innerHTML = ["master", "premier", "poke", "ultra", "great"].map(bolaSvg).join("");

/* ---------- Telas ---------- */
function mostrarLogin() { $("tela-app").hidden = true; $("tela-login").hidden = false; }

const classeForma = (n, id) =>
  /-mega(-[xyz])?$|-primal$/.test(n) ? "mega" : /-gmax$/.test(n) ? "gmax"
  : /-(alola|galar|hisui|paldea)(-|$)/.test(n) ? "regional" : id < 10000 ? "base" : "outra";

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
    const d = await api("pokemon", { limit: 3000 });
    lista = d.results.map((r) => ({ id: idDaUrl(r.url), nome: r.name })).filter((p) => p.id)
      .map((p) => Object.assign(p, { classe: classeForma(p.nome, p.id) })).sort((a, b) => a.id - b.id);
    porId = new Map(lista.map((p) => [p.id, p]));
  } catch (e) { $("grade").innerHTML = `<p class="vazio erro">${esc(e.message)}</p>`; return; }
  $("filtro-tipo").innerHTML = '<option value="">Todos os tipos</option>' + Object.entries(TIPOS).map(([k, t]) => `<option value="${k}">${t.pt}</option>`).join("");
  $("filtro-tipo-g").innerHTML = $("filtro-tipo").innerHTML;
  atualizarResumo(); desenharGrade();
  api("item", { limit: 3000 }).then((d) => { catItens.itens = d.results.map((r) => ({ id: idDaUrl(r.url), nome: r.name })); catItens.desenhar(); atualizarResumo(); }).catch(() => {});
  api("item-category", { limit: 200 }).then((d) => { $("filtro-cat-item").innerHTML = '<option value="">Todas as categorias</option>' + d.results.map((r) => `<option value="${esc(r.name)}">${esc(bonito(r.name))}</option>`).join(""); }).catch(() => {});
  api("move", { limit: 3000 }).then((d) => { catGolpes.itens = d.results.map((r) => ({ id: idDaUrl(r.url), nome: r.name })); catGolpes.desenhar(); }).catch(() => {});
}

function atualizarResumo() {
  $("r-total").textContent = lista.filter((p) => p.classe === "base").length;
  $("r-fav").textContent = favoritos.size;
  $("r-eq").textContent = equipes.length;
  $("r-mem").textContent = equipes.reduce((s, e) => s + e.membros.length, 0);
  $("r-itens").textContent = catItens.itens.length;
}

/* ---------- Grade da Pokédex ---------- */
function filtrar() {
  const termo = $("busca").value.trim().toLowerCase().replace("#", "");
  const soFav = $("so-fav").getAttribute("aria-pressed") === "true";
  const forma = $("filtro-forma").value;
  return lista.filter((p) =>
    (forma === "todas" || p.classe === forma) &&
    (!termo || p.nome.includes(termo) || String(p.id) === termo) &&
    (!idsTipo || idsTipo.has(p.id)) && (!soFav || favoritos.has(p.id)));
}

const cartao = (p) => `
  <article class="cartao" tabindex="0" data-id="${p.id}" style="--cor:${PALETA[p.id % PALETA.length]}">
    <span class="num">#${String(p.id).padStart(3, "0")}</span>
    <button type="button" class="fav ${favoritos.has(p.id) ? "ativo" : ""}" data-fav="${p.id}"
      aria-label="Favoritar ${esc(bonito(p.nome))}" aria-pressed="${favoritos.has(p.id)}">★</button>
    <img src="${IMG(p.id)}" alt="${esc(bonito(p.nome))}" loading="lazy" onerror="imgErro(this,${p.id})">
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

/* ---------- Catálogos de itens e golpes ---------- */
function Catalogo(c) {
  const e = { itens: [], ids: null, pag: 1 };
  const filtrar2 = () => {
    const t = $(c.b).value.trim().toLowerCase().replace("#", "");
    return e.itens.filter((i) => (!t || i.nome.includes(t) || String(i.id) === t) && (!e.ids || e.ids.has(i.id)));
  };
  e.desenhar = () => {
    const f = filtrar2(), n = Math.max(1, Math.ceil(f.length / c.por));
    e.pag = Math.min(e.pag, n);
    $(c.g).innerHTML = f.slice((e.pag - 1) * c.por, e.pag * c.por).map(c.card).join("") || '<p class="vazio">Nada encontrado.</p>';
    $(c.inf).textContent = `Página ${e.pag} de ${n} · ${f.length} resultados`;
    $(c.ant).disabled = e.pag <= 1; $(c.prox).disabled = e.pag >= n;
  };
  $(c.b).addEventListener("input", () => { e.pag = 1; e.desenhar(); });
  $(c.ant).addEventListener("click", () => { e.pag--; e.desenhar(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  $(c.prox).addEventListener("click", () => { e.pag++; e.desenhar(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  return e;
}
const cartaoItem = (i) => `<article class="cartao-i" tabindex="0" data-item="${esc(i.nome)}" style="--cor:${PALETA[i.id % PALETA.length]}">
  <img src="${ITEMIMG(esc(i.nome))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">${esc(bonito(i.nome))}</article>`;
const cartaoGolpe = (i) => `<article class="cartao-i" tabindex="0" data-golpe="${esc(i.nome)}" style="--cor:${PALETA[i.id % PALETA.length]}">${esc(bonito(i.nome))}</article>`;
const catItens = Catalogo({ g: "grade-i", b: "busca-i", ant: "pag-ant-i", prox: "pag-prox-i", inf: "pag-info-i", por: 48, card: cartaoItem });
const catGolpes = Catalogo({ g: "grade-g", b: "busca-g", ant: "pag-ant-g", prox: "pag-prox-g", inf: "pag-info-g", por: 60, card: cartaoGolpe });

$("filtro-cat-item").addEventListener("change", async () => {
  const c = $("filtro-cat-item").value; catItens.pag = 1;
  try { catItens.ids = c ? new Set((await api("item-category/" + c)).items.map((x) => idDaUrl(x.url))) : null; }
  catch (e) { aviso(e.message); catItens.ids = null; }
  catItens.desenhar();
});
$("filtro-tipo-g").addEventListener("change", async () => {
  const t = $("filtro-tipo-g").value; catGolpes.pag = 1;
  try { catGolpes.ids = t ? new Set((await api("type/" + t)).moves.map((x) => idDaUrl(x.url))) : null; }
  catch (e) { aviso(e.message); catGolpes.ids = null; }
  catGolpes.desenhar();
});
["grade-i", "grade-g"].forEach((g) => {
  $(g).addEventListener("click", (e) => { const c = e.target.closest("[data-item],[data-golpe]"); if (c) c.dataset.item ? abrir("item", c.dataset.item) : abrir("golpe", c.dataset.golpe); });
  $(g).addEventListener("keydown", (e) => { if (e.key === "Enter") e.target.click(); });
});

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
function novaEquipe() { rascunho = { id: null, nome: "", membros: [] }; $("eq-nome").value = ""; desenharEditor(); aviso("Nova equipe em branco."); }

$("eq-salvar").addEventListener("click", salvarEquipe);
$("eq-nova").addEventListener("click", novaEquipe);
$("eq-slots").addEventListener("click", (e) => {
  const rm = e.target.closest("[data-rm]");
  if (rm) { rascunho.membros.splice(Number(rm.dataset.rm), 1); return desenharEditor(); }
  const d = e.target.closest("[data-det]");
  if (d) abrir("poke", Number(d.dataset.det));
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
  const achados = lista.filter((p) => p.nome.includes(t) || String(p.id) === t)
    .sort((a, b) => (a.nome === t ? -1 : b.nome === t ? 1 : a.id - b.id)).slice(0, 10);
  box.innerHTML = achados.map((p) =>
    `<button type="button" data-add="${p.id}"><img src="${SPRITE(p.id)}" alt="" width="32" height="32"> ${esc(bonito(p.nome))} <small>#${p.id}</small></button>`
  ).join("") || "<p>Nada encontrado.</p>";
  box.hidden = false;
});
const escolherSug = (b) => { addPorId(Number(b.dataset.add)); $("eq-busca").value = ""; $("eq-sugestoes").hidden = true; $("eq-busca").focus(); };
$("eq-busca").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const b = $("eq-sugestoes").querySelector("[data-add]");
  if (b) escolherSug(b);
});
$("eq-sugestoes").addEventListener("click", (e) => { const b = e.target.closest("[data-add]"); if (b) escolherSug(b); });

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
      const membros = e.membros.filter((m) => m && Number.isInteger(m.id) && typeof m.nome === "string").slice(0, MAX_EQUIPE).map((m) => ({ id: m.id, nome: m.nome }));
      if (membros.length) { equipes.push({ id: novoId(), nome: e.nome.slice(0, 30), membros }); n++; }
    }
    gravar("equipes:" + usuario.sub, equipes); desenharEquipes(); aviso(n + " equipe(s) importada(s).");
  } catch { aviso("Texto inválido. Use o texto gerado por Exportar equipes."); }
});

/* ---------- Janela de detalhes (Pokémon, golpe, item, habilidade) ---------- */
const nav = [];
const navBar = () => nav.length > 1 ? '<button type="button" class="chip mini-btn voltar" data-voltar="1">← Voltar</button>' : "";
const fechaBtn = '<div class="linha"><button type="button" class="chip" data-fechar="1">Fechar</button></div>';
function abrir(tipo, ref, empurrar) {
  if (empurrar !== false) nav.push([tipo, ref]);
  const dlg = $("detalhe");
  if (!dlg.open) dlg.showModal();
  dlg.innerHTML = `<div class="det-corpo">${navBar()}<p>Carregando…</p></div>`;
  ({ poke: detPoke, golpe: detGolpe, item: detItem, hab: detHab })[tipo](ref).catch((e) => {
    dlg.innerHTML = `<div class="det-corpo">${navBar()}<p class="erro">${esc(e.message)}</p>${fechaBtn}</div>`;
  });
}
const chipsPoke = (arr, n) => arr.slice(0, n).map((x) => `<button type="button" class="chip mini-btn" data-det="${idDaUrl(x.url)}">${esc(bonito(x.name))}</button>`).join(" ");

/* --- Pokémon --- */
function efetividade(tiposDados) {
  const m = {}; Object.keys(TIPOS).forEach((t) => { m[t] = 1; });
  tiposDados.forEach((td) => {
    const r = td.damage_relations;
    r.double_damage_from.forEach((x) => { if (x.name in m) m[x.name] *= 2; });
    r.half_damage_from.forEach((x) => { if (x.name in m) m[x.name] *= 0.5; });
    r.no_damage_from.forEach((x) => { if (x.name in m) m[x.name] *= 0; });
  });
  return m;
}
const fmtM = (v) => v === 0 ? "0×" : v === 0.25 ? "¼×" : v === 0.5 ? "½×" : v + "×";
const rotuloForma = (n) => classeForma(n, 10001) === "mega" ? "Mega" : classeForma(n, 10001) === "gmax" ? "Gigantamax" : classeForma(n, 10001) === "regional" ? "Regional" : "";
let golpesEst = null;

function desenharGolpes() {
  const g = golpesEst, box = $("golpes-box");
  if (!box) return;
  const doVg = g.porVg.get(g.vg) || [];
  const metodos = [...new Set(doVg.map((x) => x.metodo))];
  if (!metodos.includes(g.metodo)) g.metodo = metodos.includes("level-up") ? "level-up" : metodos[0];
  const itens = doVg.filter((x) => x.metodo === g.metodo)
    .sort((a, b) => g.metodo === "level-up" ? a.nivel - b.nivel || a.nome.localeCompare(b.nome) : a.nome.localeCompare(b.nome));
  const nivel = g.metodo === "level-up";
  box.innerHTML = `
    <div class="linha"><select id="sel-vg" aria-label="Versão do jogo">${g.vgs.map((v) => `<option value="${esc(v)}" ${v === g.vg ? "selected" : ""}>${esc(bonito(v))}</option>`).join("")}</select></div>
    <div class="linha">${metodos.map((m) => `<button type="button" class="chip mini-btn" data-metodo="${esc(m)}" aria-pressed="${m === g.metodo}">${esc(METODO[m] || bonito(m))}</button>`).join("")}</div>
    <div class="tab-wrap"><table class="tab"><tr>${nivel ? "<th>Nível</th>" : ""}<th>Golpe (clique para ver a ficha)</th></tr>
      ${itens.map((x) => `<tr data-golpe="${esc(x.nome)}">${nivel ? `<td>${x.nivel === 0 ? "Evo." : x.nivel}</td>` : ""}<td>${esc(bonito(x.nome))}</td></tr>`).join("") || "<tr><td>Nenhum golpe.</td></tr>"}
    </table></div>`;
}

async function detPoke(id) {
  const dlg = $("detalhe");
  const p = await api("pokemon/" + id);
  const [esp, ord, ...tdados] = await Promise.all([api("pokemon-species/" + p.species.name), ordemVg(), ...p.types.map((t) => api("type/" + t.type.name))]);
  let movesApi = p.moves, herdado = false;
  if (!movesApi.length) {
    const base = esp.varieties.find((v) => v.is_default);
    if (base && base.pokemon.name !== p.name) { try { movesApi = (await api("pokemon/" + base.pokemon.name)).moves; herdado = true; } catch {} }
  }
  const porVg = new Map();
  movesApi.forEach((m) => m.version_group_details.forEach((d) => {
    const vg = d.version_group.name;
    if (!porVg.has(vg)) porVg.set(vg, []);
    porVg.get(vg).push({ nome: m.move.name, metodo: d.move_learn_method.name, nivel: d.level_learned_at });
  }));
  const vgs = [...porVg.keys()].sort((a, b) => (ord.get(b) ?? -1) - (ord.get(a) ?? -1));
  golpesEst = { porVg, vgs, vg: vgs[0], metodo: "level-up" };

  const cor = (TIPOS[p.types[0].type.name] || {}).cor || "#7c3aed";
  const nome = bonito(p.name);
  const pt = esp.flavor_text_entries.find((x) => x.language.name === "pt-BR");
  const tx = pt || ultimoEn(esp.flavor_text_entries);
  const desc = tx ? tx.flavor_text.replace(/[\n\f\r]+/g, " ") : "";
  const genero = (en(esp.genera) || {}).genus || "";
  const evs = p.stats.filter((s) => s.effort > 0);
  const fx = efetividade(tdados);
  const grupo = (f, rot) => {
    const a = Object.entries(fx).filter(([, v]) => f(v)).sort((x, y) => y[1] - x[1]);
    return a.length ? `<p class="grp"><b>${rot}:</b> ${a.map(([t, v]) => `${chipTipo(t)}<small>${fmtM(v)}</small>`).join("")}</p>` : "";
  };
  let evo = [];
  try { (function ach(no) { evo.push({ id: idDaUrl(no.species.url), nome: no.species.name }); (no.evolves_to || []).forEach(ach); })((await api("evolution-chain/" + idDaUrl(esp.evolution_chain.url))).chain); } catch {}
  const genderTxt = esp.gender_rate === -1 ? "Sem gênero" : `${Math.round(esp.gender_rate * 12.5)}% fêmea / ${100 - Math.round(esp.gender_rate * 12.5)}% macho`;
  const formas = esp.varieties.map((v) => ({ id: idDaUrl(v.pokemon.url), nome: v.pokemon.name }));

  dlg.innerHTML = `
    <div class="det-topo" style="--cor:${cor}">
      <img src="${IMG(id)}" alt="${esc(nome)}" onerror="imgErro(this,${id})">
      <h2>${esc(nome)} <small>#${String(id).padStart(3, "0")}</small></h2>
      <div class="tipos">${p.types.map((t) => chipTipo(t.type.name)).join("")}</div>
    </div>
    <div class="det-corpo">
      ${navBar()}
      <p>${esc(desc)}${pt ? "" : traduzir(desc)}</p>
      <div class="medidas"><span>${esc(genero)}</span><span>Altura: ${p.height / 10} m</span><span>Peso: ${p.weight / 10} kg</span></div>

      <h4>EVs concedidos (ao derrotar ou capturar)</h4>
      <div class="tipos">${evs.map((s) => `<span class="tipo" style="--c:#16a34a">+${s.effort} ${STATS[s.stat.name] || esc(s.stat.name)}</span>`).join("") || "–"}</div>
      <p class="nota">Limite por Pokémon: 252 EVs por atributo e 510 no total. A cada 4 EVs, +1 ponto no nível 100.</p>

      <h4>Formas (Mega, Gigantamax, regionais…)</h4>
      <div class="tipos">${formas.map((f) => `<button type="button" class="chip mini-btn" data-det="${f.id}" aria-pressed="${f.id === id}">${esc(bonito(f.nome))}${rotuloForma(f.nome) ? " · " + rotuloForma(f.nome) : ""}</button>`).join("")}</div>

      <h4>Habilidades (clique para ver a descrição)</h4>
      <div class="tipos">${p.abilities.map((a) => `<button type="button" class="chip mini-btn" data-hab="${esc(a.ability.name)}">${esc(bonito(a.ability.name))}${a.is_hidden ? " (oculta)" : ""}</button>`).join("")}</div>

      <h4>Atributos base</h4>
      ${p.stats.map((s) => `<div class="barra"><span>${STATS[s.stat.name] || esc(s.stat.name)}</span><strong>${s.base_stat}</strong>
        <div class="trilho"><div class="preench" style="width:${Math.min(100, (s.base_stat / 200) * 100)}%;--cor:${cor}"></div></div></div>`).join("")}
      <p class="nota">Total: ${p.stats.reduce((s, x) => s + x.base_stat, 0)}</p>

      <h4>Fraquezas e resistências</h4>
      ${grupo((v) => v > 1, "Fraco contra")}${grupo((v) => v < 1 && v > 0, "Resiste a")}${grupo((v) => v === 0, "Imune a")}

      <h4>Treino e criação</h4>
      <p>Taxa de captura: ${esp.capture_rate} · Felicidade base: ${esp.base_happiness} · EXP base: ${p.base_experience ?? "–"} · Crescimento: ${esc(bonito(esp.growth_rate.name))}<br>
      Grupos de ovos: ${esc(esp.egg_groups.map((g) => bonito(g.name)).join(", ") || "–")} · Ciclos de ovo: ${esp.hatch_counter} · ${genderTxt}${esp.is_legendary ? " · Lendário" : ""}${esp.is_mythical ? " · Místico" : ""}</p>

      <h4>Linha evolutiva</h4>
      <div class="tipos">${evo.map((x) => `<button type="button" class="chip mini-btn" data-det="${x.id}">${esc(bonito(x.nome))}</button>`).join("") || "–"}</div>

      <h4>Golpes por versão do jogo</h4>
      ${herdado ? '<p class="nota">A PokéAPI ainda não tem os golpes desta forma; mostrando os da forma base.</p>' : ""}
      <div id="golpes-box">${vgs.length ? "" : "<p>Sem dados de golpes.</p>"}</div>

      <h4>Onde encontrar</h4>
      <button type="button" class="chip mini-btn" data-enc="${p.id}">Ver locais de encontro</button>
      <div id="enc-box"></div>

      <div class="linha"><button type="button" class="chip destaque" data-add="${id}">+ Adicionar à equipe</button><button type="button" class="chip" data-fechar="1">Fechar</button></div>
    </div>`;
  if (vgs.length) desenharGolpes();
}

/* --- Golpe (ficha competitiva) --- */
function leituraCompetitiva(m) {
  const L = [], meta = m.meta || {}, cls = m.damage_class.name, tipo = (TIPOS[m.type.name] || {}).pt || bonito(m.type.name);
  if (cls === "status") L.push("Golpe de status: não causa dano direto; seu valor está no efeito (controle de campo, status, buffs/debuffs, cura).");
  else {
    L.push(cls === "physical" ? "Físico: usa o Ataque do usuário contra a Defesa do alvo." : "Especial: usa o Atq. Esp. do usuário contra a Def. Esp. do alvo.");
    L.push(`STAB: causa +50% de dano se o usuário for do tipo ${tipo}.`);
  }
  if (m.priority > 0) L.push(`Prioridade +${m.priority}: age antes de golpes de prioridade menor, mesmo contra Pokémon mais rápidos (útil para finalizar e frear ameaças rápidas).`);
  if (m.priority < 0) L.push(`Prioridade ${m.priority}: age depois dos golpes normais, mesmo se o usuário for mais rápido.`);
  if (meta.crit_rate > 0) L.push(`Taxa de crítico elevada (+${meta.crit_rate}).`);
  if (meta.drain > 0) L.push(`Drena: recupera ${meta.drain}% do dano causado.`);
  if (meta.drain < 0) L.push(`Recuo: o usuário sofre ${-meta.drain}% do dano causado.`);
  if (meta.healing > 0) L.push(`Cura ${meta.healing}% dos PS máximos.`);
  if (meta.max_hits > 1) L.push(`Acerta de ${meta.min_hits || 1} a ${meta.max_hits} vezes por uso (bom contra Substitute/Focus Sash; cada acerto conta para efeitos).`);
  if (meta.max_turns > 1) L.push(`Dura de ${meta.min_turns || 1} a ${meta.max_turns} turnos.`);
  if (meta.ailment && meta.ailment.name !== "none") L.push(`Pode causar ${AILMENT[meta.ailment.name] || bonito(meta.ailment.name)}${meta.ailment_chance > 0 ? ` (${meta.ailment_chance}% de chance)` : " (se acertar)"}.`);
  if (meta.flinch_chance > 0) L.push(`${meta.flinch_chance}% de chance de fazer o alvo hesitar (só funciona se o usuário agir primeiro).`);
  if (m.stat_changes && m.stat_changes.length) L.push("Altera atributos: " + m.stat_changes.map((s) => `${STATS[s.stat.name] || s.stat.name} ${s.change > 0 ? "+" : ""}${s.change}`).join(", ") + (meta.stat_chance > 0 ? ` (${meta.stat_chance}% de chance)` : "") + ".");
  if (m.accuracy === null) L.push("Sem teste de precisão (não erra por precisão).");
  else if (m.accuracy < 100) L.push(`Precisão ${m.accuracy}%: arrisca errar; considere itens/habilidades que aumentem a precisão.`);
  if (m.power && ["all-other-pokemon", "all-opponents"].includes(m.target.name)) L.push("Golpe em área: em batalhas duplas o dano cai para 75% quando atinge mais de um alvo.");
  L.push(`PP ${m.pp ?? "–"}${m.pp ? ` (até ${Math.floor(m.pp * 1.6)} com PP Max)` : ""}.`);
  return L;
}

async function detGolpe(ref) {
  const m = await api("move/" + ref), dlg = $("detalhe");
  const t = TIPOS[m.type.name] || { pt: bonito(m.type.name), cor: "#9ca3af" };
  const ef = en(m.effect_entries) || {};
  const fixa = (s) => String(s || "").replace(/\$effect_chance/g, m.effect_chance ?? "?");
  const fl = ultimoEn(m.flavor_text_entries);
  const antigos = (m.past_values || []).map((v) => {
    const c = [v.power != null && "poder " + v.power, v.accuracy != null && "precisão " + v.accuracy, v.pp != null && "PP " + v.pp, v.type && "tipo " + (TIPOS[v.type.name] || {}).pt].filter(Boolean);
    return c.length ? `<li>Até ${esc(bonito(v.version_group.name))}: ${c.join(", ")}</li>` : "";
  }).join("");
  dlg.innerHTML = `
    <div class="det-topo" style="--cor:${t.cor}"><h2>${esc(bonito(m.name))}</h2><div class="tipos">${chipTipo(m.type.name)}<span class="tipo" style="--c:#374151">${DANO[m.damage_class.name] || esc(m.damage_class.name)}</span></div></div>
    <div class="det-corpo">${navBar()}
      <div class="ficha">
        <div><small>Poder</small><b>${m.power ?? "—"}</b></div><div><small>Precisão</small><b>${m.accuracy ?? "—"}</b></div>
        <div><small>PP</small><b>${m.pp ?? "—"}</b></div><div><small>Prioridade</small><b>${m.priority > 0 ? "+" : ""}${m.priority}</b></div>
        <div><small>Alvo</small><b>${esc(ALVO[m.target.name] || bonito(m.target.name))}</b></div><div><small>Introduzido</small><b>${geracao(m.generation)}</b></div>
      </div>
      <h4>Leitura competitiva</h4><ul>${leituraCompetitiva(m).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h4>Efeito (texto oficial, em inglês)</h4>
      <p>${esc(fixa(ef.short_effect)) || "–"}${traduzir(fixa(ef.short_effect))}</p>
      ${ef.effect && ef.effect !== ef.short_effect ? `<p class="nota">${esc(fixa(ef.effect))}</p>` : ""}
      ${fl ? `<p class="nota"><i>${esc(fl.flavor_text.replace(/[\n\f]+/g, " "))}</i></p>` : ""}
      ${antigos ? `<h4>Valores antigos (mudanças entre gerações)</h4><ul>${antigos}</ul>` : ""}
      <h4>Quem aprende (${m.learned_by_pokemon.length})</h4>
      <div class="tipos">${chipsPoke(m.learned_by_pokemon, 14)}${m.learned_by_pokemon.length > 14 ? " …" : ""}</div>
      ${fechaBtn}
    </div>`;
}

/* --- Item --- */
async function detItem(ref) {
  const it = await api("item/" + ref), dlg = $("detalhe");
  const nome = en(it.names, "name") || bonito(it.name);
  const ef = en(it.effect_entries) || {};
  const fl = ultimoEn(it.flavor_text_entries);
  const preco = [...(it.prices || [])].reverse().find((p) => p.purchase_price != null || p.sell_price != null);
  let maquina = "";
  if (it.machines && it.machines.length) {
    try { const mq = await api("machine/" + idDaUrl(it.machines[it.machines.length - 1].machine.url)); maquina = `<h4>Ensina o golpe</h4><div class="tipos"><button type="button" class="chip mini-btn" data-golpe="${esc(mq.move.name)}">${esc(bonito(mq.move.name))}</button></div><p class="nota">Versão: ${esc(bonito(mq.version_group.name))}</p>`; } catch {}
  }
  dlg.innerHTML = `
    <div class="det-topo" style="--cor:#7c3aed"><img src="${esc(it.sprites.default || ITEMIMG(it.name))}" alt="" style="width:96px;height:96px;image-rendering:pixelated" onerror="this.style.visibility='hidden'"><h2>${esc(nome)}</h2><div class="tipos"><span class="tipo" style="--c:#374151">${esc(bonito(it.category.name))}</span></div></div>
    <div class="det-corpo">${navBar()}
      <h4>Efeito (texto oficial, em inglês)</h4>
      <p>${esc(ef.short_effect) || "–"}${traduzir(ef.short_effect)}</p>
      ${ef.effect && ef.effect !== ef.short_effect ? `<p class="nota">${esc(ef.effect)}</p>` : ""}
      ${fl ? `<h4>Descrição no jogo</h4><p><i>${esc(fl.text.replace(/[\n\f]+/g, " "))}</i>${traduzir(fl.text)}</p>` : ""}
      <h4>Como funciona (atributos)</h4>
      <div class="tipos">${it.attributes.map((a) => `<span class="tipo" style="--c:#2563eb">${esc(ATRIB[a.name] || bonito(a.name))}</span>`).join("") || "–"}</div>
      <div class="ficha">
        <div><small>Compra</small><b>${preco && preco.purchase_price != null ? preco.purchase_price : "—"}</b></div>
        <div><small>Venda</small><b>${preco && preco.sell_price != null ? preco.sell_price : "—"}</b></div>
        <div><small>Poder de arremesso</small><b>${it.fling_power ?? "—"}</b></div>
        <div><small>Efeito de arremesso</small><b>${it.fling_effect ? esc(bonito(it.fling_effect.name)) : "—"}</b></div>
      </div>
      ${maquina}
      ${it.held_by_pokemon.length ? `<h4>Pokémon que podem carregar (${it.held_by_pokemon.length})</h4><div class="tipos">${chipsPoke(it.held_by_pokemon.map((h) => h.pokemon), 14)}</div>` : ""}
      ${it.baby_trigger_for ? `<p class="nota">Necessário para o nascimento de bebês da cadeia de evolução nº ${idDaUrl(it.baby_trigger_for.url)}.</p>` : ""}
      ${fechaBtn}
    </div>`;
}

/* --- Habilidade --- */
async function detHab(ref) {
  const a = await api("ability/" + ref), dlg = $("detalhe");
  const ef = en(a.effect_entries) || {};
  const fl = ultimoEn(a.flavor_text_entries);
  const mud = (a.effect_changes || []).map((c) => { const e = en(c.effect_entries); return e ? `<li>Até ${esc(bonito(c.version_group.name))}: ${esc(e.effect)}</li>` : ""; }).join("");
  dlg.innerHTML = `
    <div class="det-topo" style="--cor:#7c3aed"><h2>${esc(en(a.names, "name") || bonito(a.name))}</h2><div class="tipos"><span class="tipo" style="--c:#374151">${geracao(a.generation)}</span></div></div>
    <div class="det-corpo">${navBar()}
      <h4>Efeito (texto oficial, em inglês)</h4>
      <p>${esc(ef.short_effect) || "–"}${traduzir(ef.short_effect)}</p>
      ${ef.effect && ef.effect !== ef.short_effect ? `<p class="nota">${esc(ef.effect)}</p>` : ""}
      ${fl ? `<h4>Descrição no jogo</h4><p><i>${esc(fl.flavor_text.replace(/[\n\f]+/g, " "))}</i></p>` : ""}
      ${mud ? `<h4>Como era em versões anteriores</h4><ul>${mud}</ul>` : ""}
      <h4>Pokémon com esta habilidade (${a.pokemon.length})</h4>
      <div class="tipos">${chipsPoke(a.pokemon.map((x) => x.pokemon), 18)}${a.pokemon.length > 18 ? " …" : ""}</div>
      ${fechaBtn}
    </div>`;
}

/* --- Eventos da janela --- */
$("detalhe").addEventListener("click", async (e) => {
  const dlg = $("detalhe");
  if (e.target === dlg || e.target.closest("[data-fechar]")) return dlg.close();
  const v = e.target.closest("[data-voltar]");
  if (v) { nav.pop(); const [t, r] = nav[nav.length - 1]; return abrir(t, r, false); }
  const d = e.target.closest("[data-det]"); if (d) return abrir("poke", Number(d.dataset.det));
  const g = e.target.closest("[data-golpe]"); if (g) return abrir("golpe", g.dataset.golpe);
  const h = e.target.closest("[data-hab]"); if (h) return abrir("hab", h.dataset.hab);
  const m = e.target.closest("[data-metodo]"); if (m && golpesEst) { golpesEst.metodo = m.dataset.metodo; return desenharGolpes(); }
  const a = e.target.closest("[data-add]"); if (a) return addPorId(Number(a.dataset.add), a);
  const en2 = e.target.closest("[data-enc]");
  if (en2) {
    const box = $("enc-box"); box.innerHTML = "Consultando…";
    try {
      const r = await api("pokemon/" + en2.dataset.enc + "/encounters");
      box.innerHTML = r.length
        ? `<ul>${r.slice(0, 40).map((x) => `<li>${esc(bonito(x.location_area.name))} <small>(${esc([...new Set(x.version_details.map((vd) => bonito(vd.version.name)))].join(", "))})</small></li>`).join("")}</ul>${r.length > 40 ? `<p class="nota">+ ${r.length - 40} locais.</p>` : ""}`
        : '<p class="nota">Sem locais de encontro registrados (obtido por evolução, evento ou outra forma).</p>';
    } catch (err) { box.innerHTML = `<p class="erro">${esc(err.message)}</p>`; }
  }
});
$("detalhe").addEventListener("change", (e) => { if (e.target.id === "sel-vg" && golpesEst) { golpesEst.vg = e.target.value; desenharGolpes(); } });
$("detalhe").addEventListener("close", () => { nav.length = 0; });

/* ---------- Grade: eventos ---------- */
$("grade").addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]"); if (fav) return alternarFavorito(Number(fav.dataset.fav));
  const add = e.target.closest("[data-add]"); if (add) return addPorId(Number(add.dataset.add));
  const c = e.target.closest(".cartao"); if (c) abrir("poke", Number(c.dataset.id));
});
$("grade").addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.classList.contains("cartao")) abrir("poke", Number(e.target.dataset.id)); });
$("busca").addEventListener("input", () => { pagina = 1; desenharGrade(); });
$("filtro-forma").addEventListener("change", () => { pagina = 1; desenharGrade(); });
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
  document.querySelectorAll('[id^="aba-"]').forEach((s) => { s.hidden = s.id !== "aba-" + b.dataset.aba; });
}));

/* ---------- Explorador da API (todos os endpoints da especificação) ---------- */
// [endpoint, rótulo, "in" = número ou nome | "i" = só número | "n" = sem parâmetro]
const CATALOGO = [
  ["meta", "Metadados da API", "n"],
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
  ["item-pocket", "Item: bolso", "in"], ["berry", "Fruta (berry)", "in"],
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
  const tipo = CATALOGO[Number($("ex-endpoint").value)][2], p = $("ex-param");
  p.disabled = tipo === "n";
  p.placeholder = tipo === "n" ? "(sem parâmetro)" : tipo === "i" ? "número (ex.: 1) — vazio = lista" : "número ou nome (ex.: pikachu) — vazio = lista";
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
$("ex-resultado").addEventListener("toggle", (e) => {
  const d = e.target;
  if (d.open && d.dataset.i !== undefined && !d.dataset.feito) { d.dataset.feito = "1"; d.insertAdjacentHTML("beforeend", noJson(pilha[Number(d.dataset.i)])); }
}, true);
$("ex-resultado").addEventListener("click", (e) => { const a = e.target.closest("[data-api]"); if (a) { e.preventDefault(); executar(a.dataset.api); } });

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
        d.results.map((r) => `<a href="#" class="chip mini-btn" data-api="${esc(base + "/" + (r.name || idDaUrl(r.url)))}">${esc(r.name || "nº " + idDaUrl(r.url))}</a>`).join("") + "</div>";
    } else { box.innerHTML = noJson(d); }
  } catch (e) { box.innerHTML = `<p class="erro">${esc(e.message)}</p>`; }
}
$("ex-ir").addEventListener("click", () => {
  const [ep, , tipo] = CATALOGO[Number($("ex-endpoint").value)];
  const [base, suf] = ep.split("/");
  const param = $("ex-param").value.trim().toLowerCase();
  if (tipo === "n") return executar(base);
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
  usuario = null; cacheApi.clear(); ordemVgP = null; $("detalhe").close();
  mostrarLogin();
});

/* ---------- Login com Google ---------- */
async function aoReceberCredencial({ credential }) {
  $("erro").hidden = true;
  try {
    const r = await fetch("/api/auth/google", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_token: credential }) });
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
    if (me.ok) { await mostrarApp((await me.json()).usuario); }
    else {
      const { clientId } = await (await fetch("/api/config")).json();
      mostrarLogin();
      const id = (clientId || "").trim();
      if (!id) mostrarErro("GOOGLE_CLIENT_ID não configurado na Vercel."); else iniciarGoogle(id);
    }
  } catch { mostrarLogin(); mostrarErro("Não foi possível carregar a aplicação."); }
  finally { $("carregando").hidden = true; }
})();
