<div align="center">

# 🍔 FoodMatch

Seu app de delivery favorito, feito com React Native + Expo

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-4.1-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

---

## ✨ Funcionalidades

- Autenticação real — registro e login com JWT, persistido via AsyncStorage
- Navegação em abas — Home, Favoritos, Pedidos, Mapa e Perfil
- Busca e filtro — pesquise restaurantes por nome ou tipo de culinária
- Favoritos sincronizados — salvos no banco de dados via API (requer login)
- Carrinho inteligente — proteção contra itens de múltiplos restaurantes
- Histórico de pedidos — com status (Entregue, Em andamento, Cancelado) via API
- Checkout completo — seleção de endereço e método de pagamento (Cartão, Pix, Dinheiro)
- Preferências do usuário — culinárias e restrições alimentares personalizáveis
- Modo escuro / claro — alternável pelo perfil, com suporte automático ao sistema
- Animações fluidas — via Reanimated 4 e feedback tátil via Haptics

---

## 📱 Telas

| Tela | Descrição |
|------|-----------|
| Login / Registro | Autenticação com e-mail e senha, fluxo completo integrado à API |
| Home | Listagem de restaurantes com busca, filtros por categoria e seções Destaques/Populares |
| Restaurante | Cardápio por categorias, avaliações e adição de itens ao carrinho |
| Carrinho | Visualização e edição de itens, cálculo de subtotal + taxa de entrega |
| Checkout | Endereço de entrega, método de pagamento e confirmação do pedido |
| Favoritos | Restaurantes salvos com opção de remover (sincronizado com o servidor) |
| Pedidos | Histórico completo com badges de status (dados reais da API) |
| Mapa | Lista de restaurantes próximos com distância |
| Perfil | Dados do usuário, preferências, restrições alimentares e configurações |

---

## 🛠 Stack

