const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const GH = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/";
const IMG = (id) => `${GH}pokemon/other/official-artwork/${id}.png`;
const SPRITE = (id) => `${GH}pokemon/${id}.png`;
const ITEMIMG = (n) => `${GH}items/${n}.png`;
const PALETA = ["#22c55e", "#f97316", "#3b82f6", "#eab308", "#ec4899", "#7c3aed", "#14b8a6", "#ef4444"];
// Cores extraídas dos símbolos de tipo (arquivos em /tipos/)
const TIPOS = {
  normal: { pt: "Normal", cor: "#919aa2" }, fire: { pt: "Fogo", cor: "#ff9d55" }, water: { pt: "Água", cor: "#5090d6" },
  electric: { pt: "Elétrico", cor: "#f4d23c" }, grass: { pt: "Planta", cor: "#63bc5a" }, ice: { pt: "Gelo", cor: "#73cec0" },
  fighting: { pt: "Lutador", cor: "#ce416b" }, poison: { pt: "Veneno", cor: "#b567ce" }, ground: { pt: "Terrestre", cor: "#e18c62" },
  flying: { pt: "Voador", cor: "#89aae3" }, psychic: { pt: "Psíquico", cor: "#fa7179" }, bug: { pt: "Inseto", cor: "#91c12f" },
  rock: { pt: "Pedra", cor: "#c5b78c" }, ghost: { pt: "Fantasma", cor: "#5269ad" }, dragon: { pt: "Dragão", cor: "#0b6dc3" },
  dark: { pt: "Sombrio", cor: "#5a5465" }, steel: { pt: "Aço", cor: "#5a8ea2" }, fairy: { pt: "Fada", cor: "#ec8fe6" },
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
const ATRIB_DESC = {
  countable: "Pode ter várias unidades na mochila.", consumable: "É consumido ao ser usado.",
  "usable-overworld": "Pode ser usado fora da batalha.", "usable-in-battle": "Pode ser usado durante a batalha (gasta o turno).",
  holdable: "Pode ser segurado por um Pokémon.", "holdable-passive": "Quando segurado, o efeito é passivo (sempre ativo).",
  "holdable-active": "Quando segurado, o efeito é ativado durante a batalha, em uma condição.", underground: "Pode ser encontrado escavando no subsolo (Sinnoh).",
};
// Definição geral por categoria de item (usada quando a PokéAPI não traz efeito oficial)
const DEF_CAT = {
  "stat-boosts": "Itens de batalha que elevam temporariamente um atributo; o efeito some quando o Pokémon sai de campo.",
  "effort-drop": "Frutas que reduzem os EVs de um atributo e aumentam a felicidade do Pokémon.",
  "medicine": "Itens de cura: restauram PS/PP, curam condições de status ou revivem Pokémon.",
  "other": "Item utilitário diverso, sem categoria específica.",
  "in-a-pinch": "Fruta que ativa sozinha quando os PS ficam baixos, dando um bônus de atributo, crítico ou efeito semelhante.",
  "picky-healing": "Fruta que cura parte dos PS quando estão baixos, mas pode causar confusão se a natureza do Pokémon não gostar do sabor.",
  "type-protection": "Fruta que, uma vez, reduz pela metade o dano de um golpe super eficaz de um tipo específico.",
  "baking-only": "Ingrediente usado apenas para preparar Poffins/Pokéblocks; não tem uso em batalha.",
  "collectibles": "Item colecionável ou de venda: rende dinheiro ao ser vendido.",
  "evolution": "Item usado para evoluir Pokémon compatíveis (Pedras, Link Cable etc.).",
  "spelunking": "Item de exploração (como repelentes e Escape Rope) que facilita percorrer áreas.",
  "held-items": "Item segurável com efeito passivo ou ativo durante a batalha.",
  "choice": "Item Choice: aumenta um atributo em 50%, mas trava o Pokémon no primeiro golpe usado até ele sair de campo.",
  "effort-training": "Item de treino de EVs (Power items): concede EVs extras ao derrotar Pokémon e reduz a Velocidade em batalha.",
  "bad-held-items": "Item segurável com efeito negativo ou arriscado, usado em estratégias específicas.",
  "training": "Item ligado a treino e ganho de experiência.",
  "plates": "Placa: aumenta o dano de golpes de um tipo e muda o tipo de Arceus (Multitype).",
  "species-specific": "Item com efeito exclusivo de uma ou poucas espécies (ex.: Light Ball do Pikachu).",
  "type-enhancement": "Item segurável que aumenta o poder de golpes de um tipo (geralmente +20%).",
  "event-items": "Item obtido por eventos ou distribuições especiais.",
  "gameplay": "Item ligado a recursos do jogo, não à batalha.",
  "plot-advancement": "Item-chave de história: necessário para progredir; não pode ser vendido nem descartado.",
  "unused": "Item sem uso nos jogos (restos de dados).",
  "loot": "Item de saque ou tesouro: serve para vender.",
  "all-mail": "Carta (Mail): pode ser segurada e escrita; sem efeito em batalha.",
  "vitamins": "Vitamina: concede EVs diretamente, respeitando os limites por atributo.",
  "healing": "Restaura PS (Potion e variações).",
  "pp-recovery": "Restaura PP de golpes ou aumenta o PP máximo (PP Up/PP Max).",
  "revival": "Traz de volta Pokémon derrotados (Revive e variações).",
  "status-cures": "Cura condições de status (veneno, paralisia, sono, queimadura, confusão…).",
  "mulch": "Composto para cultivo de frutas, altera o crescimento das plantas.",
  "standard-balls": "Poké Bola padrão para capturar Pokémon selvagens.",
  "special-balls": "Poké Bola especial: tem bônus de captura em condições específicas.",
  "apricorn-balls": "Poké Bola feita de Apricorns, com bônus em situações específicas.",
  "all-machines": "TM/TR/HM: ensina um golpe a um Pokémon compatível (veja o golpe na ficha).",
  "flutes": "Flauta: usada para curar condições, atrair Pokémon ou eventos específicos.",
  "jewels": "Gema: aumenta o poder de um golpe do tipo correspondente uma única vez.",
  "mega-stones": "Mega Stone: segurada pelo Pokémon compatível, permite a Mega Evolução (uma vez por batalha).",
  "memories": "Memory Disc: muda o tipo de Silvally (RKS System).",
  "z-crystals": "Z-Crystal: permite usar um Golpe Z uma vez por batalha (Gen 7).",
  "nature-mints": "Mint: altera a natureza efetiva do Pokémon (quais atributos crescem e caem).",
  "tera-shard": "Tera Shard: usado para mudar o Tera Type de um Pokémon (Scarlet/Violet).",
  "scarves": "Lenço de concurso (Gen 3/4).",
};
const METODO = { "level-up": "Por nível", egg: "Ovo", tutor: "Tutor", machine: "TM / TR / HM", "form-change": "Mudança de forma" };
const PT_COR = { black: "Preto", blue: "Azul", brown: "Marrom", gray: "Cinza", green: "Verde", pink: "Rosa", purple: "Roxo", red: "Vermelho", white: "Branco", yellow: "Amarelo" };
const PT_HAB = { cave: "Caverna", forest: "Floresta", grassland: "Campo", mountain: "Montanha", rare: "Raro", "rough-terrain": "Terreno acidentado", sea: "Mar", urban: "Urbano", "waters-edge": "Beira d'água" };

/* ---------- Z-Crystals (35) — dados locais, independentes da PokéAPI ---------- */
const Z_TIPO = [
  ["normalium-z", "Normalium Z", "normal", "Breakneck Blitz"], ["fightinium-z", "Fightinium Z", "fighting", "All-Out Pummeling"],
  ["flyinium-z", "Flyinium Z", "flying", "Supersonic Skystrike"], ["poisonium-z", "Poisonium Z", "poison", "Acid Downpour"],
  ["groundium-z", "Groundium Z", "ground", "Tectonic Rage"], ["rockium-z", "Rockium Z", "rock", "Continental Crush"],
  ["buginium-z", "Buginium Z", "bug", "Savage Spin-Out"], ["ghostium-z", "Ghostium Z", "ghost", "Never-Ending Nightmare"],
  ["steelium-z", "Steelium Z", "steel", "Corkscrew Crash"], ["firium-z", "Firium Z", "fire", "Inferno Overdrive"],
  ["waterium-z", "Waterium Z", "water", "Hydro Vortex"], ["grassium-z", "Grassium Z", "grass", "Bloom Doom"],
  ["electrium-z", "Electrium Z", "electric", "Gigavolt Havoc"], ["psychium-z", "Psychium Z", "psychic", "Shattered Psyche"],
  ["icium-z", "Icium Z", "ice", "Subzero Slammer"], ["dragonium-z", "Dragonium Z", "dragon", "Devastating Drake"],
  ["darkinium-z", "Darkinium Z", "dark", "Black Hole Eclipse"], ["fairium-z", "Fairium Z", "fairy", "Twinkle Tackle"],
];
// [id, nome, tipo do Golpe Z, Golpe Z, Pokémon, golpe base, só USUM?]
const Z_ESP = [
  ["aloraichium-z", "Aloraichium Z", "electric", "Stoked Sparksurfer", "Raichu de Alola", "Thunderbolt", 0],
  ["decidium-z", "Decidium Z", "ghost", "Sinister Arrow Raid", "Decidueye", "Spirit Shackle", 0],
  ["eevium-z", "Eevium Z", "normal", "Extreme Evoboost", "Eevee", "Last Resort", 0],
  ["incinium-z", "Incinium Z", "dark", "Malicious Moonsault", "Incineroar", "Darkest Lariat", 0],
  ["kommonium-z", "Kommonium Z", "dragon", "Clangorous Soulblaze", "Kommo-o", "Clanging Scales", 1],
  ["lunalium-z", "Lunalium Z", "ghost", "Menacing Moonraze Maelstrom", "Lunala ou Necrozma Dawn Wings", "Moongeist Beam", 1],
  ["lycanium-z", "Lycanium Z", "rock", "Splintered Stormshards", "Lycanroc", "Stone Edge", 1],
  ["marshadium-z", "Marshadium Z", "ghost", "Soul-Stealing 7-Star Strike", "Marshadow", "Spectral Thief", 0],
  ["mewnium-z", "Mewnium Z", "psychic", "Genesis Supernova", "Mew", "Psychic", 0],
  ["mimikium-z", "Mimikium Z", "fairy", "Let's Snuggle Forever", "Mimikyu", "Play Rough", 1],
  ["pikanium-z", "Pikanium Z", "electric", "Catastropika", "Pikachu", "Volt Tackle", 0],
  ["pikashunium-z", "Pikashunium Z", "electric", "10,000,000 Volt Thunderbolt", "Pikachu com boné", "Thunderbolt", 1],
  ["primarium-z", "Primarium Z", "water", "Oceanic Operetta", "Primarina", "Sparkling Aria", 0],
  ["snorlium-z", "Snorlium Z", "normal", "Pulverizing Pancake", "Snorlax", "Giga Impact", 0],
  ["solganium-z", "Solganium Z", "steel", "Searing Sunraze Smash", "Solgaleo ou Necrozma Dusk Mane", "Sunsteel Strike", 1],
  ["tapunium-z", "Tapunium Z", "fairy", "Guardian of Alola", "Tapu Koko, Tapu Lele, Tapu Bulu ou Tapu Fini", "Nature's Madness", 0],
  ["ultranecrozium-z", "Ultranecrozium Z", "psychic", "Light That Burns the Sky", "Ultra Necrozma (após Ultra Burst)", "Photon Geyser", 1],
];
const ZMAP = {};
Z_TIPO.forEach(([id, nome, tipo, z]) => { ZMAP[id] = { nome, tipo, z }; });
Z_ESP.forEach(([id, nome, tipo, z, poke, base, usum]) => { ZMAP[id] = { nome, tipo, z, esp: { poke, base }, usum: !!usum }; });
const ZNOMES = Object.keys(ZMAP);

/* ---------- Utilidades ---------- */
const bonito = (n) => String(n).split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const lumin = (h) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; };
const chipTipo = (t) => {
  const x = TIPOS[t] || { pt: bonito(t), cor: "#9ca3af" };
  const icone = TIPOS[t] ? `<img src="/tipos/${t}.png" alt="" width="18" height="18">` : "";
  return `<span class="tipo" style="--c:${x.cor};color:${lumin(x.cor) > 0.68 ? "#1e1b4b" : "#fff"}">${icone}${x.pt}</span>`;
};
const POR_PAGINA = 24, MAX_EQUIPE = 6, MAX_EQUIPES = 30;
let usuario = null, lista = [], porId = new Map(), favoritos = new Set(), equipes = [];
let rascunho = { id: null, nome: "", membros: [] }, pagina = 1, timerAviso;
let tiposPor = new Map(), golpesTipo = new Map(), tiposProntos = false, formasDe = new Map();
const tiposSel = new Set();
let filtrosEsp = { geracao: null, cor: null, habitat: null, ovo: null, formato: null };

