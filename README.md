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

**Cliente (consumidor)**
- Autenticação real — registro e login com JWT, persistido via AsyncStorage
- Navegação em abas — Home, Favoritos, Pedidos, Mapa e Perfil
- Busca e filtro — pesquise restaurantes por nome ou tipo de culinária
- Favoritos sincronizados — salvos no banco de dados via API (requer login)
- Carrinho inteligente — proteção contra itens de múltiplos restaurantes
- Histórico de pedidos — com status (Entregue, Em andamento, Cancelado) via API
- Checkout completo — seleção de endereço e método de pagamento (Cartão, Pix, Dinheiro)
- Preferências do usuário — culinárias e restrições alimentares personalizáveis

**Parceiro (restaurante)**
- Login dedicado — toggle "Sou Restaurante" na tela de login
- Gerenciamento de cardápio — adicionar, editar e remover pratos com preço e categoria
- Pedidos recebidos — visualizar pedidos em tempo real e marcar como entregue ou cancelado
- Edição do restaurante — atualizar descrição, telefone, horários, endereço e foto

**Geral**
- Modo escuro / claro — alternável pelo perfil, com suporte automático ao sistema
- Animações fluidas — via Reanimated 4 e feedback tátil via Haptics

---

## 📱 Telas

**Área do cliente**

| Tela | Descrição |
|------|-----------|
| Login / Registro | Toggle cliente/parceiro, autenticação com e-mail e senha, fluxo integrado à API |
| Home | Listagem de restaurantes com busca, filtros por categoria e seções Destaques/Populares |
| Restaurante | Cardápio por categorias, avaliações e adição de itens ao carrinho |
| Carrinho | Visualização e edição de itens, cálculo de subtotal + taxa de entrega |
| Checkout | Endereço de entrega, método de pagamento e confirmação do pedido |
| Favoritos | Restaurantes salvos com opção de remover (sincronizado com o servidor) |
| Pedidos | Histórico completo com badges de status (dados reais da API) |
| Mapa | Lista de restaurantes próximos com distância |
| Perfil | Dados do usuário, preferências, restrições alimentares e configurações |

**Área do parceiro**

| Tela | Descrição |
|------|-----------|
| Cardápio | CRUD completo de pratos — adicionar, editar e remover itens do cardápio |
| Pedidos recebidos | Lista de pedidos do restaurante com ações "Entregue" e "Cancelar" |
| Meu Restaurante | Edição de dados do restaurante (nome, descrição, telefone, horário, foto) + logout |

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
│   │   │   ├── auth.js             # POST /auth/register, /auth/login, /auth/me, /auth/register-partner
│   │   │   ├── restaurants.js      # GET/PUT /restaurants/:id, CRUD /menu, GET /orders (parceiro)
│   │   │   ├── orders.js           # GET /orders, POST /orders, PATCH /:id/status
│   │   │   └── favorites.js        # GET/POST/DELETE /favorites/:id (protegido por JWT)
│   │   └── schemas/
│   │       ├── authSchema.js       # Zod schemas para registro de cliente e parceiro
│   │       ├── menuSchema.js       # Zod schemas para itens do cardápio e dados do restaurante
│   │       └── orderSchema.js      # Zod schema para criação de pedido
│   ├── .env.example                # Variáveis de ambiente necessárias
│   └── package.json
│
└── FRONTEND/                       # App mobile (React Native + Expo)
    ├── app/                        # Rotas (Expo Router)
    │   ├── (tabs)/                 # Área do cliente (abas)
    │   │   ├── index.tsx           # Home
    │   │   ├── favorites.tsx       # Favoritos
    │   │   ├── orders.tsx          # Pedidos
    │   │   ├── map.tsx             # Mapa
    │   │   └── profile.tsx         # Perfil
    │   ├── partner/                # Área do parceiro (abas)
    │   │   ├── menu.tsx            # Gerenciar cardápio (CRUD)
    │   │   ├── orders.tsx          # Pedidos recebidos
    │   │   └── restaurant.tsx      # Editar dados do restaurante
    │   ├── restaurant/[id].tsx     # Detalhes do restaurante (rota dinâmica)
    │   ├── login.tsx               # Tela de login / registro (cliente e parceiro)
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

**Autenticação**

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/register` | — | Cria conta de cliente e retorna JWT |
| POST | `/auth/register-partner` | — | Cria conta de parceiro vinculada a um restaurante |
| POST | `/auth/login` | — | Autentica (cliente ou parceiro) e retorna JWT |
| GET | `/auth/me` | ✅ | Retorna dados do usuário logado |

**Restaurantes (público)**

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/restaurants` | — | Lista restaurantes (filtros: `category`, `featured`, `popular`) |
| GET | `/restaurants/:id` | — | Detalhes de um restaurante |
| GET | `/restaurants/:id/menu` | — | Cardápio do restaurante |
| GET | `/restaurants/:id/reviews` | — | Avaliações do restaurante |

