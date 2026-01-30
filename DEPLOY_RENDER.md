# 🚀 Como fazer Deploy no Render

## Passo a passo completo:

### 1. Prepare seu projeto no GitHub

1. **Crie uma conta no GitHub** (se ainda não tiver): https://github.com
2. **Crie um novo repositório:**
   - Clique em "New repository"
   - Nome: `game-portfolio` (ou o que preferir)
   - Deixe como Public
   - Clique em "Create repository"

3. **Suba os arquivos pro GitHub:**
   - Você pode usar o GitHub Desktop (mais fácil)
   - Ou pela linha de comando:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/game-portfolio.git
   git push -u origin main
   ```

### 2. Deploy no Render

1. **Crie uma conta no Render**: https://render.com
   - Pode fazer login com sua conta do GitHub (mais fácil)

2. **Crie um novo Web Service:**
   - No dashboard do Render, clique em "New +" → "Web Service"
   - Conecte seu repositório do GitHub
   - Selecione o repositório `game-portfolio`

3. **Configure o serviço:**
   - **Name:** game-portfolio (ou o que quiser)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

4. **Variáveis de ambiente (opcional mas recomendado):**
   - Clique em "Advanced" → "Add Environment Variable"
   - Adicione:
     - `JWT_SECRET` = qualquer string aleatória longa (ex: `meu-super-secret-123-xyz`)
     - `NODE_ENV` = `production`

5. **Clique em "Create Web Service"**

### 3. Aguarde o Deploy

- O Render vai instalar as dependências e iniciar o servidor
- Vai levar uns 2-5 minutos
- Quando terminar, você verá "Live" com um link tipo:
  - `https://game-portfolio-xyz.onrender.com`

### 4. Acesse seu site!

- Clique no link fornecido pelo Render
- Faça login com: **admin** / **admin123**
- Pronto! Seu portfólio está online! 🎉

## ⚠️ Observações Importantes:

### Plano Free do Render:
- ✅ **Gratuito pra sempre**
- ⏰ **O servidor "dorme" após 15 minutos sem uso**
- 🐌 **Primeiro acesso depois de dormir demora ~30-60 segundos pra acordar**
- 🔄 **Depois disso funciona normalmente**

### Banco de Dados:
- O SQLite vai funcionar, mas os dados **não persistem entre deploys**
- Se você fizer um novo deploy, os jogos voltam pros 6 exemplos iniciais
- **Solução futura:** Migrar pra PostgreSQL (Render oferece gratuitamente)

### Atualizações:
- Toda vez que você der `git push` no GitHub, o Render atualiza automaticamente!

## 🆘 Problemas Comuns:

**Erro: "Application failed to respond"**
- Aguarde mais um pouco, o servidor pode estar iniciando

**Site muito lento no primeiro acesso**
- Normal! É o servidor "acordando" do modo sleep

**Não consigo fazer login**
- Verifique se está usando: admin / admin123
- Abra o Console do navegador (F12) pra ver erros

## 🎯 Próximos Passos (opcional):

1. **Domínio customizado:** Render permite adicionar seu próprio domínio
2. **Upgrade pra plano pago:** $7/mês pra evitar o "sleep mode"
3. **Migrar pra PostgreSQL:** Pra dados persistirem

---

Qualquer dúvida, é só chamar! 🚀