function ler(chave, padrao) { try { const v = JSON.parse(localStorage.getItem(chave)); return v == null ? padrao : v; } catch { return padrao; } }
function gravar(chave, v) { try { localStorage.setItem(chave, JSON.stringify(v)); } catch {} }
const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const idDaUrl = (u) => Number((String(u).match(/\/(\d+)\/?$/) || [])[1]);
const en = (arr, campo) => { const x = (arr || []).find((e) => e.language && e.language.name === "en"); return x ? (campo ? x[campo] : x) : null; };
const ultimoEn = (arr) => [...(arr || [])].reverse().find((e) => e.language && e.language.name === "en") || null;
const traduzir = (t) => t ? ` <a href="https://translate.google.com/?sl=en&tl=pt&op=translate&text=${encodeURIComponent(t)}" target="_blank" rel="noopener">Traduzir ↗</a>` : "";
const geracao = (g) => g ? "Geração " + String(g.name).split("-")[1].toUpperCase() : "–";
window.imgErro = function (el, id) { if (!el.dataset.t) { el.dataset.t = "1"; el.src = SPRITE(id); } else { el.outerHTML = '<div class="sem-img">❓</div>'; } };

function aviso(msg) {
  $("eq-msg").textContent = msg;
  const t = $("toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(timerAviso); timerAviso = setTimeout(() => { t.hidden = true; }, 2800);
}
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
const BOLAS = { poke: { topo: "#ef4444" }, great: { topo: "#2563eb" }, ultra: { topo: "#1f2937" }, master: { topo: "#7c3aed" }, premier: { topo: "#f3f4f6" } };
function bolaSvg(t) {
  const b = BOLAS[t], T = "#1e1b4b";
  let marca = "";
  if (t === "great") marca = `<path d="M16 32Q26 18 40 15M84 32Q74 18 60 15" stroke="#ef4444" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if (t === "ultra") marca = `<path d="M26 34V20M40 27V14M74 34V20M60 27V14" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>`;
  if (t === "master") marca = `<circle cx="27" cy="30" r="8" fill="#ec4899"/><circle cx="73" cy="30" r="8" fill="#ec4899"/>`;
  if (t === "premier") marca = `<path d="M12 36Q50 10 88 36" stroke="#ef4444" stroke-width="6" fill="none"/>`;
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
function especieDe(nome, nomesEsp) {
  for (const s of nomesEsp) if (nome === s || nome.startsWith(s + "-")) return s;
  return nome;
}

function montarBarra(idEl, aoClicar) {
  $(idEl).innerHTML = Object.entries(TIPOS).map(([k, t]) =>
    `<button type="button" class="tbtn" data-t="${k}" title="${t.pt}" aria-label="${t.pt}" aria-pressed="false"><img src="/tipos/${k}.png" alt="" width="46" height="46"></button>`).join("");
  $(idEl).addEventListener("click", (e) => { const b = e.target.closest("[data-t]"); if (b) aoClicar(b.dataset.t); });
}
function marcarBarra(idEl, set) { $(idEl).querySelectorAll("[data-t]").forEach((b) => b.setAttribute("aria-pressed", String(set.has(b.dataset.t)))); }

function preencherSelect(id, ep, rotulo) {
  return api(ep, { limit: 100 }).then((d) => {
    $(id).innerHTML += d.results.map((r) => `<option value="${esc(r.name)}">${esc(rotulo(r.name))}</option>`).join("");
  }).catch(() => {});
}
const romano = (n) => "Geração " + String(n).split("-")[1].toUpperCase();

async function carregarTipos() {
  const res = await Promise.all(Object.keys(TIPOS).map((t) => api("type/" + t).then((d) => [t, d]).catch(() => [t, null])));
  const tmp = new Map();
  for (const [t, d] of res) {
    if (!d) continue;
    golpesTipo.set(t, new Set(d.moves.map((x) => idDaUrl(x.url))));
    d.pokemon.forEach((x) => { const id = idDaUrl(x.pokemon.url); if (!tmp.has(id)) tmp.set(id, []); tmp.get(id).push([x.slot, t]); });
  }
  tmp.forEach((a, id) => tiposPor.set(id, a.sort((x, y) => x[0] - y[0]).map((x) => x[1])));
  tiposProntos = true;
  desenharGrade(); desenharEditor();
}

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
    const [d, esp] = await Promise.all([api("pokemon", { limit: 3000 }), api("pokemon-species", { limit: 3000 })]);
    const nomesEsp = esp.results.map((r) => r.name).sort((a, b) => b.length - a.length);
    lista = d.results.map((r) => ({ id: idDaUrl(r.url), nome: r.name })).filter((p) => p.id)
      .map((p) => Object.assign(p, { classe: classeForma(p.nome, p.id), especie: especieDe(p.nome, nomesEsp) })).sort((a, b) => a.id - b.id);
    porId = new Map(lista.map((p) => [p.id, p]));
    formasDe = new Map(); lista.forEach((p) => formasDe.set(p.especie, (formasDe.get(p.especie) || 0) + 1));
  } catch (e) { $("grade").innerHTML = `<p class="vazio erro">${esc(e.message)}</p>`; return; }
  atualizarResumo(); desenharGrade();
  carregarTipos();
  preencherSelect("filtro-geracao", "generation", romano);
  preencherSelect("filtro-cor", "pokemon-color", (n) => PT_COR[n] || bonito(n));
  preencherSelect("filtro-habitat", "pokemon-habitat", (n) => PT_HAB[n] || bonito(n));
  preencherSelect("filtro-ovo", "egg-group", bonito);
  preencherSelect("filtro-formato", "pokemon-shape", bonito);
  preencherSelect("filtro-geracao-g", "generation", romano);
  api("item", { limit: 3000 }).then((d) => {
    const itens = d.results.map((r) => ({ id: idDaUrl(r.url), nome: r.name }));
    const ja = new Set(itens.map((i) => i.nome));
    ZNOMES.forEach((n, k) => { if (!ja.has(n)) itens.push({ id: 900000 + k, nome: n, local: true }); });
    catItens.itens = itens; catItens.desenhar(); atualizarResumo();
  }).catch(() => {});
  api("item-category", { limit: 200 }).then((dd) => { $("filtro-cat-item").innerHTML = '<option value="">Todas as categorias</option>' + dd.results.map((r) => `<option value="${esc(r.name)}">${esc(bonito(r.name))}</option>`).join(""); }).catch(() => {});
  api("item-attribute", { limit: 50 }).then((dd) => { $("filtro-atrib-item").innerHTML = '<option value="">Todos os atributos</option>' + dd.results.map((r) => `<option value="${esc(r.name)}">${esc(ATRIB[r.name] || bonito(r.name))}</option>`).join(""); }).catch(() => {});
  api("move", { limit: 3000 }).then((dd) => { catGolpes.itens = dd.results.map((r) => ({ id: idDaUrl(r.url), nome: r.name })); catGolpes.desenhar(); }).catch(() => {});
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
  const sets = Object.values(filtrosEsp).filter(Boolean);
  const ordem = $("filtro-ordem").value;
  const r = lista.filter((p) =>
    (forma === "todas" || p.classe === forma) &&
    (!termo || p.nome.includes(termo) || String(p.id) === termo) &&
    (!soFav || favoritos.has(p.id)) &&
    (!tiposSel.size || [...tiposSel].every((t) => (tiposPor.get(p.id) || []).includes(t))) &&
    sets.every((s) => s.has(p.especie)));
  if (ordem === "num-desc") r.sort((a, b) => b.id - a.id);
  else if (ordem === "nome") r.sort((a, b) => a.nome.localeCompare(b.nome));
  else if (ordem === "nome-desc") r.sort((a, b) => b.nome.localeCompare(a.nome));
  return r;
}
const iconesTipo = (id) => (tiposPor.get(id) || []).filter((t) => TIPOS[t]).map((t) => `<img src="/tipos/${t}.png" alt="${TIPOS[t].pt}" title="${TIPOS[t].pt}">`).join("");
const cartao = (p) => `
  <article class="cartao" tabindex="0" data-id="${p.id}" style="--cor:${PALETA[p.id % PALETA.length]}">
    <span class="num">#${String(p.id).padStart(3, "0")}</span>
    <button type="button" class="fav ${favoritos.has(p.id) ? "ativo" : ""}" data-fav="${p.id}"
      aria-label="Favoritar ${esc(bonito(p.nome))}" aria-pressed="${favoritos.has(p.id)}">★</button>
    <img src="${IMG(p.id)}" alt="${esc(bonito(p.nome))}" loading="lazy" onerror="imgErro(this,${p.id})">
    <h3>${esc(bonito(p.nome))}</h3>
    <div class="tipos-card">${iconesTipo(p.id)}</div>
    <button type="button" class="chip mini-btn" data-add="${p.id}">+ Equipe</button>
    ${p.classe === "base" && formasDe.get(p.especie) > 1 ? `<span class="selo">${formasDe.get(p.especie) - 1} forma(s)</span>` : ""}
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
  marcarBarra("barra-tipos", tiposSel);
}
function alternarFavorito(id) {
  favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
  gravar("favoritos:" + usuario.sub, [...favoritos]);
  atualizarResumo(); desenharGrade();
}

montarBarra("barra-tipos", (t) => {
  if (!tiposProntos) return aviso("Carregando os tipos… tente de novo em instantes.");
  if (tiposSel.has(t)) tiposSel.delete(t); else { tiposSel.add(t); if (tiposSel.size > 2) tiposSel.delete([...tiposSel][0]); }
  pagina = 1; desenharGrade();
});
[["filtro-geracao", "geracao", "generation"], ["filtro-cor", "cor", "pokemon-color"], ["filtro-habitat", "habitat", "pokemon-habitat"], ["filtro-ovo", "ovo", "egg-group"], ["filtro-formato", "formato", "pokemon-shape"]]
  .forEach(([id, chave, ep]) => $(id).addEventListener("change", async () => {
    const v = $(id).value; pagina = 1;
    if (!v) filtrosEsp[chave] = null;
    else { try { filtrosEsp[chave] = new Set((await api(ep + "/" + v)).pokemon_species.map((x) => x.name)); } catch (e) { aviso(e.message); filtrosEsp[chave] = null; } }
    desenharGrade();
  }));
["filtro-forma", "filtro-ordem"].forEach((id) => $(id).addEventListener("change", () => { pagina = 1; desenharGrade(); }));
$("busca").addEventListener("input", () => { pagina = 1; desenharGrade(); });
$("so-fav").addEventListener("click", (e) => {
  const b = e.currentTarget;
  b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
  pagina = 1; desenharGrade();
});
$("limpar").addEventListener("click", () => {
  $("busca").value = ""; $("filtro-forma").value = "base"; $("filtro-ordem").value = "num";
  ["filtro-geracao", "filtro-cor", "filtro-habitat", "filtro-ovo", "filtro-formato"].forEach((id) => { $(id).value = ""; });
  filtrosEsp = { geracao: null, cor: null, habitat: null, ovo: null, formato: null };
  tiposSel.clear(); $("so-fav").setAttribute("aria-pressed", "false"); pagina = 1; desenharGrade();
});
$("pag-ant").addEventListener("click", () => { pagina--; desenharGrade(); window.scrollTo({ top: 0, behavior: "smooth" }); });
$("pag-prox").addEventListener("click", () => { pagina++; desenharGrade(); window.scrollTo({ top: 0, behavior: "smooth" }); });
$("grade").addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]"); if (fav) return alternarFavorito(Number(fav.dataset.fav));
  const add = e.target.closest("[data-add]"); if (add) return addPorId(Number(add.dataset.add));
  const c = e.target.closest(".cartao"); if (c) abrir("poke", Number(c.dataset.id));
});
$("grade").addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.classList.contains("cartao")) abrir("poke", Number(e.target.dataset.id)); });

