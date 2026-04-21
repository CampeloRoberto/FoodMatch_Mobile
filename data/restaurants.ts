import type { Restaurant, RestaurantDetail } from "@/types";

export const featuredRestaurant: Restaurant = {
  id: 1,
  name: "Sabor & Brasa",
  rating: 4.5,
  distance: "500m",
  category: "Churrascaria",
  priceRange: "$$",
  image:
    "https://images.unsplash.com/photo-1758157835975-1cb4947750df?w=800&q=80",
};

export const popularRestaurants: Restaurant[] = [
  {
    id: 2,
    name: "Bella Pasta",
    rating: 4.7,
    distance: "1.2km",
    category: "Italiana",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1680405229153-a753d043c4ec?w=400&q=80",
  },
  {
    id: 3,
    name: "Sushi Yama",
    rating: 4.6,
    distance: "2.0km",
    category: "Japonesa",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1770164520620-a5612325635b?w=400&q=80",
  },
  {
    id: 4,
    name: "Burger Point",
    rating: 4.5,
    distance: "800m",
    category: "Fast Food",
    priceRange: "$",
    image:
      "https://images.unsplash.com/photo-1632898657999-ae6920976661?w=400&q=80",
  },
  {
    id: 5,
    name: "Green Bowl",
    rating: 4.8,
    distance: "1.5km",
    category: "Vegana",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=400&q=80",
  },
];

export const allRestaurants: Restaurant[] = [
  {
    id: 9,
    name: "Pizza Napoli",
    rating: 4.7,
    distance: "1.3km",
    category: "Italiana",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
  },
  {
    id: 6,
    name: "Sweet Paradise",
    rating: 4.9,
    distance: "1.8km",
    category: "Italiana",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?w=800&q=80",
  },
  {
    id: 11,
    name: "Ramen House",
    rating: 4.8,
    distance: "2.5km",
    category: "Japonesa",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1766159965163-5161138071fe?w=800&q=80",
  },
  {
    id: 12,
    name: "Tokyo Fusion",
    rating: 4.9,
    distance: "1.1km",
    category: "Japonesa",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
  },
  {
    id: 10,
    name: "Taco Fiesta",
    rating: 4.5,
    distance: "1.7km",
    category: "Mexicana",
    priceRange: "$",
    image:
      "https://images.unsplash.com/photo-1707603571504-86c1ea50903e?w=800&q=80",
  },
  {
    id: 13,
    name: "El Mariachi",
    rating: 4.6,
    distance: "2.3km",
    category: "Mexicana",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&q=80",
  },
  {
    id: 15,
    name: "Shawarma Palace",
    rating: 4.8,
    distance: "1.4km",
    category: "Árabe",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80",
  },
  {
    id: 16,
    name: "Beirute Grill",
    rating: 4.6,
    distance: "2.1km",
    category: "Árabe",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&q=80",
  },
  {
    id: 18,
    name: "Fast Bites",
    rating: 4.3,
    distance: "700m",
    category: "Fast Food",
    priceRange: "$",
    image:
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80",
  },
  {
    id: 21,
    name: "Vegan Delight",
    rating: 4.7,
    distance: "1.8km",
    category: "Vegana",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  },
  {
    id: 24,
    name: "Oceano Azul",
    rating: 4.8,
    distance: "2.2km",
    category: "Frutos do Mar",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1559737558-2f5a555b8a87?w=800&q=80",
  },
  {
    id: 7,
    name: "Brunch & Co",
    rating: 4.4,
    distance: "900m",
    category: "Café da Manhã",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1627024522062-423243235d50?w=800&q=80",
  },
];

export const favoriteRestaurants: Restaurant[] = [
  {
    id: 2,
    name: "Bella Pasta",
    rating: 4.7,
    distance: "1.2km",
    category: "Italiana",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1680405229153-a753d043c4ec?w=800&q=80",
  },
  {
    id: 3,
    name: "Sushi Yama",
    rating: 4.6,
    distance: "2.0km",
    category: "Japonesa",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1770164520620-a5612325635b?w=800&q=80",
  },
  {
    id: 6,
    name: "Sweet Paradise",
    rating: 4.9,
    distance: "1.8km",
    category: "Sobremesas",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?w=800&q=80",
  },
];

export const nearbyRestaurants = [
  { id: 1, name: "Sabor & Brasa", distance: "500m" },
  { id: 2, name: "Bella Pasta", distance: "1.2km" },
  { id: 3, name: "Sushi Yama", distance: "2.0km" },
  { id: 4, name: "Burger Point", distance: "800m" },
  { id: 5, name: "Green Bowl", distance: "1.5km" },
];

export const allRestaurantsById: Record<number, Restaurant> = [
  featuredRestaurant,
  ...popularRestaurants,
  ...allRestaurants,
].reduce((acc, r) => ({ ...acc, [r.id]: r }), {});

export function findRestaurantById(id: number): Restaurant | undefined {
  return allRestaurantsById[id];
}

