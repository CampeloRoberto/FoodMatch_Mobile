import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const restaurants = [
  { id: 1,  name: "Sabor & Brasa",    rating: 4.5, distance: "500m",  category: "Brasileira",     priceRange: "$$",  image: "https://images.unsplash.com/photo-1758157835975-1cb4947750df?w=800&q=80", address: "Av. Paulista, 1000 – Bela Vista, SP",          phone: "(11) 3456-7890", hours: "Ter–Dom: 12h–23h",  description: "Churrascaria premium com cortes nobres selecionados diretamente do produtor. Ambiente rústico e aconchegante, perfeito para reuniões em família.", featured: true,  popular: false },
  { id: 2,  name: "Bella Pasta",      rating: 4.7, distance: "1.2km", category: "Italiana",       priceRange: "$$",  image: "https://images.unsplash.com/photo-1680405229153-a753d043c4ec?w=400&q=80", address: "Rua Augusta, 520 – Consolação, SP",            phone: "(11) 3321-4567", hours: "Seg–Dom: 12h–23h",  description: "Restaurante italiano familiar fundado em 2005. Massa fresca artesanal produzida diariamente com farinha importada. Receitas da nonna com toque contemporâneo.", featured: false, popular: true  },
  { id: 3,  name: "Sushi Yama",       rating: 4.6, distance: "2.0km", category: "Japonesa",       priceRange: "$$$", image: "https://images.unsplash.com/photo-1770164520620-a5612325635b?w=400&q=80", address: "Rua Tomás González, 78 – Liberdade, SP",       phone: "(11) 3272-9900", hours: "Ter–Dom: 12h–22h30", description: "Sushiaki autêntico com peixes frescos importados três vezes por semana do Japão. Ambiente minimalista inspirado nos restaurantes de Tóquio.", featured: false, popular: true  },
  { id: 4,  name: "Burger Point",     rating: 4.5, distance: "800m",  category: "Fast Food",      priceRange: "$",   image: "https://images.unsplash.com/photo-1632898657999-ae6920976661?w=400&q=80", address: "Rua Oscar Freire, 233 – Jardins, SP",          phone: "(11) 3064-1122", hours: "Seg–Dom: 11h–00h",  description: "A melhor hamburgeria artesanal da cidade. Hambúrgueres smash na chapa de ferro, ingredientes selecionados e molhos autorais feitos na casa.", featured: false, popular: true  },
  { id: 5,  name: "Green Bowl",       rating: 4.8, distance: "1.5km", category: "Vegana",         priceRange: "$$",  image: "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=400&q=80", address: "Al. Franca, 711 – Jardins, SP",               phone: "(11) 3887-5500", hours: "Seg–Sáb: 10h–22h",  description: "Cozinha plant-based criativa que prova que comida vegana pode ser saborosa e nutritiva. Ingredientes orgânicos de produtores locais.", featured: false, popular: true  },
  { id: 6,  name: "Sweet Paradise",   rating: 4.9, distance: "1.8km", category: "Italiana",       priceRange: "$$",  image: "https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?w=800&q=80", address: "Rua Haddock Lobo, 400 – Cerqueira César, SP", phone: "(11) 3062-8800", hours: "Ter–Dom: 14h–22h",  description: "Confeitaria e café especializado em sobremesas artesanais. O paraíso dos doces para quem adora um bom café da tarde.", featured: false, popular: false },
  { id: 7,  name: "Brunch & Co",      rating: 4.4, distance: "900m",  category: "Café da Manhã",  priceRange: "$$",  image: "https://images.unsplash.com/photo-1627024522062-423243235d50?w=800&q=80", address: "Rua Padre João Manuel, 199 – Jardins, SP",    phone: "(11) 3081-7755", hours: "Seg–Dom: 08h–16h",  description: "O melhor café da manhã e brunch da cidade. Ovos beneditinos, panquecas artesanais e cafés especiais de origem para começar bem o dia.", featured: false, popular: false },
  { id: 9,  name: "Pizza Napoli",     rating: 4.7, distance: "1.3km", category: "Italiana",       priceRange: "$$",  image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80", address: "Rua Bela Cintra, 987 – Consolação, SP",       phone: "(11) 3159-6644", hours: "Ter–Dom: 18h–23h30", description: "Pizzaria napolitana com forno a lenha importado da Itália. Massa de fermentação lenta de 48h, tomates San Marzano DOP e mozzarella de búfala campana.", featured: false, popular: false },
  { id: 10, name: "Taco Fiesta",      rating: 4.5, distance: "1.7km", category: "Mexicana",       priceRange: "$",   image: "https://images.unsplash.com/photo-1707603571504-86c1ea50903e?w=800&q=80", address: "Rua Pamplona, 145 – Jardim Paulista, SP",    phone: "(11) 3253-4411", hours: "Seg–Dom: 11h–22h",  description: "Autêntica taqueria mexicana com receitas tradicionais de Oaxaca. Tortilhas feitas na hora, ingredientes frescos e salsas artesanais picantes.", featured: false, popular: false },
  { id: 11, name: "Ramen House",      rating: 4.8, distance: "2.5km", category: "Japonesa",       priceRange: "$$",  image: "https://images.unsplash.com/photo-1766159965163-5161138071fe?w=800&q=80", address: "Rua da Consolação, 3400 – Consolação, SP",   phone: "(11) 3675-8822", hours: "Ter–Dom: 12h–22h",  description: "Ramen house especializada em caldos japoneses de fermentação lenta. Cada caldo leva 18 horas para ficar pronto.", featured: false, popular: false },
  { id: 12, name: "Tokyo Fusion",     rating: 4.9, distance: "1.1km", category: "Japonesa",       priceRange: "$$$", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80", address: "Rua Galvão Bueno, 466 – Liberdade, SP",      phone: "(11) 3341-9900", hours: "Seg–Dom: 11h30–22h30", description: "Fusão japonesa contemporânea com ingredientes brasileiros premium. Criatividade e tradição em cada prato.", featured: false, popular: false },
  { id: 13, name: "El Mariachi",      rating: 4.6, distance: "2.3km", category: "Mexicana",       priceRange: "$$",  image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&q=80", address: "Rua dos Pinheiros, 888 – Pinheiros, SP",     phone: "(11) 3064-7733", hours: "Seg–Dom: 12h–23h",  description: "O El Mariachi traz a alma do México para São Paulo. Margaritas, tequilas premium e os melhores tacos al pastor da cidade.", featured: false, popular: false },
  { id: 15, name: "Shawarma Palace",  rating: 4.8, distance: "1.4km", category: "Árabe",          priceRange: "$$",  image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80", address: "Rua Fradique Coutinho, 550 – Pinheiros, SP", phone: "(11) 3812-4466", hours: "Seg–Dom: 11h–22h",  description: "Culinária árabe autêntica com receitas de família de segunda geração. Shawarmas, esfihas e mezzes preparados com temperos importados.", featured: false, popular: false },
  { id: 16, name: "Beirute Grill",    rating: 4.6, distance: "2.1km", category: "Árabe",          priceRange: "$$",  image: "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&q=80", address: "Rua dos Três Irmãos, 210 – Vila Madalena, SP", phone: "(11) 3031-2255", hours: "Ter–Dom: 12h–22h", description: "Experiência gastronômica libanesa completa. Do mezze ao baklava, cada prato carrega a hospitalidade e a riqueza da cozinha do Líbano.", featured: false, popular: false },
  { id: 18, name: "Fast Bites",       rating: 4.3, distance: "700m",  category: "Fast Food",      priceRange: "$",   image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80", address: "Av. Rebouças, 1100 – Pinheiros, SP",         phone: "(11) 3068-9977", hours: "Seg–Dom: 10h–23h",  description: "Fast food artesanal com ingredientes frescos. Sanduba na hora, batata crocante e opções rápidas sem abrir mão do sabor.", featured: false, popular: false },
  { id: 21, name: "Vegan Delight",    rating: 4.7, distance: "1.8km", category: "Vegana",         priceRange: "$$",  image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80", address: "Rua Harmonia, 333 – Vila Madalena, SP",      phone: "(11) 3815-6633", hours: "Seg–Sáb: 11h–21h",  description: "Gastronomia vegana de alta qualidade. Pratos elaborados, coloridos e repletos de nutrientes que satisfazem qualquer paladar.", featured: false, popular: false },
  { id: 24, name: "Oceano Azul",      rating: 4.8, distance: "2.2km", category: "Frutos do Mar",  priceRange: "$$$", image: "https://images.unsplash.com/photo-1559737558-2f5a555b8a87?w=800&q=80", address: "Rua Iguatemi, 192 – Itaim Bibi, SP",        phone: "(11) 3078-4411", hours: "Ter–Dom: 12h–23h",  description: "Restaurante de frutos do mar com ingredientes frescos trazidos diretamente do litoral paulista. Especialidade em peixe grelhado e caldeirada.", featured: false, popular: false },
];

const menuItems = [
  // Sabor & Brasa (1)
  { id: 101, restaurantId: 1, category: "Entradas",        name: "Pão de Alho",         description: "Pão artesanal grelhado com manteiga de alho e ervas finas",                              price: 18.90, image: "https://images.unsplash.com/photo-1619372280082-a4e63c1f9fe4?w=400&q=80" },
  { id: 102, restaurantId: 1, category: "Entradas",        name: "Linguiça Artesanal",  description: "Linguiça de costela defumada com molho chimichurri caseiro",                            price: 34.90, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" },
  { id: 103, restaurantId: 1, category: "Pratos Principais", name: "Picanha Grelhada",  description: "Picanha Prime 300g grelhada na brasa com arroz, farofa e vinagrete",                   price: 89.90, image: "https://images.unsplash.com/photo-1558030137-a56c1b003d35?w=400&q=80" },
  { id: 104, restaurantId: 1, category: "Pratos Principais", name: "Costela no Bafo",   description: "Costela bovina assada por 12h com mandioca cozida e farofa de bacon",                  price: 79.90, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
  { id: 105, restaurantId: 1, category: "Pratos Principais", name: "Fraldinha Especial", description: "Fraldinha temperada no sal grosso com arroz, feijão e couve refogada",                price: 69.90, image: "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=80" },
  { id: 106, restaurantId: 1, category: "Bebidas",         name: "Caipirinha de Limão", description: "Caipirinha clássica com cachaça artesanal e limão tahiti",                              price: 22.90, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80" },
  { id: 107, restaurantId: 1, category: "Bebidas",         name: "Suco de Maracujá",    description: "Suco natural de maracujá com açúcar e gelo",                                           price: 14.90, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80" },
  { id: 108, restaurantId: 1, category: "Sobremesas",      name: "Pudim de Leite",      description: "Pudim de leite condensado caseiro com calda de caramelo",                               price: 19.90, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80" },
  // Bella Pasta (2)
  { id: 201, restaurantId: 2, category: "Entradas",        name: "Bruschetta Clássica", description: "Fatias de ciabatta grelhadas com tomate, manjericão e azeite extra virgem",            price: 28.90, image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80" },
  { id: 202, restaurantId: 2, category: "Entradas",        name: "Carpaccio de Carne",  description: "Filet mignon fatiado com rúcula, parmesão e molho de mostarda Dijon",                  price: 39.90, image: "https://images.unsplash.com/photo-1626200926547-3f3faefa4fa9?w=400&q=80" },
  { id: 203, restaurantId: 2, category: "Pratos Principais", name: "Tagliatelle al Ragù", description: "Massa fresca artesanal com ragù de carne bovina cozido lentamente e parmesão",       price: 58.90, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80" },
  { id: 204, restaurantId: 2, category: "Pratos Principais", name: "Fettuccine Carbonara", description: "Fettuccine com pancetta, ovos frescos, parmesão e pimenta-do-reino",               price: 52.90, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80" },
  { id: 205, restaurantId: 2, category: "Pratos Principais", name: "Risotto ai Funghi", description: "Risoto cremoso com mix de cogumelos porcini, shiitake e trufas negras",                price: 68.90, image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80" },
  { id: 206, restaurantId: 2, category: "Bebidas",         name: "Vinho Tinto da Casa", description: "Taça de vinho tinto italiano selecionado pelo sommelier",                               price: 32.90, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80" },
  { id: 207, restaurantId: 2, category: "Sobremesas",      name: "Tiramisù",            description: "Tiramisù clássico com mascarpone, café espresso e cacau em pó",                        price: 29.90, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80" },
  { id: 208, restaurantId: 2, category: "Sobremesas",      name: "Panna Cotta",         description: "Panna cotta de baunilha com coulis de frutas vermelhas frescas",                       price: 24.90, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" },
  // Sushi Yama (3)
  { id: 301, restaurantId: 3, category: "Entradas",        name: "Gyoza (8 un)",        description: "Guioza de frango e legumes, grelhado, com molho ponzu e gengibre",                     price: 34.90, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80" },
  { id: 302, restaurantId: 3, category: "Entradas",        name: "Edamame",             description: "Soja verde cozida no vapor com flor de sal defumado",                                  price: 19.90, image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&q=80" },
  { id: 303, restaurantId: 3, category: "Pratos Principais", name: "Combo Sushi 16 peças", description: "4 niguiri atum, 4 niguiri salmão, 4 hot roll crocante, 4 uramaki skin",            price: 79.90, image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80" },
  { id: 304, restaurantId: 3, category: "Pratos Principais", name: "Temaki Salmão",     description: "Temaki de salmão fresco, cream cheese, cebolinha e ovas de peixe",                    price: 32.90, image: "https://images.unsplash.com/photo-1584653535665-caa80d37ef5c?w=400&q=80" },
  { id: 305, restaurantId: 3, category: "Pratos Principais", name: "Ramen de Porco",    description: "Caldo tonkotsu cozido por 12h, barriga de porco, ovo marinado e nori",                price: 54.90, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80" },
  { id: 306, restaurantId: 3, category: "Bebidas",         name: "Sake Quente",         description: "Sake tradicional japonês Junmai servido quente em copo de cerâmica",                   price: 28.90, image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=400&q=80" },
  { id: 307, restaurantId: 3, category: "Bebidas",         name: "Chá Verde Gelado",    description: "Chá verde sencha com gelo, limão e hortelã",                                           price: 12.90, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80" },
  { id: 308, restaurantId: 3, category: "Sobremesas",      name: "Mochi de Matcha",     description: "Mochi artesanal recheado com sorvete de matcha premium",                               price: 22.90, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80" },
  // Burger Point (4)
  { id: 401, restaurantId: 4, category: "Entradas",        name: "Onion Rings (8 un)",  description: "Anéis de cebola empanados e fritos com molho ranch caseiro",                           price: 24.90, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80" },
  { id: 402, restaurantId: 4, category: "Entradas",        name: "Batata Frita Cheddar", description: "Batatas fritas crocantes com cheddar derretido e bacon bits tostado",                price: 29.90, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
  { id: 403, restaurantId: 4, category: "Pratos Principais", name: "Classic Smash Burger", description: "Smash duplo 180g, queijo americano, alface, tomate e molho especial da casa",      price: 42.90, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 404, restaurantId: 4, category: "Pratos Principais", name: "BBQ Bacon Burger",  description: "Hambúrguer 200g, cheddar, bacon crocante, cebola caramelizada e molho BBQ defumado",  price: 49.90, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
  { id: 405, restaurantId: 4, category: "Pratos Principais", name: "Veggie Burger",     description: "Hambúrguer de grão-de-bico e quinoa com guacamole, tomate e alface crespa",          price: 38.90, image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&q=80" },
  { id: 406, restaurantId: 4, category: "Bebidas",         name: "Milkshake de Chocolate", description: "Milkshake cremoso de chocolate belga 70% cacau com chantilly e calda",             price: 22.90, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
  { id: 407, restaurantId: 4, category: "Bebidas",         name: "Refrigerante Lata",   description: "Coca-Cola, Guaraná Antarctica ou Sprite 350ml gelado",                                price: 8.90,  image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&q=80" },
  { id: 408, restaurantId: 4, category: "Sobremesas",      name: "Cookie Quente",       description: "Cookie gigante de chocolate chip quentinho servido com sorvete de baunilha",          price: 19.90, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80" },
  // Green Bowl (5)
  { id: 501, restaurantId: 5, category: "Entradas",        name: "Carpaccio de Beterraba", description: "Beterraba assada fatiada com nozes, rúcula e vinagrete de laranja siciliana",      price: 26.90, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { id: 502, restaurantId: 5, category: "Entradas",        name: "Hummus com Pita",     description: "Homus artesanal de grão-de-bico com azeite, páprica defumada e pão pita quentinho",  price: 22.90, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
  { id: 503, restaurantId: 5, category: "Pratos Principais", name: "Buddha Bowl",       description: "Quinoa, grão-de-bico assado, abacate, cenoura roxa e molho tahini de limão",        price: 45.90, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { id: 504, restaurantId: 5, category: "Pratos Principais", name: "Curry de Grão-de-bico", description: "Curry aromático com grão-de-bico, espinafre, leite de coco e arroz basmati",    price: 42.90, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80" },
  { id: 505, restaurantId: 5, category: "Pratos Principais", name: "Tacos de Jackfruit", description: "3 tacos de jackfruit desfiado temperado no achiote com guacamole e pico de gallo", price: 38.90, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
  { id: 506, restaurantId: 5, category: "Bebidas",         name: "Smoothie Verde",      description: "Espinafre, maçã verde, gengibre, pepino e limão siciliano",                          price: 18.90, image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80" },
  { id: 507, restaurantId: 5, category: "Bebidas",         name: "Kombucha de Hibisco", description: "Kombucha artesanal de hibisco com frutas vermelhas, levemente gaseificado",          price: 16.90, image: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&q=80" },
  { id: 508, restaurantId: 5, category: "Sobremesas",      name: "Brownie de Tâmaras",  description: "Brownie raw vegano de cacau 80% e tâmaras Medjool com sorvete de coco",             price: 21.90, image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&q=80" },
  // Pizza Napoli (9)
  { id: 901, restaurantId: 9, category: "Entradas",        name: "Focaccia al Rosmarino", description: "Focaccia artesanal com alecrim fresco, sal grosso e azeite extra virgem",          price: 22.90, image: "https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=400&q=80" },
  { id: 902, restaurantId: 9, category: "Entradas",        name: "Antipasto Misto",     description: "Mix de frios italianos: salame Napoli, prosciutto, azeitonas e queijos curados",     price: 49.90, image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=80" },
  { id: 903, restaurantId: 9, category: "Pratos Principais", name: "Pizza Margherita",  description: "Molho de tomate San Marzano, mozzarella de búfala fresca e manjericão",             price: 59.90, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
  { id: 904, restaurantId: 9, category: "Pratos Principais", name: "Pizza Quattro Formaggi", description: "Quatro queijos: mozzarella, gorgonzola DOP, parmesão 24m e provolone",         price: 69.90, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { id: 905, restaurantId: 9, category: "Pratos Principais", name: "Pizza Diavola",     description: "Molho de tomate, salame picante, mozzarella, pimenta calabresa e mel de abelha",   price: 64.90, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80" },
  { id: 906, restaurantId: 9, category: "Bebidas",         name: "Negroni",             description: "Coquetel clássico com gin London Dry, Campari e vermute rosso",                      price: 34.90, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80" },
  { id: 907, restaurantId: 9, category: "Bebidas",         name: "Limonata Siciliana",  description: "Limonada artesanal com limão siciliano, hortelã e água com gás San Pellegrino",     price: 14.90, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80" },
  { id: 908, restaurantId: 9, category: "Sobremesas",      name: "Cannoli Siciliano",   description: "Cannoli crocante artesanal recheado com ricota adocicada e gotas de chocolate",     price: 27.90, image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&q=80" },
];

const reviews = [
  { id: 1,  restaurantId: 1, userName: "Carlos M.",    rating: 5, comment: "Picanha perfeita! Ponto exato, suculenta demais. Melhor churrasco da cidade sem dúvida." },
  { id: 2,  restaurantId: 1, userName: "Ana Paula",    rating: 4, comment: "Costela no bafo sensacional, desmanchando. Só achei o tempo de espera um pouco longo." },
  { id: 3,  restaurantId: 1, userName: "Fernando K.",  rating: 5, comment: "Fui no aniversário da minha esposa e não nos decepcionamos. Atendimento impecável!" },
  { id: 4,  restaurantId: 1, userName: "Bruna S.",     rating: 4, comment: "Caipirinha artesanal é incrível. A carne veio no ponto certo. Voltarei com certeza." },
  { id: 5,  restaurantId: 1, userName: "Rafael T.",    rating: 5, comment: "Pão de alho como entrada é de outro nível. Porcão enorme e preço justo para a qualidade." },
  { id: 6,  restaurantId: 2, userName: "Giovanna L.",  rating: 5, comment: "Tagliatelle al ragù é simplesmente divino. Massa fresca artesanal, ragù cozido lentamente. Voltei 3 vezes esse mês!" },
  { id: 7,  restaurantId: 2, userName: "Pedro H.",     rating: 5, comment: "Melhor carbonara que já comi fora da Itália. Cremosa, sem creme de leite, do jeito tradicional." },
  { id: 8,  restaurantId: 2, userName: "Mariana F.",   rating: 4, comment: "Tiramisù maravilhoso. O risotto estava um pouco salgado pra mim mas o serviço compensou." },
  { id: 9,  restaurantId: 2, userName: "Thiago N.",    rating: 5, comment: "Vinho da casa surpreendeu positivamente. Ambiente romântico, perfeito para jantar a dois." },
  { id: 10, restaurantId: 3, userName: "Yuki A.",      rating: 5, comment: "Salmão fresco de verdade! O combo 16 peças vale muito o preço. Skin é irresistível." },
  { id: 11, restaurantId: 3, userName: "Camila R.",    rating: 4, comment: "Ramen de porco com caldo rico e profundo. Único porém é que o tempero é bem forte." },
  { id: 12, restaurantId: 3, userName: "Lucas V.",     rating: 5, comment: "Gyoza perfeita, crocante por fora e suculenta por dentro. Mochi de matcha é incrível." },
  { id: 13, restaurantId: 3, userName: "Isabela C.",   rating: 4, comment: "Ótima qualidade do peixe. O edamame poderia ter mais flor de sal. No geral excelente!" },
  { id: 14, restaurantId: 4, userName: "Diego M.",     rating: 5, comment: "BBQ Bacon Burger é o hambúrguer da minha vida. Cebola caramelizada + cheddar + bacon = perfeição." },
  { id: 15, restaurantId: 4, userName: "Leticia P.",   rating: 4, comment: "Smash burger bem executado, bem crocante nas bordas. Batata frita cheddar chegou quentinha, top!" },
  { id: 16, restaurantId: 4, userName: "Gabriel O.",   rating: 3, comment: "Lanche bom, mas demorou 45 min para chegar. Para fast food esperava mais rapidez." },
  { id: 17, restaurantId: 4, userName: "Priscila M.",  rating: 5, comment: "Veggie burger me surpreendeu muito! Não parece que falta carne. Milkshake de chocolate é viciante." },
  { id: 18, restaurantId: 5, userName: "Sofia B.",     rating: 5, comment: "Buddha Bowl lindo e delicioso. O molho tahini de limão é o toque especial que eleva tudo." },
  { id: 19, restaurantId: 5, userName: "Henrique Z.",  rating: 5, comment: "Curry de grão-de-bico incrivelmente saboroso. Não senti falta de carne nenhuma. Recomendo demais!" },
  { id: 20, restaurantId: 5, userName: "Amanda L.",    rating: 4, comment: "Kombucha artesanal deliciosa! Tacos de jackfruit surpreenderam. O guacamole estava perfeito." },
  { id: 21, restaurantId: 5, userName: "Victor N.",    rating: 5, comment: "Melhor opção vegana da cidade. Brownie de tâmaras é impossível de acreditar que não tem açúcar." },
  { id: 22, restaurantId: 9, userName: "Roberta C.",   rating: 5, comment: "Margherita com mozzarella de búfala é outra coisa! Massa no ponto, levemente crocante nas bordas." },
  { id: 23, restaurantId: 9, userName: "André F.",     rating: 4, comment: "Quattro Formaggi é pra quem curte queijo. Bem intenso e rico. Cannoli siciliano de sobremesa, top!" },
  { id: 24, restaurantId: 9, userName: "Natália S.",   rating: 5, comment: "Diavola com mel de abelha é uma combinação genial. Piccante e doce se complementam perfeitamente." },
];

async function main() {
  console.log("Limpando banco...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  console.log("Inserindo restaurantes...");
  for (const r of restaurants) {
    await prisma.restaurant.create({ data: r });
  }

  console.log("Inserindo itens de menu...");
  for (const m of menuItems) {
    await prisma.menuItem.create({ data: m });
  }

  console.log("Inserindo avaliações...");
  for (const rv of reviews) {
    await prisma.review.create({ data: rv });
  }

  console.log("Inserindo usuários parceiros...");
  const partnerPassword = await bcrypt.hash("parceiro123", 10);
  for (const r of restaurants) {
    await prisma.user.create({
      data: {
        name:         r.name,
        email:        `restaurante${r.id}@foodmatch.com`,
        password:     partnerPassword,
        role:         "PARTNER",
        restaurantId: r.id,
      },
    });
  }

  console.log("Inserindo usuários teste e pedidos...");
  const customerPassword = await bcrypt.hash("123456", 10);

  const teste1 = await prisma.user.create({
    data: {
      name:     "João Silva",
      email:    "teste1@gmail.com",
      password: customerPassword,
      address:  "Rua das Flores, 42 – Jardins, SP",
      role:     "CUSTOMER",
    },
  });

  const teste2 = await prisma.user.create({
    data: {
      name:     "Maria Santos",
      email:    "teste2@gmail.com",
      password: customerPassword,
      address:  "Av. Brigadeiro Faria Lima, 1500 – Itaim Bibi, SP",
      role:     "CUSTOMER",
    },
  });

  // --- Pedidos de teste1 ---

  // Sabor & Brasa — entregue
  await prisma.order.create({
    data: {
      userId:       teste1.id,
      restaurantId: 1,
      total:        112.80,
      status:       "entregue",
      address:      "Rua das Flores, 42 – Jardins, SP",
      createdAt:    new Date("2026-05-20T19:30:00Z"),
      items: { create: [
        { menuItemId: 103, name: "Picanha Grelhada",    quantity: 1, price: 89.90 },
        { menuItemId: 106, name: "Caipirinha de Limão", quantity: 1, price: 22.90 },
      ]},
    },
  });

  // Sabor & Brasa — entregue
  await prisma.order.create({
    data: {
      userId:       teste1.id,
      restaurantId: 1,
      total:        52.70,
      status:       "entregue",
      address:      "Rua das Flores, 42 – Jardins, SP",
      createdAt:    new Date("2026-05-24T12:15:00Z"),
      items: { create: [
        { menuItemId: 101, name: "Pão de Alho",      quantity: 2, price: 18.90 },
        { menuItemId: 107, name: "Suco de Maracujá", quantity: 1, price: 14.90 },
      ]},
    },
  });

  // Bella Pasta — entregue
  await prisma.order.create({
    data: {
      userId:       teste1.id,
      restaurantId: 2,
      total:        88.80,
      status:       "entregue",
      address:      "Rua das Flores, 42 – Jardins, SP",
      createdAt:    new Date("2026-05-22T20:00:00Z"),
      items: { create: [
        { menuItemId: 203, name: "Tagliatelle al Ragù", quantity: 1, price: 58.90 },
        { menuItemId: 207, name: "Tiramisù",             quantity: 1, price: 29.90 },
      ]},
    },
  });

  // Bella Pasta — em andamento
  await prisma.order.create({
    data: {
      userId:       teste1.id,
      restaurantId: 2,
      total:        85.80,
      status:       "em andamento",
      address:      "Rua das Flores, 42 – Jardins, SP",
      createdAt:    new Date("2026-05-31T18:45:00Z"),
      items: { create: [
        { menuItemId: 204, name: "Fettuccine Carbonara",  quantity: 1, price: 52.90 },
        { menuItemId: 206, name: "Vinho Tinto da Casa",   quantity: 1, price: 32.90 },
      ]},
    },
  });

  // Sushi Yama — entregue
  await prisma.order.create({
    data: {
      userId:       teste1.id,
      restaurantId: 3,
      total:        108.80,
      status:       "entregue",
      address:      "Rua das Flores, 42 – Jardins, SP",
      createdAt:    new Date("2026-05-26T21:00:00Z"),
      items: { create: [
        { menuItemId: 303, name: "Combo Sushi 16 peças", quantity: 1, price: 79.90 },
        { menuItemId: 306, name: "Sake Quente",           quantity: 1, price: 28.90 },
      ]},
    },
  });

  // --- Pedidos de teste2 ---

  // Sabor & Brasa — entregue
  await prisma.order.create({
    data: {
      userId:       teste2.id,
      restaurantId: 1,
      total:        114.80,
      status:       "entregue",
      address:      "Av. Brigadeiro Faria Lima, 1500 – Itaim Bibi, SP",
      createdAt:    new Date("2026-05-18T20:00:00Z"),
      items: { create: [
        { menuItemId: 104, name: "Costela no Bafo",      quantity: 1, price: 79.90 },
        { menuItemId: 102, name: "Linguiça Artesanal",   quantity: 1, price: 34.90 },
      ]},
    },
  });

  // Bella Pasta — entregue
  await prisma.order.create({
    data: {
      userId:       teste2.id,
      restaurantId: 2,
      total:        101.80,
      status:       "entregue",
      address:      "Av. Brigadeiro Faria Lima, 1500 – Itaim Bibi, SP",
      createdAt:    new Date("2026-05-21T19:30:00Z"),
      items: { create: [
        { menuItemId: 205, name: "Risotto ai Funghi",    quantity: 1, price: 68.90 },
        { menuItemId: 206, name: "Vinho Tinto da Casa",  quantity: 1, price: 32.90 },
      ]},
    },
  });

  // Bella Pasta — em andamento
  await prisma.order.create({
    data: {
      userId:       teste2.id,
      restaurantId: 2,
      total:        82.70,
      status:       "em andamento",
      address:      "Av. Brigadeiro Faria Lima, 1500 – Itaim Bibi, SP",
      createdAt:    new Date("2026-05-31T20:10:00Z"),
      items: { create: [
        { menuItemId: 201, name: "Bruschetta Clássica", quantity: 2, price: 28.90 },
        { menuItemId: 208, name: "Panna Cotta",          quantity: 1, price: 24.90 },
      ]},
    },
  });

  // Sushi Yama — entregue
  await prisma.order.create({
    data: {
      userId:       teste2.id,
      restaurantId: 3,
      total:        91.60,
      status:       "entregue",
      address:      "Av. Brigadeiro Faria Lima, 1500 – Itaim Bibi, SP",
      createdAt:    new Date("2026-05-25T20:30:00Z"),
      items: { create: [
        { menuItemId: 304, name: "Temaki Salmão",       quantity: 2, price: 32.90 },
        { menuItemId: 307, name: "Chá Verde Gelado",    quantity: 2, price: 12.90 },
      ]},
    },
  });

  // Sushi Yama — cancelado
  await prisma.order.create({
    data: {
      userId:       teste2.id,
      restaurantId: 3,
      total:        57.80,
      status:       "cancelado",
      address:      "Av. Brigadeiro Faria Lima, 1500 – Itaim Bibi, SP",
      createdAt:    new Date("2026-05-28T13:00:00Z"),
      items: { create: [
        { menuItemId: 301, name: "Gyoza (8 un)",       quantity: 1, price: 34.90 },
        { menuItemId: 308, name: "Mochi de Matcha",    quantity: 1, price: 22.90 },
      ]},
    },
  });

  console.log("Seed concluído!");
  console.log("\nCredenciais dos parceiros (senha: parceiro123):");
  for (const r of restaurants) {
    console.log(`  [${r.name}] restaurante${r.id}@foodmatch.com`);
  }
  console.log("\nCredenciais dos clientes teste (senha: 123456):");
  console.log("  [João Silva]  teste1@gmail.com");
  console.log("  [Maria Santos] teste2@gmail.com");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