/* ---------- Catálogos de itens e golpes ---------- */
function Catalogo(c) {
  const e = { itens: [], filtros: {}, pag: 1 };
  const filtrar2 = () => {
    const t = $(c.b).value.trim().toLowerCase().replace("#", "");
    const sets = Object.values(e.filtros).filter(Boolean);
    return e.itens.filter((i) => (!t || i.nome.includes(t) || String(i.id) === t) && sets.every((s) => s.has(i.id)));
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
["grade-i", "grade-g"].forEach((g) => {
  $(g).addEventListener("click", (e) => { const c = e.target.closest("[data-item],[data-golpe]"); if (c) c.dataset.item ? abrir("item", c.dataset.item) : abrir("golpe", c.dataset.golpe); });
  $(g).addEventListener("keydown", (e) => { if (e.key === "Enter") e.target.click(); });
});

// filtros de itens: categoria, atributo e atalhos
async function conjuntoDe(ep, nome, campo) {
  try { return new Set((await api(ep + "/" + nome))[campo].map((x) => idDaUrl(x.url))); } catch (e) { aviso(e.message); return null; }
}
$("filtro-cat-item").addEventListener("change", async () => { const v = $("filtro-cat-item").value; catItens.pag = 1; catItens.filtros.cat = v ? await conjuntoDe("item-category", v, "items") : null; catItens.desenhar(); });
$("filtro-atrib-item").addEventListener("change", async () => { const v = $("filtro-atrib-item").value; catItens.pag = 1; catItens.filtros.atrib = v ? await conjuntoDe("item-attribute", v, "items") : null; catItens.desenhar(); });
const RAPIDOS = [
  ["z", "⚡ Z-Crystals", []], ["mega", "💎 Mega Stones", ["mega-stones"]], ["bolas", "Poké Bolas", ["standard-balls", "special-balls", "apricorn-balls"]],
  ["tm", "TM / TR / HM", ["all-machines"]], ["seg", "Itens seguráveis", ["held-items", "choice", "type-enhancement", "plates", "species-specific", "bad-held-items"]],
  ["fruta", "Frutas", ["effort-drop", "in-a-pinch", "picky-healing", "type-protection", "baking-only"]],
];
let rapidoAtivo = null;
$("itens-rapidos").innerHTML = RAPIDOS.map(([k, rot]) => `<button type="button" class="chip" data-rapido="${k}" aria-pressed="false">${rot}</button>`).join("");
$("itens-rapidos").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-rapido]"); if (!b) return;
  const k = b.dataset.rapido; rapidoAtivo = rapidoAtivo === k ? null : k;
  $("itens-rapidos").querySelectorAll("[data-rapido]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.rapido === rapidoAtivo)));
  catItens.pag = 1;
  if (!rapidoAtivo) catItens.filtros.rapido = null;
  else if (k === "z") catItens.filtros.rapido = new Set(catItens.itens.filter((i) => ZMAP[i.nome]).map((i) => i.id));
  else {
    const cats = RAPIDOS.find((r) => r[0] === k)[2];
    const res = await Promise.all(cats.map((c) => api("item-category/" + c).catch(() => null)));
    const ok = res.filter(Boolean);
    catItens.filtros.rapido = ok.length ? new Set(ok.flatMap((d) => d.items.map((x) => idDaUrl(x.url)))) : new Set();
    if (!ok.length) aviso("A PokéAPI não retornou essa categoria.");
  }
  catItens.desenhar();
});
// filtros de golpes: tipo (ícones), classe, geração
let tipoG = null;
montarBarra("barra-tipos-g", (t) => {
  if (!tiposProntos) return aviso("Carregando os tipos… tente de novo em instantes.");
  tipoG = tipoG === t ? null : t;
  catGolpes.filtros.tipo = tipoG ? golpesTipo.get(tipoG) : null; catGolpes.pag = 1; catGolpes.desenhar();
  marcarBarra("barra-tipos-g", new Set(tipoG ? [tipoG] : []));
});
$("filtro-classe-g").addEventListener("change", async () => { const v = $("filtro-classe-g").value; catGolpes.pag = 1; catGolpes.filtros.classe = v ? await conjuntoDe("move-damage-class", v, "moves") : null; catGolpes.desenhar(); });
$("filtro-geracao-g").addEventListener("change", async () => { const v = $("filtro-geracao-g").value; catGolpes.pag = 1; catGolpes.filtros.geracao = v ? await conjuntoDe("generation", v, "moves") : null; catGolpes.desenhar(); });