### Frontend
- [React](https://react.dev/) 19 + [React Native](https://reactnative.dev/) 0.81
- [Expo](https://expo.dev/) 54 + [Expo Router](https://expo.github.io/router/) 6 (file-based routing)
- [TypeScript](https://www.typescriptlang.org/) 5.9
- [NativeWind](https://www.nativewind.dev/) 4 (Tailwind CSS para React Native)
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- [Lucide React Native](https://lucide.dev/) (ícones)
- [@expo/vector-icons](https://icons.expo.fyi/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) 4
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) 2
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- React Context API + [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)

### Backend
- [Node.js](https://nodejs.org/) 18+ com ES Modules
- [Express](https://expressjs.com/) 4.19
- [Prisma ORM](https://www.prisma.io/) 5.22 + MySQL 8
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — autenticação JWT (7 dias de validade)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — hash de senhas
- [Zod](https://zod.dev/) — validação de schemas de entrada
- [cors](https://github.com/expressjs/cors) + [dotenv](https://github.com/motdotla/dotenv)

---

## 🗂 Estrutura do Projeto

```
FoodMatch_Mobile/
├── BACKEND/                        # API REST (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma           # Modelos: User, Restaurant, MenuItem, Order, Favorite, Review
│   │   ├── seed.js                 # Seed de dados iniciais (restaurantes + cardápios)
│   │   └── migrations/             # Histórico de migrações do banco
│   ├── src/
│   │   ├── server.js               # Entry point — Express + rotas registradas
│   │   ├── lib/
│   │   │   └── prisma.js           # Instância singleton do PrismaClient
│   │   ├── middlewares/
│   │   │   ├── authenticate.js     # Middleware JWT (Bearer token)
│   │   │   └── errorHandler.js     # Tratamento global de erros
│   │   ├── routes/
│   │   │   ├── auth.js             # POST /auth/register, POST /auth/login, GET /auth/me
│   │   │   ├── restaurants.js      # GET /restaurants, GET /restaurants/:id, /menu, /reviews
│   │   │   ├── orders.js           # GET /orders, POST /orders (protegido por JWT)
│   │   │   └── favorites.js        # GET/POST/DELETE /favorites/:id (protegido por JWT)
│   │   └── schemas/
│   │       ├── authSchema.js       # Zod schemas para registro e login
│   │       └── orderSchema.js      # Zod schema para criação de pedido
│   ├── .env.example                # Variáveis de ambiente necessárias
│   └── package.json
│
└── FRONTEND/                       # App mobile (React Native + Expo)
    ├── app/                        # Rotas (Expo Router)
    │   ├── (tabs)/                 # Grupo de abas
    │   │   ├── index.tsx           # Home
    │   │   ├── favorites.tsx       # Favoritos
    │   │   ├── orders.tsx          # Pedidos
    │   │   ├── map.tsx             # Mapa
    │   │   └── profile.tsx         # Perfil
    │   ├── restaurant/[id].tsx     # Detalhes do restaurante (rota dinâmica)
    │   ├── login.tsx               # Tela de login / registro
    │   ├── cart.tsx                # Carrinho
    │   ├── checkout.tsx            # Checkout
    │   └── order-confirmation.tsx  # Confirmação de pedido
    ├── components/                 # Componentes reutilizáveis
    ├── context/                    # Estado global (React Context)
    │   ├── CartContext.tsx
    │   ├── FavoritesContext.tsx
    │   ├── OrdersContext.tsx
    │   ├── ThemeContext.tsx
    │   └── UserPreferencesContext.tsx
    ├── services/
    │   └── api.ts                  # Cliente HTTP (apiFetch + gestão de token JWT)
    ├── data/                       # Dados mock (fallback / desenvolvimento)
    ├── types/                      # Tipagens TypeScript
    ├── hooks/                      # Custom hooks
    ├── constants/                  # Constantes da aplicação
    └── assets/                     # Imagens e ícones
```

---

## 🔌 API — Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/register` | — | Cria conta e retorna JWT |
| POST | `/auth/login` | — | Autentica e retorna JWT |
| GET | `/auth/me` | ✅ | Retorna dados do usuário logado |
| GET | `/restaurants` | — | Lista restaurantes (filtros: `category`, `featured`, `popular`) |
| GET | `/restaurants/:id` | — | Detalhes de um restaurante |
| GET | `/restaurants/:id/menu` | — | Cardápio do restaurante |
| GET | `/restaurants/:id/reviews` | — | Avaliações do restaurante |
| GET | `/orders` | ✅ | Pedidos do usuário logado |
| POST | `/orders` | ✅ | Cria novo pedido |
| GET | `/favorites` | ✅ | Favoritos do usuário logado |
| POST | `/favorites/:restaurantId` | ✅ | Favorita um restaurante |
| DELETE | `/favorites/:restaurantId` | ✅ | Desfavorita um restaurante |

> Rotas marcadas com ✅ exigem o header `Authorization: Bearer <token>`.

---

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- MySQL 8 rodando localmente
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Emulador Android/iOS *ou* o app [Expo Go](https://expo.dev/go) no celular

### 1. Backend

```bash
cd BACKEND

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do MySQL e um JWT_SECRET forte

# Instale as dependências
npm install

# Crie o banco e rode as migrações
npx prisma migrate dev

# Popule o banco com dados iniciais
npm run prisma:seed

# Inicie a API (porta 3000 por padrão)
npm run dev
```

### 2. Frontend

```bash
cd FRONTEND

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento (--clear limpa o cache do Metro)
npx expo start --clear
```

> **Dispositivo físico:** edite `FRONTEND/services/api.ts` e troque `API_URL` pelo IP da sua máquina (ex: `http://192.168.1.x:3000`). O emulador Android já usa `10.0.2.2:3000` automaticamente.

### Rodando em cada plataforma

```bash
npx expo start --android   # Android
npx expo start --ios       # iOS (requer macOS)
npx expo start --web       # Web (modo preview)
```

---

## ⚙️ Variáveis de Ambiente (Backend)

Crie o arquivo `BACKEND/.env` com base em `.env.example`:

```env
DATABASE_URL="mysql://root:suasenha@localhost:3306/foodmatch"
JWT_SECRET="troque-por-uma-chave-secreta-forte"
PORT=3000
```

---

### 🐛 Troubleshooting & Dicas

**Limpando o Cache:** O cache do Metro Bundler e dos emuladores às vezes pode causar comportamentos inesperados. Para iniciar com o cache zerado:

```bash
npx expo start --clear
```

**Descobrindo o erro "Something went wrong":** Se você estiver testando no Expo Go e aparecer a tela genérica de erro sem detalhes:

1. Com a aplicação ainda rodando, vá ao terminal.
2. Digite a tecla `w` para abrir a aplicação no navegador web.
3. Isso força o Expo a exibir o código de erro exato e o stack trace no terminal.

**Prisma Studio:** Para inspecionar o banco de dados visualmente:

```bash
cd BACKEND
npm run prisma:studio
```

---

## ⚙️ Configuração (Frontend)

O projeto usa **NativeWind v4** com o Metro configurado via [FRONTEND/metro.config.js](FRONTEND/metro.config.js) e Babel via [FRONTEND/babel.config.js](FRONTEND/babel.config.js). As classes Tailwind são processadas automaticamente a partir de [FRONTEND/global.css](FRONTEND/global.css).

Cores personalizadas definidas em [FRONTEND/tailwind.config.js](FRONTEND/tailwind.config.js):

| Token | Valor |
|-------|-------|
| primary | #ff4757 |
| primary-dark | #ff5252 |
| secondary | #ffe8e8 |
| accent | #ffd0d0 |
| foreground | #1a1a1a |

---

## 📄 Licença e Colaboradores

Este projeto é privado. Todos os direitos reservados a Diego Furtado, Isadora Batista e Roberto Campelo.
