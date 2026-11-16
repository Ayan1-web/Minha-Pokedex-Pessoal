# Pokédex Pessoal com Login Google — Atualização (passo a passo leigo)

Você já tem tudo configurado (Vercel, Google Cloud e variáveis). Agora vamos só **trocar os arquivos** do repositório `guia-login-google` por estes novos.
Não precisa mexer no Google Cloud nem nas variáveis da Vercel.

## O que mudou
- Depois do login aparece a **Pokédex** (10 Pokémon), com dashboard colorido, busca, filtro por tipo, favoritos e tela de detalhes.
- Os dados da Pokédex vêm de uma **rota protegida** (`/api/pokemon`): sem login válido, o servidor responde 401 e não entrega nada.
- Os favoritos ficam guardados no navegador, separados por usuário Google (`sub`).

## Passo 1: Preparar os arquivos (em qualquer computador)
1. Baixe e extraia o **guia-login-google.zip**.
2. Abra a pasta extraída. Dentro dela você verá: `api`, `lib`, `public`, `package.json`, `vercel.json`.

## Passo 2: Enviar para o GitHub
1. Entre em **github.com** e abra o repositório **guia-login-google**.
2. Clique em **Add file → Upload files**.
3. Selecione **tudo que está dentro da pasta extraída** (as pastas `api`, `lib`, `public` e os arquivos `package.json` e `vercel.json`) e arraste para a janela do GitHub.
4. Arquivos com o mesmo nome são **substituídos**. Isso é o esperado.
5. Clique em **Commit changes**.

## Passo 3: Remover o arquivo de teste (se você criou)
Se criou o `public/teste.html` durante o diagnóstico: no GitHub abra `public` → `teste.html` → ícone da lixeira → **Commit changes**.

## Passo 4: Esperar a Vercel publicar
A Vercel publica sozinha após cada commit. Em **Deployments**, espere o status ficar **Ready** (1 a 2 minutos).

## Passo 5: Testar
1. Abra `https://guia-login-google-qi82.vercel.app` (de preferência em janela anônima).
2. Entre com o Google. Você deve ver a **Pokédex** colorida com 10 cartões.
3. Teste: busca, filtro de tipo, ★ favorito, clique no cartão (detalhes) e **Sair**.
4. Prova da proteção: depois de sair, abra `https://guia-login-google-qi82.vercel.app/api/pokemon`. Deve aparecer uma mensagem de erro pedindo login.

## Se algo der errado
| Sintoma | Solução |
|---|---|
| Continua a tela antiga | Dê **Ctrl + Shift + R** e confira se o deploy está **Ready**. |
| 404 na página | Confira se `vercel.json` está na raiz do repositório e a pasta `public` também. |
| Cartões sem imagem (aparece ❓) | As imagens vêm do site raw.githubusercontent.com. Confira a internet/bloqueadores. A Pokédex funciona mesmo sem imagem. |
| Login não funciona em outra máquina | Teste em janela anônima, desative extensões de bloqueio e confirme que seu e-mail está em **Usuários de teste** no Google Cloud. |
| Favoritos "sumiram" | Ficam salvos por navegador. Em outro computador ou navegador começam vazios. |

## Próximos passos possíveis
Guardar favoritos num banco de dados (para acompanharem o usuário em qualquer máquina), adicionar mais Pokémon em `lib/pokemon.js` e criar equipes.
