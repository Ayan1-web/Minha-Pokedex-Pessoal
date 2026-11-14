# Passo a passo (para leigos): Login com Google no ar

Você **não precisa instalar nada** (nem Node, nem Git). A Vercel instala e roda tudo por você.
Você só vai usar: o navegador, o VS Code (só para olhar/editar) e 3 sites: **GitHub**, **Vercel** e **Google Cloud**.

A ordem importa. Siga na sequência:

---

## PARTE 1 — Colocar o projeto no GitHub

1. Descompacte o arquivo **login-google.zip** (botão direito → Extrair tudo). Vai surgir a pasta `login-google`.
2. (Opcional) Abra a pasta no VS Code: **Arquivo → Abrir Pasta…** → escolha `login-google`. Só para conhecer os arquivos.
3. Crie uma conta em **https://github.com** (se já tiver, entre).
4. Clique no **+** (canto superior direito) → **New repository**.
   - **Repository name:** `login-google`
   - Marque **Private** (privado)
   - Clique em **Create repository**
5. Na página do repositório novo, clique em **uploading an existing file**.
6. Abra a pasta `login-google` no seu computador, **selecione tudo que está dentro dela** (as pastas `api`, `lib`, `public` e os arquivos `package.json`, `.gitignore`, etc.) e **arraste para a janela do GitHub**.
   - Confira se as pastas apareceram na lista antes de continuar.
   - Se o `.gitignore` e o `.env.example` não aparecerem, não tem problema (arquivos que começam com ponto ficam ocultos no Windows). O projeto funciona sem eles, mas se quiser, ative "Itens ocultos" no Explorador de Arquivos.
7. Role até o fim e clique em **Commit changes**.

✅ Pronto: seu código está no GitHub.

---

## PARTE 2 — Publicar na Vercel (primeira vez, ainda sem login funcionando)

1. Entre em **https://vercel.com** → **Sign Up** → **Continue with GitHub** (autorize).
2. Clique em **Add New… → Project**.
3. Ache o repositório `login-google` e clique em **Import**.
4. Em **Framework Preset** deixe **Other**. **Não mude** mais nada.
5. Abra **Environment Variables** e adicione duas variáveis (clique em *Add* após cada uma):

   | Name | Value |
   |---|---|
   | `SESSION_SECRET` | uma frase longa e aleatória, **com mais de 32 caracteres** (ex.: `cavalo-azul-7391-prateleira-quente-ZXq82`) |
   | `GOOGLE_CLIENT_ID` | por enquanto escreva `temporario` (vamos trocar na Parte 4) |

6. Clique em **Deploy** e espere (1 a 2 minutos).
7. Quando aparecer "Congratulations", clique na imagem do site e **copie o endereço** (algo como `https://login-google-abc123.vercel.app`). **Guarde esse endereço.**

---

## PARTE 3 — Criar o login no Google Cloud

1. Entre em **https://console.cloud.google.com** com sua conta Google.
2. No topo, clique no seletor de projeto → **Novo projeto** → nome `login-google` → **Criar**. Depois selecione esse projeto.
3. No menu de busca (topo), digite **Google Auth Platform** e abra.
4. Clique em **Vamos começar** (ou *Get started*) e preencha:
   - **Nome do app:** o nome que quiser
   - **E-mail de suporte:** seu e-mail
   - **Público:** **Externo**
   - **Contato do desenvolvedor:** seu e-mail
   - Aceite os termos e clique em **Criar**.
5. No menu lateral, abra **Público-alvo** (*Audience*). Se o app estiver em **Teste**, adicione em **Usuários de teste** os e-mails que poderão entrar (inclusive o seu).
   - Para liberar qualquer pessoa, depois clique em **Publicar app**. Para só login básico (nome, e-mail, foto) normalmente não exige verificação demorada.
6. No menu lateral, abra **Clientes** → **Criar cliente**.
   - **Tipo de aplicativo:** **Aplicativo da Web**
   - **Nome:** `login-google-web`
   - Em **Origens JavaScript autorizadas** clique em **Adicionar URI** e cole **o endereço da Vercel da Parte 2**, **sem barra no final e sem caminho**.
     Exemplo certo: `https://login-google-abc123.vercel.app`
     Exemplo errado: `https://login-google-abc123.vercel.app/`
   - **URIs de redirecionamento:** deixe **vazio** (este projeto não usa).
   - Clique em **Criar**.
7. Vai aparecer o **ID do cliente** (termina com `.apps.googleusercontent.com`). **Copie.**
   - Ignore o "Client Secret": este projeto **não precisa dele**.

---

## PARTE 4 — Ligar a Vercel ao Google

1. Volte à Vercel → seu projeto → **Settings → Environment Variables**.
2. Ache `GOOGLE_CLIENT_ID` → **Edit** → cole o ID do cliente real → **Save**.
3. Vá em **Deployments** → no deploy mais recente, clique nos **três pontinhos (⋯) → Redeploy** → confirme.
   (A Vercel só lê variáveis novas depois de um novo deploy.)
4. Abra o endereço do site, clique em **Continuar com o Google** e faça login. 🎉

---

## Se algo der errado

| Sintoma | O que fazer |
|---|---|
| Aparece "GOOGLE_CLIENT_ID não configurado" | Faltou a Parte 4 ou o Redeploy. |
| O botão do Google não aparece / erro `origin_mismatch` | A origem cadastrada no Google Cloud está diferente do endereço do site (barra no final, `http` em vez de `https`, endereço errado). Corrija e aguarde alguns minutos. |
| Erro "Access blocked / app não verificado" | Em Público-alvo, adicione seu e-mail como **Usuário de teste**. |
| "Servidor sem GOOGLE_CLIENT_ID ou SESSION_SECRET" | `SESSION_SECRET` precisa ter **32+ caracteres**. |
| "Token inválido ou expirado" | O `GOOGLE_CLIENT_ID` da Vercel não é o mesmo do Google Cloud. Copie de novo. |
| Quis mudar o código | No GitHub, abra o arquivo → ícone do lápis → edite → **Commit changes**. A Vercel publica sozinha. |

---

## Segurança — regras de ouro

- **Nunca** coloque `SESSION_SECRET` em arquivo do projeto. Só na Vercel.
- Se um dia usar o **Client Secret** ou chaves, guarde **somente** na Vercel (Environment Variables).
- Mantenha o repositório **Private**.
- Para uso real, adicione seu domínio próprio em **Vercel → Settings → Domains** e cadastre **também** esse domínio nas Origens autorizadas do Google Cloud.

---

## O que cada arquivo faz

| Arquivo | Função |
|---|---|
| `public/index.html`, `style.css`, `app.js` | A tela: botão do Google, perfil e botão Sair |
| `api/config.js` | Entrega o Client ID (público) ao navegador |
| `api/auth/google.js` | **Valida o ID token no servidor** (assinatura, emissor, validade, audiência), exige `email_verified` e cria a sessão |
| `api/me.js` | Diz quem está logado |
| `api/logout.js` | Encerra a sessão (apaga o cookie) |
| `lib/sessao.js` | Cria/valida o cookie assinado (HttpOnly, Secure, SameSite) e checagem de origem (CSRF) |
| `package.json` | Lista a única biblioteca usada: `google-auth-library` |
