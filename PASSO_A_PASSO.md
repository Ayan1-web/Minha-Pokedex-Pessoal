# Pokédex Pessoal v4 — Atualização passo a passo (para leigos)

Você já tem Vercel, Google Cloud e variáveis configurados. **Nada disso muda.**
Só vamos trocar os arquivos do repositório `guia-login-google` e esperar a Vercel publicar.

## O que há de novo na v4
- **Mega Evoluções e Gigantamax:** filtro "Variações" na Pokédex (Espécies base, Mega, Gigantamax, Regionais, Todas) e lista de formas dentro de cada Pokémon. Dá para colocar Megas e Gigantamax nas equipes (busque `charizard-mega-x` ou `venusaur-gmax`).
- **Itens:** nova aba com todos os itens da PokéAPI, com busca, filtro por categoria e ficha (efeito, descrição, atributos, preço, arremesso, TM ensina qual golpe, quem carrega).
- **Golpes:** nova aba com todos os golpes e ficha com **leitura competitiva** (poder, precisão, PP, prioridade, STAB, crítico, status, recuo, cura, histórico de mudanças entre gerações, quem aprende).
- **Cada Pokémon:** golpes **por nível** com seletor de versão do jogo (padrão: a mais recente), outras formas de aprender (ovo, tutor, TM), **EVs concedidos** ao derrotar/capturar, fraquezas e resistências, habilidades clicáveis com descrição, linha evolutiva, treino/criação e locais de encontro.
- **Guia e Mecânicas:** como funcionam itens, EVs, aprendizado de golpes, leitura competitiva, Mega/Gigantamax/Tera.
- **Pokébolas ilustradas** nas laterais após o login (aparecem em telas largas).
- **Explorador:** agora segue a especificação oficial da PokéAPI (v2.10.0).

## Importante sobre a lista de APIs
- `item-price` **não existe** na especificação oficial enviada; foi removido.
- `meta` **existe** na especificação e foi adicionado.

## PASSO 1 — Preparar os arquivos
1. Baixe e extraia o **guia-login-google.zip**.
2. Dentro da pasta extraída estão: `api`, `lib`, `public`, `package.json`, `vercel.json`.

## PASSO 2 — Enviar ao GitHub (substituindo os antigos)
1. Abra o repositório **guia-login-google** no GitHub.
2. **Add file → Upload files**.
3. Arraste **tudo que está DENTRO da pasta extraída** (não a pasta externa).
4. **Commit changes**. Arquivos com o mesmo nome são substituídos.

## PASSO 3 — Conferir
No GitHub confira: `lib/endpoints.js` contém a palavra `meta` e **não** contém `item-price`; `public/app.js` contém `Guia e Mecânicas` ou `leituraCompetitiva`.

## PASSO 4 — Esperar a Vercel
Projeto **qi82 → Deployments**: espere o deploy mais recente ficar **Ready**.

## PASSO 5 — Testar
1. Abra `https://guia-login-google-qi82.vercel.app` em janela anônima e entre com o Google.
2. Veja as pokébolas nas laterais (em telas largas, a partir de ~1180 px).
3. Pokédex: em "Variações" escolha **Mega Evoluções**, depois **Gigantamax**.
4. Abra um Pokémon (ex.: Charizard): veja EVs, formas, habilidades, golpes por nível (troque a versão do jogo), fraquezas e "Ver locais de encontro".
5. Clique em um golpe da tabela → ficha competitiva. Clique em uma habilidade → descrição. Use **← Voltar**.
6. Aba **Itens**: busque `master-ball`, `leftovers`, `charizardite-x`; filtre por categoria.
7. Aba **Golpes**: filtre por tipo e abra `thunderbolt`.
8. Aba **Guia e Mecânicas** e **Explorador da API**.

## Se algo der errado
| Sintoma | Solução |
|---|---|
| Continua a versão antiga | **Ctrl + Shift + R**; confirme deploy **Ready**. |
| Abas Itens/Golpes vazias | Aguarde alguns segundos (carregam em segundo plano). Se persistir, abra `.../api/pokeapi?caminho=item&limit=5` já logado. |
| Forma nova (Mega de Legends: Z-A) sem golpes próprios | A PokéAPI pode ainda não ter esses dados; o app mostra os golpes da forma base e avisa. |
| Textos de itens/golpes/habilidades em inglês | Vêm assim da PokéAPI. Use o link **Traduzir ↗** da ficha. |
| Imagem de uma forma aparece como ❓ | A imagem oficial dessa forma pode não existir no repositório de sprites. |
| Equipes sumiram em outro computador | Ficam no navegador: use **Exportar/Importar equipes**. |

## Limites
- Dados e textos seguem a PokéAPI (jogos principais). Itens de outros universos (anime, TCG, Pokémon GO) não estão incluídos.
- Equipes e favoritos ficam no navegador (sem banco de dados).
