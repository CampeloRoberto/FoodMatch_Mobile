<div align="center">

# 🍔 FoodMatch

**Seu app de delivery favorito, feito com React Native + Expo**

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-4.1-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## ✨ Funcionalidades

- **Navegação em abas** — Home, Favoritos, Pedidos, Mapa e Perfil
- **Busca e filtro** — pesquise restaurantes por nome ou tipo de culinária
- **Favoritos persistentes** — salvos no dispositivo via AsyncStorage
- **Carrinho inteligente** — proteção contra itens de múltiplos restaurantes
- **Histórico de pedidos** — com status (Entregue, Em andamento, Cancelado)
- **Checkout completo** — seleção de endereço e método de pagamento (Cartão, Pix, Dinheiro)
- **Preferências do usuário** — culinárias e restrições alimentares personalizáveis
- **Modo escuro / claro** — alternável pelo perfil, com suporte automático ao sistema
- **Animações fluidas** — via Reanimated 4 e feedback tátil via Haptics

---

## 📱 Telas

| Tela | Descrição |
|------|-----------|
| **Home** | Listagem de restaurantes com busca, filtros por categoria e seções Destaques/Populares |
| **Restaurante** | Cardápio por categorias, avaliações e adição de itens ao carrinho |
| **Carrinho** | Visualização e edição de itens, cálculo de subtotal + taxa de entrega |
| **Checkout** | Endereço de entrega, método de pagamento e confirmação do pedido |
| **Favoritos** | Restaurantes salvos com opção de remover |
| **Pedidos** | Histórico completo com badges de status |
| **Mapa** | Lista de restaurantes próximos com distância |
| **Perfil** | Dados do usuário, preferências, restrições alimentares e configurações |

---

## 🛠 Stack

### Core
- [React](https://react.dev/) 19 + [React Native](https://reactnative.dev/) 0.81
- [Expo](https://expo.dev/) 54 + [Expo Router](https://expo.github.io/router/) 6 (file-based routing)
- [TypeScript](https://www.typescriptlang.org/) 5.9

### UI & Estilo
- [NativeWind](https://www.nativewind.dev/) 4 (Tailwind CSS para React Native)
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- [Lucide React Native](https://lucide.dev/) (ícones)
- [@expo/vector-icons](https://icons.expo.fyi/)

### Animação & Gestos
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) 4
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) 2
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

### Estado & Persistência
- React Context API
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)

---

## 🗂 Estrutura do Projeto

```
FoodMatch_mobile/
├── app/                        # Rotas (Expo Router)
│   ├── (tabs)/                 # Grupo de abas
│   │   ├── index.tsx           # Home
│   │   ├── favorites.tsx       # Favoritos
│   │   ├── orders.tsx          # Pedidos
│   │   ├── map.tsx             # Mapa
│   │   └── profile.tsx         # Perfil
│   ├── restaurant/[id].tsx     # Detalhes do restaurante (rota dinâmica)
│   ├── cart.tsx                # Carrinho
│   ├── checkout.tsx            # Checkout
│   └── order-confirmation.tsx  # Confirmação de pedido
│
├── components/                 # Componentes reutilizáveis
│   ├── RestaurantCard.tsx      # Card de restaurante (featured e compact)
│   ├── CategoryPill.tsx        # Pílulas de filtro de categoria
│   ├── themed-text.tsx         # Texto com suporte a tema
│   └── themed-view.tsx         # View com suporte a tema
│
├── context/                    # Estado global (React Context)
│   ├── CartContext.tsx
│   ├── FavoritesContext.tsx
│   ├── OrdersContext.tsx
│   ├── ThemeContext.tsx
│   └── UserPreferencesContext.tsx
│
├── data/                       # Dados mock
│   ├── restaurants.ts
│   ├── menus.ts
│   ├── orders.ts
│   └── reviews.ts
│
├── types/                      # Tipagens TypeScript
├── hooks/                      # Custom hooks
├── constants/                  # Constantes da aplicação
└── assets/                     # Imagens e ícones
```

---

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Emulador Android/iOS **ou** o app [Expo Go](https://expo.dev/go) no celular

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/FoodMatch_mobile.git
cd FoodMatch_mobile

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento (--clear limpa o cache do Metro)
npx expo start --clear
```

### Rodando em cada plataforma

```bash
npx expo start --android   # Android
npx expo start --ios       # iOS (requer macOS)
npx expo start --web       # Web (modo preview)
```

---

## ⚙️ Configuração

O projeto usa **NativeWind v4** com o Metro configurado via [metro.config.js](metro.config.js) e Babel via [babel.config.js](babel.config.js). As classes Tailwind são processadas automaticamente a partir de [global.css](global.css).

Cores personalizadas definidas em [tailwind.config.js](tailwind.config.js):

| Token | Valor |
|-------|-------|
| `primary` | `#ff4757` |
| `primary-dark` | `#ff5252` |
| `secondary` | `#ffe8e8` |
| `accent` | `#ffd0d0` |
| `foreground` | `#1a1a1a` |

---

## 📄 Licença

Este projeto é privado. Todos os direitos reservados.
