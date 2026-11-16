const $ = (id) => document.getElementById(id);
const IMG = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
const CORES = {
  "Planta": "#22c55e", "Veneno": "#a855f7", "Fogo": "#f97316", "Água": "#3b82f6",
  "Elétrico": "#eab308", "Normal": "#9ca3af", "Fada": "#f472b6", "Fantasma": "#6d28d9",
};

let usuario = null;
let lista = [];
let favoritos = new Set();

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

/* ---------- Favoritos (guardados no navegador, separados por usuário) ---------- */
const chaveFav = () => "favoritos:" + usuario.sub;
function carregarFavoritos() {
  try { favoritos = new Set(JSON.parse(localStorage.getItem(chaveFav()) || "[]")); }
  catch { favoritos = new Set(); }
}
function salvarFavoritos() {
  try { localStorage.setItem(chaveFav(), JSON.stringify([...favoritos])); } catch {}
}

/* ---------- Telas ---------- */
function mostrarLogin() {
  $("tela-app").hidden = true;
  $("tela-login").hidden = false;
  document.body.classList.remove("logado");
}

async function mostrarApp(u) {
  usuario = u;
  $("nome").textContent = u.nome || "Treinador";
  $("email").textContent = u.email || "";
  if (u.foto) { $("foto").src = u.foto; $("foto").hidden = false; } else { $("foto").hidden = true; }
  carregarFavoritos();

  const r = await fetch("/api/pokemon");
  if (r.status === 401) return mostrarLogin();
  lista = (await r.json()).pokemon;

  const tipos = [...new Set(lista.flatMap((p) => p.tipos))].sort();
  $("filtro-tipo").innerHTML = '<option value="">Todos os tipos</option>' +
    tipos.map((t) => `<option>${t}</option>`).join("");

  $("tela-login").hidden = true;
  $("tela-app").hidden = false;
  desenhar();
}

/* ---------- Pokédex ---------- */
const corDe = (p) => CORES[p.tipos[0]] || "#7c3aed";

function atualizarResumo() {
  const forte = lista.reduce((a, b) => (b.ataque > a.ataque ? b : a));
  const rapido = lista.reduce((a, b) => (b.velocidade > a.velocidade ? b : a));
  $("r-total").textContent = lista.length;
  $("r-fav").textContent = favoritos.size;
  $("r-forte").textContent = forte.nome;
  $("r-rapido").textContent = rapido.nome;
}

function filtrar() {
  const termo = $("busca").value.trim().toLowerCase();
  const tipo = $("filtro-tipo").value;
  const soFav = $("so-fav").getAttribute("aria-pressed") === "true";
  return lista.filter((p) =>
    (!termo || p.nome.toLowerCase().includes(termo) || String(p.id).includes(termo.replace("#", ""))) &&
    (!tipo || p.tipos.includes(tipo)) &&
    (!soFav || favoritos.has(p.id)));
}

const tiposHtml = (p) =>
  `<div class="tipos">${p.tipos.map((t) => `<span class="tipo" style="--c:${CORES[t] || "#9ca3af"}">${t}</span>`).join("")}</div>`;

function desenhar() {
  atualizarResumo();
  const itens = filtrar();
  $("vazio").hidden = itens.length > 0;
  $("grade").innerHTML = itens.map((p) => `
    <article class="cartao" tabindex="0" data-id="${p.id}" style="--cor:${corDe(p)}">
      <span class="num">#${String(p.id).padStart(3, "0")}</span>
      <button class="fav ${favoritos.has(p.id) ? "ativo" : ""}" data-fav="${p.id}"
        aria-label="Favoritar ${p.nome}" aria-pressed="${favoritos.has(p.id)}">★</button>
      <img src="${IMG(p.id)}" alt="${p.nome}" loading="lazy" onerror="this.outerHTML='<div class=&quot;sem-img&quot;>❓</div>'">
      <h3>${p.nome}</h3>
      ${tiposHtml(p)}
    </article>`).join("");
}

function alternarFavorito(id) {
  favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
  salvarFavoritos();
  desenhar();
}

function abrirDetalhe(id) {
  const p = lista.find((x) => x.id === id);
  if (!p) return;
  const cor = corDe(p);
  const stats = [["HP", p.hp], ["Ataque", p.ataque], ["Defesa", p.defesa],
                 ["Atq. Esp.", p.atqEsp], ["Def. Esp.", p.defEsp], ["Velocidade", p.velocidade]];
  $("detalhe").innerHTML = `
    <div class="det-topo" style="--cor:${cor}">
      <img src="${IMG(p.id)}" alt="${p.nome}">
      <h2>${p.nome} <small>#${String(p.id).padStart(3, "0")}</small></h2>
      ${tiposHtml(p)}
    </div>
    <div class="det-corpo">
      <p>${p.descricao}</p>
      <div class="medidas"><span>Altura: ${p.altura} m</span><span>Peso: ${p.peso} kg</span></div>
      ${stats.map(([n, v]) => `
        <div class="barra"><span>${n}</span><strong>${v}</strong>
          <div class="trilho"><div class="preench" style="width:${Math.min(100, (v / 160) * 100)}%;--cor:${cor}"></div></div>
        </div>`).join("")}
      <button type="button" class="chip fechar" id="fechar">Fechar</button>
    </div>`;
  $("detalhe").showModal();
  $("fechar").addEventListener("click", () => $("detalhe").close());
}

/* ---------- Eventos ---------- */
$("grade").addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) return alternarFavorito(Number(fav.dataset.fav));
  const c = e.target.closest(".cartao");
  if (c) abrirDetalhe(Number(c.dataset.id));
});
$("grade").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.classList.contains("cartao")) abrirDetalhe(Number(e.target.dataset.id));
});
$("detalhe").addEventListener("click", (e) => { if (e.target === $("detalhe")) $("detalhe").close(); });
$("busca").addEventListener("input", desenhar);
$("filtro-tipo").addEventListener("change", desenhar);
$("so-fav").addEventListener("click", (e) => {
  const ligado = e.currentTarget.getAttribute("aria-pressed") === "true";
  e.currentTarget.setAttribute("aria-pressed", String(!ligado));
  desenhar();
});
$("sair").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
  usuario = null;
  mostrarLogin();
});

/* ---------- Login com Google ---------- */
async function aoReceberCredencial({ credential }) {
  $("erro").hidden = true;
  try {
    const r = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: credential }),
    });
    const dados = await r.json();
    if (!r.ok) return mostrarErro(dados.erro || "Não foi possível entrar.");
    await mostrarApp(dados.usuario);
  } catch {
    mostrarErro("Falha de conexão. Tente novamente.");
  }
}

function iniciarGoogle(clientId, tentativas) {
  tentativas = tentativas || 0;
  if (!window.google || !google.accounts) {
    if (tentativas > 50) return mostrarErro("A biblioteca do Google não carregou. Desative bloqueadores e tente em janela anônima.");
    return setTimeout(() => iniciarGoogle(clientId, tentativas + 1), 200);
  }
  google.accounts.id.initialize({ client_id: clientId, callback: aoReceberCredencial, ux_mode: "popup" });
  google.accounts.id.renderButton($("botao-google"), {
    theme: "filled_blue", size: "large", text: "continue_with", shape: "pill", locale: "pt-BR",
  });
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
  } catch {
    mostrarLogin();
    mostrarErro("Não foi possível carregar a aplicação.");
  } finally {
    $("carregando").hidden = true;
  }
})();
