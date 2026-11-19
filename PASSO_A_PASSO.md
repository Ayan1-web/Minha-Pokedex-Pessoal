# Pokédex Pessoal v5 — Atualização passo a passo (para leigos)

Você já tem Vercel, Google Cloud e variáveis configurados. **Nada disso muda.**
Só vamos trocar os arquivos do repositório `guia-login-google` e esperar a Vercel publicar.

## O que há de novo na v5
- **Explorador da API removido.** As 4 abas agora ocupam a largura toda em colunas iguais.
- **Símbolos de tipo** (os 18 da sua imagem) nos cartões, nas fichas, nas equipes e como filtros por ícone (Pokédex: até 2 tipos ao mesmo tempo; Golpes: 1 tipo).
- **Novos filtros na Pokédex:** variações (Mega/Primal, Gigantamax, regionais, **alternativas** como as 5 formas do Rotom, todas), geração, cor, habitat, grupo de ovos, formato do corpo, ordenação e "Limpar filtros".
- **Novos filtros em Itens** (categoria, atributo e atalhos: Z-Crystals, Mega Stones, Poké Bolas, TM/TR/HM, seguráveis, frutas) e em **Golpes** (tipo, classe, geração).
- **Z-Crystals:** os 35 (18 de tipo + 17 exclusivos) com Golpe Z, requisito e regras. Ficam disponíveis mesmo que a PokéAPI não os liste.
- **Definição de itens:** quando a PokéAPI não traz efeito oficial, a ficha mostra a definição geral da categoria + descrição do jogo + explicação de cada atributo.
- **Golpes:** a ficha agora lista **todos** os Pokémon que aprendem o golpe (ex.: os 281 do Thunder Punch), com campo para filtrar a lista. Também em habilidades e itens.
- **PDF:** exportar e importar equipes e favoritos em arquivo PDF.
- **Celular:** layout ajustado (testado em tela de 390 px), botão ✕ fixo nas fichas, tela cheia nas fichas, ícone e manifesto para "instalar" como app.

## PASSO 1 — Preparar
1. Baixe e extraia o **guia-login-google.zip**.
2. Dentro da pasta extraída: `api`, `lib`, `public`, `package.json`, `vercel.json`.
3. Dentro de `public` há agora uma pasta **`tipos`** (18 imagens), além de `manifest.webmanifest`, `icone-192.png`, `icone-512.png` e `apple-touch-icon.png`.

## PASSO 2 — Enviar ao GitHub
1. Abra o repositório **guia-login-google** → **Add file → Upload files**.
2. Arraste **tudo que está DENTRO da pasta extraída** (inclusive a pasta `public` com a subpasta `tipos`). Use Chrome ou Edge para o GitHub aceitar pastas.
3. **Commit changes**.
4. Se as imagens de `tipos` não subirem: entre em `public` no GitHub → **Add file → Upload files** e arraste a pasta `tipos` inteira; depois **Commit changes**.

## PASSO 3 — Conferir
- `public/tipos/` tem 18 arquivos `.png` (bug, dark, dragon, electric, fairy, fighting, fire, flying, ghost, grass, ground, ice, normal, poison, psychic, rock, steel, water).
- `public/app.js` contém `criarPdf`.
- Se existir `public/teste.html`, apague-o.

## PASSO 4 — Esperar a Vercel
Projeto **qi82 → Deployments**: espere ficar **Ready**.

## PASSO 5 — Testar
1. Abra o site em janela anônima e entre com o Google.
2. Clique em dois ícones de tipo (ex.: Fogo + Voador) e veja o filtro.
3. Filtro "Variações → Formas alternativas": aparecem Rotom Heat/Wash/Frost/Fan/Mow e outras.
4. Aba **Golpes** → ícone Elétrico → abra **thunder-punch** → role até a lista e digite um nome para filtrar.
5. Aba **Itens** → atalho **⚡ Z-Crystals** → abra **firium-z**.
6. Monte uma equipe → **📄 Exportar PDF** → exclua a equipe → **📥 Importar PDF** e escolha o arquivo.

## No celular
- Use **Chrome (Android)** ou **Safari (iPhone)**. Dentro do navegador interno de apps (Instagram, WhatsApp, Facebook) o Google bloqueia o login.
- Instalar: Chrome → ⋮ → "Adicionar à tela inicial"; Safari → Compartilhar → "Adicionar à Tela de Início".

## Se algo der errado
| Sintoma | Solução |
|---|---|
| Símbolos de tipo não aparecem | Confira `public/tipos/*.png` no GitHub (Passo 2.4). |
| Tipos demoram a aparecer nos cartões | Carregam em segundo plano (18 consultas); aguarde alguns segundos. |
| Aviso "A PokéAPI não retornou essa categoria" | O atalho usa nomes de categoria que podem diferir; use o filtro "Categoria". |
| Importar PDF diz "sem dados de importação" | Só funciona com PDFs gerados por este app e sem edição. |
| Continua a versão antiga | **Ctrl + Shift + R** e confirme deploy **Ready**. |

## Limites
- Textos oficiais de itens, golpes e habilidades vêm em inglês (use "Traduzir ↗").
- Equipes e favoritos ficam no navegador; para levar a outro aparelho use o PDF.
