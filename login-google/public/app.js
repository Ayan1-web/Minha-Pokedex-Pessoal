const $ = (id) => document.getElementById(id);

function mostrarErro(msg) {
  $("erro").textContent = msg;
  $("erro").hidden = false;
}

function mostrarPerfil(u) {
  $("nome").textContent = u.nome || "Usuário";
  $("email").textContent = u.email || "";
  if (u.foto) $("foto").src = u.foto; else $("foto").hidden = true;
  $("tela-login").hidden = true;
  $("tela-perfil").hidden = false;
}

function mostrarLogin() {
  $("tela-perfil").hidden = true;
  $("tela-login").hidden = false;
}

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
    mostrarPerfil(dados.usuario);
  } catch {
    mostrarErro("Falha de conexão. Tente novamente.");
  }
}

function iniciarGoogle(clientId) {
  if (!window.google || !google.accounts) {
    return setTimeout(() => iniciarGoogle(clientId), 200); // aguarda a biblioteca carregar
  }
  google.accounts.id.initialize({ client_id: clientId, callback: aoReceberCredencial });
  google.accounts.id.renderButton($("botao-google"), {
    theme: "outline", size: "large", text: "continue_with", locale: "pt-BR",
  });
}

$("sair").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
  mostrarLogin();
});

(async function iniciar() {
  try {
    const me = await fetch("/api/me");
    if (me.ok) {
      mostrarPerfil((await me.json()).usuario);
    } else {
      const { clientId } = await (await fetch("/api/config")).json();
      mostrarLogin();
      if (!clientId) mostrarErro("GOOGLE_CLIENT_ID não configurado na Vercel.");
      else iniciarGoogle(clientId);
    }
  } catch {
    mostrarLogin();
    mostrarErro("Não foi possível carregar a aplicação.");
  } finally {
    $("carregando").hidden = true;
  }
})();
