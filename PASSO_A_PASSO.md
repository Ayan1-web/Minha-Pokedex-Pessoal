# Pokédex Pessoal v3 — Atualização passo a passo (para leigos)

Você já tem Vercel, Google Cloud e variáveis configurados. **Nada disso muda.**
Só vamos trocar os arquivos do repositório `guia-login-google` e esperar a Vercel publicar.

## O que há de novo
- **Equipes:** monte equipes de até 6 Pokémon (pode repetir o mesmo Pokémon), dê um nome e salve.
  Você pode ter até 30 equipes salvas, editar, duplicar e excluir.
- **Pokédex completa:** todos os Pokémon da PokéAPI, com busca, filtro por tipo, favoritos e paginação.
- **Detalhes:** tipos, habilidades, atributos, linha evolutiva, golpes e descrição.
- **Explorador da API:** consulta os 52 endpoints da lista que você enviou.
- **Segurança:** a PokéAPI só é consultada por um servidor protegido (`/api/pokeapi`) que exige o login Google.

## PASSO 1 — Preparar os arquivos
1. Baixe o **guia-login-google.zip** e extraia (botão direito → Extrair tudo).
2. Abra a pasta extraída. Dentro dela estão: `api`, `lib`, `public`, `package.json`, `vercel.json`.

## PASSO 2 — Enviar ao GitHub (substituindo os antigos)
1. Abra o repositório **guia-login-google** no GitHub.
2. Clique em **Add file → Upload files**.
3. Selecione **tudo que está DENTRO da pasta extraída** (`api`, `lib`, `public`, `package.json`, `vercel.json`) e arraste para a janela.
   - Não arraste a pasta externa, só o conteúdo dela.
4. Clique em **Commit changes**.
   - Arquivos com o mesmo nome são substituídos. Arquivos novos (`api/pokeapi.js`, `lib/endpoints.js`) são adicionados.

## PASSO 3 — Conferir que os arquivos chegaram
No GitHub confira:
- `api/pokeapi.js` existe;
- `lib/endpoints.js` existe;
- `public/app.js` contém a palavra `CATALOGO`.
Se algum não existir, crie com **Add file → Create new file** colando o conteúdo do arquivo do zip (o nome deve incluir a pasta, ex.: `api/pokeapi.js`).

## PASSO 4 — Limpeza (opcional)
Os arquivos antigos `api/pokemon.js` e `lib/pokemon.js` não são mais usados. Pode apagá-los:
abra o arquivo → ícone da lixeira → **Commit changes**. Se não apagar, não atrapalha.
Se existir `public/teste.html`, apague também.

## PASSO 5 — Esperar a Vercel
1. Na Vercel, projeto **qi82**, aba **Deployments**.
2. Espere o deploy mais recente ficar **Ready** (1 a 2 minutos).

## PASSO 6 — Testar
1. Abra `https://guia-login-google-qi82.vercel.app` em janela anônima (Ctrl + Shift + N).
2. Entre com o Google. Deve aparecer o dashboard colorido com 4 cartões no topo.
3. **Teste de equipe:**
   - No campo "Buscar Pokémon para a equipe", digite `pikachu` e clique no resultado.
   - Digite `charizard` e clique. Adicione mais 4 (pode repetir).
   - Escreva o nome (ex.: Equipe 1) e clique em **Salvar equipe**.
   - Ela aparece em "Equipes salvas". Monte outra para ter mais de uma.
4. **Teste da Pokédex:** use busca, filtro de tipo, ★ e clique em um cartão para ver os detalhes.
5. **Teste do Explorador:** aba "Explorador da API" → escolha "Pokémon" → digite `pikachu` → Consultar.
6. **Prova de proteção:** clique em **Sair** e abra `.../api/pokeapi?caminho=pokemon/25`. Deve dar erro pedindo login.

## Se algo der errado
| Sintoma | Solução |
|---|---|
| Continua a tela antiga | **Ctrl + Shift + R**; confirme deploy **Ready**. |
| "Carregando Pokédex…" nunca termina / erro vermelho | Confirme `api/pokeapi.js` e `lib/endpoints.js` no GitHub. Abra `.../api/pokeapi?caminho=pokemon/25` já logado: deve mostrar dados. |
| "A PokéAPI não respondeu a tempo" | A PokéAPI pode estar lenta. Tente de novo em instantes. |
| Alguns endpoints do Explorador mostram "Não encontrado" | Alguns nomes da lista podem não existir na PokéAPI atual (ex.: item-price, currency). Não é erro do projeto. |
| Imagens aparecem como ❓ | As imagens vêm de raw.githubusercontent.com; verifique a internet ou bloqueadores. |
| Equipes sumiram | Ficam salvas **neste navegador**, por conta Google. Em outro computador use **Exportar equipes** (copia um texto) e **Importar equipes** (cola o texto). |

## Limites desta versão
- Equipes e favoritos ficam no navegador (localStorage). Para sincronizar entre máquinas automaticamente seria preciso um banco de dados (próximo passo possível).
- Lista só espécies base (formas alternativas ficam de fora); equipes têm até 6 Pokémon.