export const restaurantDetails: Record<number, RestaurantDetail> = {
  1: { restaurantId: 1, address: "Av. Paulista, 1000 – Bela Vista, SP", phone: "(11) 3456-7890", hours: "Ter–Dom: 12h–23h", description: "Churrascaria premium com cortes nobres selecionados diretamente do produtor. Ambiente rústico e aconchegante, perfeito para reuniões em família." },
  2: { restaurantId: 2, address: "Rua Augusta, 520 – Consolação, SP", phone: "(11) 3321-4567", hours: "Seg–Dom: 12h–23h", description: "Restaurante italiano familiar fundado em 2005. Massa fresca artesanal produzida diariamente com farinha importada. Receitas da nonna com toque contemporâneo." },
  3: { restaurantId: 3, address: "Rua Tomás González, 78 – Liberdade, SP", phone: "(11) 3272-9900", hours: "Ter–Dom: 12h–22h30", description: "Sushiaki autêntico com peixes frescos importados três vezes por semana do Japão. Ambiente minimalista inspirado nos restaurantes de Tóquio." },
  4: { restaurantId: 4, address: "Rua Oscar Freire, 233 – Jardins, SP", phone: "(11) 3064-1122", hours: "Seg–Dom: 11h–00h", description: "A melhor hamburgeria artesanal da cidade. Hambúrgueres smash na chapa de ferro, ingredientes selecionados e molhos autorais feitos na casa." },
  5: { restaurantId: 5, address: "Al. Franca, 711 – Jardins, SP", phone: "(11) 3887-5500", hours: "Seg–Sáb: 10h–22h", description: "Cozinha plant-based criativa que prova que comida vegana pode ser saborosa e nutritiva. Ingredientes orgânicos de produtores locais." },
  6: { restaurantId: 6, address: "Rua Haddock Lobo, 400 – Cerqueira César, SP", phone: "(11) 3062-8800", hours: "Ter–Dom: 14h–22h", description: "Confeitaria e café especializado em sobremesas artesanais. O paraíso dos doces para quem adora um bom café da tarde." },
  7: { restaurantId: 7, address: "Rua Padre João Manuel, 199 – Jardins, SP", phone: "(11) 3081-7755", hours: "Seg–Dom: 08h–16h", description: "O melhor café da manhã e brunch da cidade. Ovos beneditinos, panquecas artesanais e cafés especiais de origem para começar bem o dia." },
  9: { restaurantId: 9, address: "Rua Bela Cintra, 987 – Consolação, SP", phone: "(11) 3159-6644", hours: "Ter–Dom: 18h–23h30", description: "Pizzaria napolitana com forno a lenha importado da Itália. Massa de fermentação lenta de 48h, tomates San Marzano DOP e mozzarella de búfala campana." },
  10: { restaurantId: 10, address: "Rua Pamplona, 145 – Jardim Paulista, SP", phone: "(11) 3253-4411", hours: "Seg–Dom: 11h–22h", description: "Autêntica taqueria mexicana com receitas tradicionais de Oaxaca. Tortilhas feitas na hora, ingredientes frescos e salsas artesanais picantes." },
  11: { restaurantId: 11, address: "Rua da Consolação, 3400 – Consolação, SP", phone: "(11) 3675-8822", hours: "Ter–Dom: 12h–22h", description: "Ramen house especializada em caldos japoneses de fermentação lenta. Cada caldo leva 18 horas para ficar pronto." },
  12: { restaurantId: 12, address: "Rua Galvão Bueno, 466 – Liberdade, SP", phone: "(11) 3341-9900", hours: "Seg–Dom: 11h30–22h30", description: "Fusão japonesa contemporânea com ingredientes brasileiros premium. Criatividade e tradição em cada prato." },
  13: { restaurantId: 13, address: "Rua dos Pinheiros, 888 – Pinheiros, SP", phone: "(11) 3064-7733", hours: "Seg–Dom: 12h–23h", description: "O El Mariachi traz a alma do México para São Paulo. Margaritas, tequilas premium e os melhores tacos al pastor da cidade." },
  15: { restaurantId: 15, address: "Rua Fradique Coutinho, 550 – Pinheiros, SP", phone: "(11) 3812-4466", hours: "Seg–Dom: 11h–22h", description: "Culinária árabe autêntica com receitas de família de segunda geração. Shawarmas, esfihas e mezzes preparados com temperos importados." },
  16: { restaurantId: 16, address: "Rua dos Três Irmãos, 210 – Vila Madalena, SP", phone: "(11) 3031-2255", hours: "Ter–Dom: 12h–22h", description: "Experiência gastronômica libanesa completa. Do mezze ao baklava, cada prato carrega a hospitalidade e a riqueza da cozinha do Líbano." },
  18: { restaurantId: 18, address: "Av. Rebouças, 1100 – Pinheiros, SP", phone: "(11) 3068-9977", hours: "Seg–Dom: 10h–23h", description: "Fast food artesanal com ingredientes frescos. Sanduba na hora, batata crocante e opções rápidas sem abrir mão do sabor." },
  21: { restaurantId: 21, address: "Rua Harmonia, 333 – Vila Madalena, SP", phone: "(11) 3815-6633", hours: "Seg–Sáb: 11h–21h", description: "Gastronomia vegana de alta qualidade. Pratos elaborados, coloridos e repletos de nutrientes que satisfazem qualquer paladar." },
  24: { restaurantId: 24, address: "Rua Iguatemi, 192 – Itaim Bibi, SP", phone: "(11) 3078-4411", hours: "Ter–Dom: 12h–23h", description: "Restaurante de frutos do mar com ingredientes frescos trazidos diretamente do litoral paulista. Especialidade em peixe grelhado e caldeirada." },
};

export function getRestaurantDetail(id: number): RestaurantDetail | undefined {
  return restaurantDetails[id];
}

export const cuisineIcons: Record<string, string> = {
  Italiana: "🇮🇹",
  Japonesa: "🍣",
  Mexicana: "🌮",
  Vegana: "🥗",
  "Frutos do Mar": "🦐",
  Árabe: "🥙",
  "Fast Food": "🍔",
  Brasileira: "🇧🇷",
  Chinesa: "🥡",
  Vegetariana: "🌱",
};
