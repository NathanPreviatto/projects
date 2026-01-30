# 🎮 Game Portfolio - Repositório de Projetos Gamificado

Um sistema completo de portfólio de projetos com visual de biblioteca de jogos, incluindo autenticação, dashboard interativo e gerenciamento de projetos.

## 🚀 Funcionalidades

- ✅ Sistema de login com autenticação JWT
- ✅ Dashboard com cards de projetos em grid
- ✅ Estatísticas gerais (total de projetos, concluídos, tempo total, média de conclusão)
- ✅ Modal detalhado ao clicar em cada projeto mostrando:
  - Imagem do projeto
  - Descrição completa
  - Porcentagem de conclusão com barra de progresso
  - Tempo de desenvolvimento (horas)
  - Status do projeto (Concluído, Em Desenvolvimento, Pausado, Planejamento)
  - Tecnologias utilizadas
  - Links para GitHub e Demo
- ✅ Design moderno com efeitos glassmorphism
- ✅ Responsivo para mobile e desktop
- ✅ Dados persistidos em banco SQLite

## 📦 Tecnologias Utilizadas

### Backend
- Node.js + Express
- SQLite3 (banco de dados)
- JWT (autenticação)
- Bcrypt (hash de senhas)
- CORS

### Frontend
- React 18
- CSS3 com gradientes e efeitos modernos
- Design responsivo

## 🛠️ Instalação

### Rodando Localmente

1. **Clone ou extraia os arquivos do projeto**

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor:**
```bash
npm start
```

4. **Acesse no navegador:**
```
http://localhost:3001
```

### Deploy no Render (Online)

Para colocar seu projeto online gratuitamente, veja o guia completo em **[DEPLOY_RENDER.md](./DEPLOY_RENDER.md)**

Resumo rápido:
1. Suba o projeto no GitHub
2. Conecte no Render.com (grátis)
3. Deploy automático em 5 minutos
4. Acesse de qualquer lugar! 🌐

## 🔑 Login Padrão

- **Usuário:** admin
- **Senha:** admin123

## 📁 Estrutura do Projeto

```
game-portfolio/
├── server.js              # Servidor Express com API REST
├── package.json           # Dependências do projeto
├── gameportfolio.db       # Banco de dados SQLite (gerado automaticamente)
└── public/
    └── index.html         # Frontend React (SPA)
```

## 🎯 Como Usar

1. **Login:** Acesse a página inicial e faça login com as credenciais padrão
2. **Visualizar Projetos:** Veja todos os seus projetos em formato de cards
3. **Detalhes:** Clique em qualquer projeto para ver informações completas
4. **Estatísticas:** Acompanhe suas métricas no topo da página

## 🔧 API Endpoints

### Autenticação
- `POST /api/login` - Fazer login

### Jogos/Projetos
- `GET /api/games` - Listar todos os projetos (requer auth)
- `GET /api/games/:id` - Buscar projeto específico (requer auth)
- `POST /api/games` - Criar novo projeto (requer auth)
- `PUT /api/games/:id` - Atualizar projeto (requer auth)
- `DELETE /api/games/:id` - Deletar projeto (requer auth)

## 📊 Estrutura do Banco de Dados

### Tabela `users`
- id (INTEGER, PRIMARY KEY)
- username (TEXT, UNIQUE)
- password (TEXT, hash bcrypt)
- created_at (DATETIME)

### Tabela `games`
- id (INTEGER, PRIMARY KEY)
- title (TEXT)
- description (TEXT)
- status (TEXT)
- completion (INTEGER, 0-100)
- play_time (INTEGER, em horas)
- technologies (TEXT)
- image_url (TEXT)
- github_url (TEXT)
- demo_url (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)

## 🎨 Customização

### Adicionar Novos Projetos

Você pode adicionar novos projetos diretamente no banco de dados ou criar uma interface admin. Os projetos de exemplo são criados automaticamente na primeira inicialização.

### Mudar Cores

Edite as variáveis CSS no arquivo `public/index.html` na seção `<style>` para personalizar o esquema de cores.

### Status Disponíveis

- Concluído (verde)
- Em Desenvolvimento (azul)
- Pausado (vermelho)
- Planejamento (laranja)

## 🔐 Segurança

- Senhas são armazenadas com hash bcrypt
- Autenticação via JWT com expiração de 24h
- Tokens armazenados no localStorage
- Todas as rotas de API protegidas (exceto login)

## 🚀 Próximas Melhorias (Sugestões)

- [ ] Interface para adicionar/editar projetos via UI
- [ ] Upload de imagens
- [ ] Filtros e busca de projetos
- [ ] Múltiplos usuários
- [ ] Exportar dados
- [ ] Dark/Light mode toggle
- [ ] Gráficos de progresso

## 📝 Licença

Projeto livre para uso pessoal e comercial.

---

Feito com ❤️ para organizar seus projetos de forma gamificada! 🎮