**Restaurantes (parceiro)**

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| PUT | `/restaurants/:id` | ✅ Parceiro | Edita dados do restaurante |
| POST | `/restaurants/:id/menu` | ✅ Parceiro | Adiciona item ao cardápio |
| PUT | `/restaurants/:id/menu/:itemId` | ✅ Parceiro | Edita item do cardápio |
| DELETE | `/restaurants/:id/menu/:itemId` | ✅ Parceiro | Remove item do cardápio |
| GET | `/restaurants/:id/orders` | ✅ Parceiro | Lista pedidos recebidos pelo restaurante |

**Pedidos**

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/orders` | ✅ | Pedidos do usuário logado |
| POST | `/orders` | ✅ | Cria novo pedido |
| PATCH | `/orders/:id/status` | ✅ Parceiro | Atualiza status do pedido (`entregue` / `cancelado`) |

**Favoritos**

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/favorites` | ✅ | Favoritos do usuário logado |
| POST | `/favorites/:restaurantId` | ✅ | Favorita um restaurante |
| DELETE | `/favorites/:restaurantId` | ✅ | Desfavorita um restaurante |

> Rotas marcadas com ✅ exigem o header `Authorization: Bearer <token>`.
> Rotas marcadas com ✅ Parceiro exigem token de um usuário com `role: "PARTNER"` dono do restaurante.

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
npx prisma migrate dev --name add_user_role

# Popule o banco com restaurantes, cardápios e usuários parceiros
node prisma/seed.js

# Inicie a API (porta 3001 por padrão)
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

> **Dispositivo físico:** o app precisa saber o IP da sua máquina na rede local para se comunicar com o backend. Configure-o em `FRONTEND/.env`:
> ```env
> EXPO_PUBLIC_API_URL=http://<IP_DA_SUA_MAQUINA>:3001
> ```
> Para descobrir seu IP, rode `ipconfig` (Windows) ou `ifconfig` (Mac/Linux) e use o endereço IPv4 da sua interface Wi-Fi.
>
> ⚠️ **Toda vez que mudar de rede Wi-Fi, seu IP pode mudar — lembre de atualizar o `FRONTEND/.env` e reiniciar o Expo com `npx expo start --clear`.**
>
> O emulador Android não precisa desse ajuste — ele acessa o host via `10.0.2.2` automaticamente.

### Rodando em cada plataforma

```bash
npx expo start --android   # Android
npx expo start --ios       # iOS (requer macOS)
npx expo start --web       # Web (modo preview)
```

---

## 🔑 Credenciais dos Parceiros (seed)

Após rodar o seed, cada restaurante tem uma conta parceiro criada automaticamente.
Todas usam a mesma senha: **`parceiro123`**

| Restaurante | E-mail |
|-------------|--------|
| Sabor & Brasa | `restaurante1@foodmatch.com` |
| Bella Pasta | `restaurante2@foodmatch.com` |
| Sushi Yama | `restaurante3@foodmatch.com` |
| Burger Point | `restaurante4@foodmatch.com` |
| Green Bowl | `restaurante5@foodmatch.com` |
| Sweet Paradise | `restaurante6@foodmatch.com` |
| Brunch & Co | `restaurante7@foodmatch.com` |
| Pizza Napoli | `restaurante9@foodmatch.com` |
| Taco Fiesta | `restaurante10@foodmatch.com` |
| Ramen House | `restaurante11@foodmatch.com` |
| Tokyo Fusion | `restaurante12@foodmatch.com` |
| El Mariachi | `restaurante13@foodmatch.com` |
| Shawarma Palace | `restaurante15@foodmatch.com` |
| Beirute Grill | `restaurante16@foodmatch.com` |
| Fast Bites | `restaurante18@foodmatch.com` |
| Vegan Delight | `restaurante21@foodmatch.com` |
| Oceano Azul | `restaurante24@foodmatch.com` |

> Para logar como parceiro, selecione **"Sou Restaurante"** na tela de login antes de inserir as credenciais.

---

## ⚙️ Variáveis de Ambiente (Backend)

Crie o arquivo `BACKEND/.env` com base em `.env.example`:

```env
DATABASE_URL="mysql://root:suasenha@localhost:3306/foodmatch"
JWT_SECRET="troque-por-uma-chave-secreta-forte"
PORT=3001
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