/* ---------- Equipes ---------- */
function desenharEditor() {
  let h = "";
  for (let i = 0; i < MAX_EQUIPE; i++) {
    const m = rascunho.membros[i];
    h += m
      ? `<div class="slot cheio" style="--cor:${PALETA[m.id % PALETA.length]}">
           <button type="button" class="slot-rm" data-rm="${i}" aria-label="Remover ${esc(bonito(m.nome))}">✕</button>
           <img src="${SPRITE(m.id)}" alt="" data-det="${m.id}"><span>${esc(bonito(m.nome))}</span><div class="tipos-card">${iconesTipo(m.id)}</div></div>`
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
      <div class="mini-linha">${e.membros.map((m) => `<img src="${SPRITE(m.id)}" alt="${esc(bonito(m.nome))}" title="${esc(bonito(m.nome))}" width="48" height="48">`).join("")}</div>
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
  rascunho = { id: null, nome: "", membros: [] }; $("eq-nome").value = "";
  desenharEditor(); desenharEquipes(); aviso(`Equipe "${nome}" salva!`);
}
function novaEquipe() { rascunho = { id: null, nome: "", membros: [] }; $("eq-nome").value = ""; desenharEditor(); aviso("Nova equipe em branco."); }
$("eq-salvar").addEventListener("click", salvarEquipe);
$("eq-nova").addEventListener("click", novaEquipe);
$("eq-slots").addEventListener("click", (e) => {
  const rm = e.target.closest("[data-rm]");
  if (rm) { rascunho.membros.splice(Number(rm.dataset.rm), 1); return desenharEditor(); }
  const d = e.target.closest("[data-det]"); if (d) abrir("poke", Number(d.dataset.det));
});
$("eq-lista").addEventListener("click", (e) => {
  const b = e.target.closest("[data-acao]"); if (!b) return;
  const id = b.closest("[data-eq]").dataset.eq, eq = equipes.find((x) => x.id === id); if (!eq) return;
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
  const achados = lista.filter((p) => p.nome.includes(t) || String(p.id) === t).sort((a, b) => (a.nome === t ? -1 : b.nome === t ? 1 : a.id - b.id)).slice(0, 12);
  box.innerHTML = achados.map((p) => `<button type="button" data-add="${p.id}"><img src="${SPRITE(p.id)}" alt="" width="32" height="32"> ${esc(bonito(p.nome))} <small>#${p.id}</small></button>`).join("") || "<p>Nada encontrado.</p>";
  box.hidden = false;
});
const escolherSug = (b) => { addPorId(Number(b.dataset.add)); $("eq-busca").value = ""; $("eq-sugestoes").hidden = true; $("eq-busca").focus(); };
$("eq-busca").addEventListener("keydown", (e) => { if (e.key !== "Enter") return; e.preventDefault(); const b = $("eq-sugestoes").querySelector("[data-add]"); if (b) escolherSug(b); });
$("eq-sugestoes").addEventListener("click", (e) => { const b = e.target.closest("[data-add]"); if (b) escolherSug(b); });

/* ---------- PDF: exportar / importar (sem bibliotecas) ---------- */
const pdfTxt = (s) => String(s).replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/\u2026/g, "...")
  .replace(/[^\x20-\x7e\xa0-\xff]/g, "?").replace(/[\\()]/g, "\\$&").replace(/[\x80-\xff]/g, (c) => "\\" + c.charCodeAt(0).toString(8).padStart(3, "0"));
const bytesParaB64 = (bytes) => { let b = ""; bytes.forEach((x) => { b += String.fromCharCode(x); }); return btoa(b); };

function criarPdf(eqs, favs, nomeUsuario) {
  const paginas = []; let ops, y;
  const nova = () => { ops = []; paginas.push(ops); y = 800; };
  const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255].map((v) => (v / 255).toFixed(3)).join(" "); };
  const texto = (x, yy, tam, s, fonte, c) => ops.push(`${rgb(c || "#1e1b4b")} rg BT /${fonte || "F1"} ${tam} Tf ${x} ${yy} Td (${pdfTxt(s)}) Tj ET`);
  const faixa = (x, yy, w, h, c) => ops.push(`${rgb(c)} rg ${x} ${yy} ${w} ${h} re f`);
  const precisa = (h) => { if (y - h < 40) nova(); };
  nova();
  faixa(0, 770, 595, 72, "#7c3aed");
  texto(36, 805, 22, "Pokédex Pessoal - Equipes e Favoritos", "F2", "#ffffff");
  texto(36, 783, 10, `${nomeUsuario || "Treinador"} - gerado em ${new Date().toLocaleDateString("pt-BR")}`, "F1", "#ffffff");
  y = 745;
  texto(36, y, 13, `Equipes (${eqs.length})`, "F2"); y -= 18;
  const cores = ["#2563eb", "#ec4899", "#f97316", "#22c55e", "#7c3aed", "#14b8a6", "#ef4444", "#eab308"];
  eqs.forEach((e, i) => {
    precisa(86);
    faixa(36, y - 16, 523, 20, cores[i % cores.length]);
    texto(44, y - 10, 11, `${i + 1}. ${e.nome}`, "F2", "#ffffff");
    y -= 34;
    e.membros.forEach((m, k) => texto(k < 3 ? 48 : 300, y - (k % 3) * 14, 10, `${k + 1}. ${bonito(m.nome)} (#${m.id})`));
    y -= 52;
  });
  if (!eqs.length) { texto(48, y, 10, "Nenhuma equipe salva.", "F1", "#6b7280"); y -= 20; }
  precisa(60);
  texto(36, y, 13, `Favoritos (${favs.length})`, "F2"); y -= 16;
  const nomesFav = favs.map((id) => porId.get(id) ? bonito(porId.get(id).nome) : "#" + id).join(", ") || "Nenhum favorito.";
  (nomesFav.match(/.{1,95}(\s|$)/g) || [nomesFav]).forEach((ln) => { precisa(14); texto(48, y, 10, ln.trim()); y -= 13; });
  nova();
  texto(36, y, 11, "Dados para importação (não edite)", "F2"); y -= 14;
  texto(36, y, 8, "Este bloco permite importar este PDF de volta na Pokédex Pessoal.", "F1", "#6b7280"); y -= 14;
  const json = JSON.stringify({ v: 1, equipes: eqs.map((e) => ({ nome: e.nome, membros: e.membros.map((m) => ({ id: m.id, nome: m.nome })) })), favoritos: favs });
  const b64 = bytesParaB64(new TextEncoder().encode(json));
  (b64.match(/.{1,100}/g) || []).forEach((ln) => { precisa(8); texto(36, y, 5, "PKDX1:" + ln, "F3", "#6b7280"); y -= 6.5; });

  const objs = [], n = paginas.length, info = 6 + 2 * n;
  objs[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objs[2] = `<< /Type /Pages /Kids [${paginas.map((_, i) => `${6 + 2 * i} 0 R`).join(" ")}] /Count ${n} >>`;
  objs[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objs[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
  objs[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>";
  paginas.forEach((o, i) => {
    const c = o.join("\n");
    objs[6 + 2 * i] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${7 + 2 * i} 0 R >>`;
    objs[7 + 2 * i] = `<< /Length ${c.length} >>\nstream\n${c}\nendstream`;
  });
  objs[info] = `<< /Title (${pdfTxt("Pokédex Pessoal - equipes")}) /Producer (Pokedex Pessoal) >>`;
  let out = "%PDF-1.4\n"; const off = [];
  for (let i = 1; i <= info; i++) { off[i] = out.length; out += `${i} 0 obj\n${objs[i]}\nendobj\n`; }
  const xref = out.length;
  out += `xref\n0 ${info + 1}\n0000000000 65535 f \n` + off.slice(1).map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("");
  out += `trailer\n<< /Size ${info + 1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  const bytes = new Uint8Array(out.length);
  for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i);
  return bytes;
}
function lerPayloadPdf(bytes) {
  let txt = ""; for (let i = 0; i < bytes.length; i++) txt += String.fromCharCode(bytes[i]);
  const partes = [...txt.matchAll(/\(PKDX1:([A-Za-z0-9+\/=]*)\)/g)].map((m) => m[1]);
  if (!partes.length) throw new Error("Este PDF não foi gerado por esta Pokédex (sem dados de importação).");
  const bin = atob(partes.join(""));
  const dados = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
  if (!dados || dados.v !== 1 || !Array.isArray(dados.equipes)) throw new Error("Dados de importação inválidos.");
  return dados;
}
$("eq-exportar").addEventListener("click", () => {
  const bytes = criarPdf(equipes, [...favoritos], usuario && usuario.nome);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  a.download = "pokedex-equipes.pdf";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  aviso("PDF gerado! Confira a pasta de downloads.");
});
$("eq-importar").addEventListener("click", () => $("eq-arquivo").click());
$("eq-arquivo").addEventListener("change", async (e) => {
  const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
  try {
    const dados = lerPayloadPdf(new Uint8Array(await f.arrayBuffer()));
    let n = 0;
    for (const q of dados.equipes) {
      if (equipes.length >= MAX_EQUIPES) break;
      if (!q || typeof q.nome !== "string" || !Array.isArray(q.membros)) continue;
      const membros = q.membros.filter((m) => m && Number.isInteger(m.id) && typeof m.nome === "string").slice(0, MAX_EQUIPE).map((m) => ({ id: m.id, nome: m.nome }));
      if (membros.length) { equipes.push({ id: novoId(), nome: q.nome.slice(0, 30), membros }); n++; }
    }
    (dados.favoritos || []).filter(Number.isInteger).forEach((id) => favoritos.add(id));
    gravar("equipes:" + usuario.sub, equipes); gravar("favoritos:" + usuario.sub, [...favoritos]);
    desenharEquipes(); desenharGrade(); aviso(`${n} equipe(s) importada(s) do PDF.`);
  } catch (err) { aviso(err.message || "Não foi possível importar este PDF."); }
});

/* ---------- Janela de detalhes ---------- */
const nav = [];
const navBar = () => nav.length > 1 ? '<button type="button" class="chip mini-btn voltar" data-voltar="1">← Voltar</button>' : "";
const fechaBtn = '<div class="linha"><button type="button" class="chip" data-fechar="1">Fechar</button></div>';
const XBTN = '<button type="button" class="x-fechar" data-fechar="1" aria-label="Fechar">✕</button>';
function abrir(tipo, ref, empurrar) {
  if (empurrar !== false) nav.push([tipo, ref]);
  const dlg = $("detalhe");
  if (!dlg.open) dlg.showModal();
  dlg.innerHTML = `<div class="det-corpo">${navBar()}<p>Carregando…</p></div>`;
  return ({ poke: detPoke, golpe: detGolpe, item: detItem, hab: detHab })[tipo](ref)
    .then(() => dlg.insertAdjacentHTML("afterbegin", XBTN))
    .catch((e) => { dlg.innerHTML = XBTN + `<div class="det-corpo">${navBar()}<p class="erro">${esc(e.message)}</p>${fechaBtn}</div>`; });
}
// Lista completa de Pokémon (com filtro de texto) — usada em golpes, habilidades e itens
function listaPoke(arr, rotulo) {
  if (!arr.length) return "";
  return `<h4>${rotulo} (${arr.length})</h4>
    <input type="search" class="filtro-lista" placeholder="Filtrar esta lista (${arr.length} Pokémon)…" aria-label="Filtrar lista">
    <div class="lista-poke">${arr.map((x) => { const id = idDaUrl(x.url); return `<button type="button" class="chip mini-btn" data-det="${id}" data-nome="${esc(x.name)}"><img src="${SPRITE(id)}" alt="" width="24" height="24" loading="lazy">${esc(bonito(x.name))}</button>`; }).join("")}</div>`;
}

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
const rotuloForma = (n) => { const c = classeForma(n, 10001); return c === "mega" ? "Mega" : c === "gmax" ? "Gigantamax" : c === "regional" ? "Regional" : ""; };
let golpesEst = null;
function desenharGolpes() {
  const g = golpesEst, box = $("golpes-box"); if (!box) return;
  const doVg = g.porVg.get(g.vg) || [];
  const metodos = [...new Set(doVg.map((x) => x.metodo))];
  if (!metodos.includes(g.metodo)) g.metodo = metodos.includes("level-up") ? "level-up" : metodos[0];
  const itens = doVg.filter((x) => x.metodo === g.metodo).sort((a, b) => g.metodo === "level-up" ? a.nivel - b.nivel || a.nome.localeCompare(b.nome) : a.nome.localeCompare(b.nome));
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
  const evo = [];
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
      <h4>Formas (Mega, Gigantamax, regionais, alternativas) — ${formas.length}</h4>
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

/* --- Golpe (ficha competitiva + todos que aprendem) --- */
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
  if (meta.max_hits > 1) L.push(`Acerta de ${meta.min_hits || 1} a ${meta.max_hits} vezes por uso (bom contra Substitute/Focus Sash).`);
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
      ${listaPoke(m.learned_by_pokemon, "Pokémon que aprendem este golpe")}
      ${fechaBtn}
    </div>`;
}

/* --- Item --- */
async function detZ(ref) {
  const z = ZMAP[ref], dlg = $("detalhe"), t = TIPOS[z.tipo];
  const ptTipo = t.pt;
  dlg.innerHTML = `
    <div class="det-topo" style="--cor:${t.cor}"><img src="${esc(ITEMIMG(ref))}" alt="" style="width:96px;height:96px;image-rendering:pixelated" onerror="this.style.visibility='hidden'">
      <h2>${esc(z.nome)}</h2><div class="tipos">${chipTipo(z.tipo)}<span class="tipo" style="--c:#374151">Z-Crystal</span></div></div>
    <div class="det-corpo">${navBar()}
      <h4>Definição</h4>
      <p>${z.esp
        ? `Cristal Z exclusivo: se <b>${esc(z.esp.poke)}</b> o segurar e conhecer <b>${esc(z.esp.base)}</b>, o treinador pode transformá-lo no Golpe Z exclusivo <b>${esc(z.z)}</b> (tipo ${ptTipo}).`
        : `Cristal Z de tipo ${ptTipo}. Se o Pokémon que o segura conhecer um golpe do tipo ${ptTipo}, ele pode virar o Golpe Z <b>${esc(z.z)}</b>. Golpes de dano ficam mais fortes; golpes de status ganham um efeito extra (Z-Power).`}</p>
      <h4>Como funciona</h4>
      <ul>
        <li>O Pokémon precisa <b>segurar o cristal</b> e o treinador precisa do <b>Z-Ring</b> (Z-Power Ring).</li>
        <li>Cada treinador pode usar <b>um Golpe Z por batalha</b>.</li>
        <li>Disponível apenas na <b>Geração 7</b> (${z.usum ? "Ultra Sun / Ultra Moon" : "Sun / Moon e Ultra Sun / Ultra Moon"}). Não existe nas Gerações 8 e 9.</li>
        ${z.esp && ref === "ultranecrozium-z" ? "<li>Com este cristal, Necrozma fundido (Dusk Mane/Dawn Wings) faz o Ultra Burst e vira Ultra Necrozma.</li>" : ""}
      </ul>
      ${fechaBtn}
    </div>`;
}
async function detItem(ref) {
  if (ZMAP[ref]) return detZ(ref);
  const it = await api("item/" + ref), dlg = $("detalhe");
  const nome = en(it.names, "name") || bonito(it.name);
  const ef = en(it.effect_entries) || {};
  const fl = ultimoEn(it.flavor_text_entries);
  const preco = [...(it.prices || [])].reverse().find((p) => p.purchase_price != null || p.sell_price != null);
  let maquina = "";
  if (it.machines && it.machines.length) {
    try { const mq = await api("machine/" + idDaUrl(it.machines[it.machines.length - 1].machine.url)); maquina = `<h4>Ensina o golpe</h4><div class="tipos"><button type="button" class="chip mini-btn" data-golpe="${esc(mq.move.name)}">${esc(bonito(mq.move.name))}</button></div><p class="nota">Versão: ${esc(bonito(mq.version_group.name))}</p>`; } catch {}
  }
  const defCat = DEF_CAT[it.category.name];
  dlg.innerHTML = `
    <div class="det-topo" style="--cor:#7c3aed"><img src="${esc(it.sprites.default || ITEMIMG(it.name))}" alt="" style="width:96px;height:96px;image-rendering:pixelated" onerror="this.style.visibility='hidden'"><h2>${esc(nome)}</h2><div class="tipos"><span class="tipo" style="--c:#374151">${esc(bonito(it.category.name))}</span></div></div>
    <div class="det-corpo">${navBar()}
      <h4>Definição</h4>
      <p><b>${esc(bonito(it.category.name))}:</b> ${esc(defCat || "Categoria sem definição geral cadastrada; veja o efeito e a descrição abaixo.")}</p>
      <h4>Efeito oficial (em inglês)</h4>
      <p>${ef.short_effect ? esc(ef.short_effect) + traduzir(ef.short_effect) : "<i>A PokéAPI não traz efeito oficial para este item; use a definição da categoria e a descrição do jogo.</i>"}</p>
      ${ef.effect && ef.effect !== ef.short_effect ? `<p class="nota">${esc(ef.effect)}</p>` : ""}
      ${fl ? `<h4>Descrição no jogo</h4><p><i>${esc(fl.text.replace(/[\n\f]+/g, " "))}</i>${traduzir(fl.text)}</p>` : ""}
      <h4>Como funciona (atributos)</h4>
      <ul>${it.attributes.map((a) => `<li><b>${esc(ATRIB[a.name] || bonito(a.name))}:</b> ${esc(ATRIB_DESC[a.name] || "")}</li>`).join("") || "<li>–</li>"}</ul>
      <div class="ficha">
        <div><small>Compra</small><b>${preco && preco.purchase_price != null ? preco.purchase_price : "—"}</b></div>
        <div><small>Venda</small><b>${preco && preco.sell_price != null ? preco.sell_price : "—"}</b></div>
        <div><small>Poder de arremesso</small><b>${it.fling_power ?? "—"}</b></div>
        <div><small>Efeito de arremesso</small><b>${it.fling_effect ? esc(bonito(it.fling_effect.name)) : "—"}</b></div>
      </div>
      ${maquina}
      ${listaPoke(it.held_by_pokemon.map((h) => h.pokemon), "Pokémon que podem carregar")}
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
      ${listaPoke(a.pokemon.map((x) => x.pokemon), "Pokémon com esta habilidade")}
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
$("detalhe").addEventListener("input", (e) => {
  if (!e.target.classList || !e.target.classList.contains("filtro-lista")) return;
  const t = e.target.value.trim().toLowerCase().replace(/\s+/g, "-");
  e.target.nextElementSibling.querySelectorAll("[data-nome]").forEach((b) => { b.hidden = !!t && !b.dataset.nome.includes(t); });
});
$("detalhe").addEventListener("close", () => { nav.length = 0; });

document.querySelectorAll("[data-aba]").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll("[data-aba]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  document.querySelectorAll('[id^="aba-"]').forEach((s) => { s.hidden = s.id !== "aba-" + b.dataset.aba; });
  window.scrollTo({ top: 0 });
}));

/* ---------- Sair ---------- */
$("sair").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
  usuario = null; cacheApi.clear(); ordemVgP = null; tiposProntos = false; tiposPor = new Map(); $("detalhe").close();
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
