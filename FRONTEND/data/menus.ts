import type { MenuItem, MenuCategory } from "@/types";

export const menuItems: MenuItem[] = [
  // ── Sabor & Brasa (id: 1) — Churrascaria ──────────────────────────────────
  { id: 101, restaurantId: 1, category: "Entradas", name: "Pão de Alho", description: "Pão artesanal grelhado com manteiga de alho e ervas finas", price: 18.90, image: "https://images.unsplash.com/photo-1619372280082-a4e63c1f9fe4?w=400&q=80" },
  { id: 102, restaurantId: 1, category: "Entradas", name: "Linguiça Artesanal", description: "Linguiça de costela defumada com molho chimichurri caseiro", price: 34.90, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" },
  { id: 103, restaurantId: 1, category: "Pratos Principais", name: "Picanha Grelhada", description: "Picanha Prime 300g grelhada na brasa com arroz, farofa e vinagrete", price: 89.90, image: "https://images.unsplash.com/photo-1558030137-a56c1b003d35?w=400&q=80" },
  { id: 104, restaurantId: 1, category: "Pratos Principais", name: "Costela no Bafo", description: "Costela bovina assada por 12h com mandioca cozida e farofa de bacon", price: 79.90, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
  { id: 105, restaurantId: 1, category: "Pratos Principais", name: "Fraldinha Especial", description: "Fraldinha temperada no sal grosso com arroz, feijão e couve refogada", price: 69.90, image: "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=80" },
  { id: 106, restaurantId: 1, category: "Bebidas", name: "Caipirinha de Limão", description: "Caipirinha clássica com cachaça artesanal e limão tahiti", price: 22.90, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80" },
  { id: 107, restaurantId: 1, category: "Bebidas", name: "Suco de Maracujá", description: "Suco natural de maracujá com açúcar e gelo", price: 14.90, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80" },
  { id: 108, restaurantId: 1, category: "Sobremesas", name: "Pudim de Leite", description: "Pudim de leite condensado caseiro com calda de caramelo", price: 19.90, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80" },

  // ── Bella Pasta (id: 2) — Italiana ────────────────────────────────────────
  { id: 201, restaurantId: 2, category: "Entradas", name: "Bruschetta Clássica", description: "Fatias de ciabatta grelhadas com tomate, manjericão e azeite extra virgem", price: 28.90, image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80" },
  { id: 202, restaurantId: 2, category: "Entradas", name: "Carpaccio de Carne", description: "Filet mignon fatiado com rúcula, parmesão e molho de mostarda Dijon", price: 39.90, image: "https://images.unsplash.com/photo-1626200926547-3f3faefa4fa9?w=400&q=80" },
  { id: 203, restaurantId: 2, category: "Pratos Principais", name: "Tagliatelle al Ragù", description: "Massa fresca artesanal com ragù de carne bovina cozido lentamente e parmesão", price: 58.90, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80" },
  { id: 204, restaurantId: 2, category: "Pratos Principais", name: "Fettuccine Carbonara", description: "Fettuccine com pancetta, ovos frescos, parmesão e pimenta-do-reino", price: 52.90, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80" },
  { id: 205, restaurantId: 2, category: "Pratos Principais", name: "Risotto ai Funghi", description: "Risoto cremoso com mix de cogumelos porcini, shiitake e trufas negras", price: 68.90, image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80" },
  { id: 206, restaurantId: 2, category: "Bebidas", name: "Vinho Tinto da Casa", description: "Taça de vinho tinto italiano selecionado pelo sommelier", price: 32.90, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80" },
  { id: 207, restaurantId: 2, category: "Sobremesas", name: "Tiramisù", description: "Tiramisù clássico com mascarpone, café espresso e cacau em pó", price: 29.90, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80" },
  { id: 208, restaurantId: 2, category: "Sobremesas", name: "Panna Cotta", description: "Panna cotta de baunilha com coulis de frutas vermelhas frescas", price: 24.90, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" },

  // ── Sushi Yama (id: 3) — Japonesa ─────────────────────────────────────────
  { id: 301, restaurantId: 3, category: "Entradas", name: "Gyoza (8 un)", description: "Guioza de frango e legumes, grelhado, com molho ponzu e gengibre", price: 34.90, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80" },
  { id: 302, restaurantId: 3, category: "Entradas", name: "Edamame", description: "Soja verde cozida no vapor com flor de sal defumado", price: 19.90, image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&q=80" },
  { id: 303, restaurantId: 3, category: "Pratos Principais", name: "Combo Sushi 16 peças", description: "4 niguiri atum, 4 niguiri salmão, 4 hot roll crocante, 4 uramaki skin", price: 79.90, image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80" },
  { id: 304, restaurantId: 3, category: "Pratos Principais", name: "Temaki Salmão", description: "Temaki de salmão fresco, cream cheese, cebolinha e ovas de peixe", price: 32.90, image: "https://images.unsplash.com/photo-1584653535665-caa80d37ef5c?w=400&q=80" },
  { id: 305, restaurantId: 3, category: "Pratos Principais", name: "Ramen de Porco", description: "Caldo tonkotsu cozido por 12h, barriga de porco, ovo marinado e nori", price: 54.90, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80" },
  { id: 306, restaurantId: 3, category: "Bebidas", name: "Sake Quente", description: "Sake tradicional japonês Junmai servido quente em copo de cerâmica", price: 28.90, image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=400&q=80" },
  { id: 307, restaurantId: 3, category: "Bebidas", name: "Chá Verde Gelado", description: "Chá verde sencha com gelo, limão e hortelã", price: 12.90, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80" },
  { id: 308, restaurantId: 3, category: "Sobremesas", name: "Mochi de Matcha", description: "Mochi artesanal recheado com sorvete de matcha premium", price: 22.90, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80" },

  // ── Burger Point (id: 4) — Fast Food ─────────────────────────────────────
  { id: 401, restaurantId: 4, category: "Entradas", name: "Onion Rings (8 un)", description: "Anéis de cebola empanados e fritos com molho ranch caseiro", price: 24.90, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80" },
  { id: 402, restaurantId: 4, category: "Entradas", name: "Batata Frita Cheddar", description: "Batatas fritas crocantes com cheddar derretido e bacon bits tostado", price: 29.90, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
  { id: 403, restaurantId: 4, category: "Pratos Principais", name: "Classic Smash Burger", description: "Smash duplo 180g, queijo americano, alface, tomate e molho especial da casa", price: 42.90, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 404, restaurantId: 4, category: "Pratos Principais", name: "BBQ Bacon Burger", description: "Hambúrguer 200g, cheddar, bacon crocante, cebola caramelizada e molho BBQ defumado", price: 49.90, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
  { id: 405, restaurantId: 4, category: "Pratos Principais", name: "Veggie Burger", description: "Hambúrguer de grão-de-bico e quinoa com guacamole, tomate e alface crespa", price: 38.90, image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&q=80" },
  { id: 406, restaurantId: 4, category: "Bebidas", name: "Milkshake de Chocolate", description: "Milkshake cremoso de chocolate belga 70% cacau com chantilly e calda", price: 22.90, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
  { id: 407, restaurantId: 4, category: "Bebidas", name: "Refrigerante Lata", description: "Coca-Cola, Guaraná Antarctica ou Sprite 350ml gelado", price: 8.90, image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&q=80" },
  { id: 408, restaurantId: 4, category: "Sobremesas", name: "Cookie Quente", description: "Cookie gigante de chocolate chip quentinho servido com sorvete de baunilha", price: 19.90, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80" },

  // ── Green Bowl (id: 5) — Vegana ───────────────────────────────────────────
  { id: 501, restaurantId: 5, category: "Entradas", name: "Carpaccio de Beterraba", description: "Beterraba assada fatiada com nozes, rúcula e vinagrete de laranja siciliana", price: 26.90, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { id: 502, restaurantId: 5, category: "Entradas", name: "Hummus com Pita", description: "Homus artesanal de grão-de-bico com azeite, páprica defumada e pão pita quentinho", price: 22.90, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
  { id: 503, restaurantId: 5, category: "Pratos Principais", name: "Buddha Bowl", description: "Quinoa, grão-de-bico assado, abacate, cenoura roxa e molho tahini de limão", price: 45.90, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { id: 504, restaurantId: 5, category: "Pratos Principais", name: "Curry de Grão-de-bico", description: "Curry aromático com grão-de-bico, espinafre, leite de coco e arroz basmati", price: 42.90, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80" },
  { id: 505, restaurantId: 5, category: "Pratos Principais", name: "Tacos de Jackfruit", description: "3 tacos de jackfruit desfiado temperado no achiote com guacamole e pico de gallo", price: 38.90, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
  { id: 506, restaurantId: 5, category: "Bebidas", name: "Smoothie Verde", description: "Espinafre, maçã verde, gengibre, pepino e limão siciliano", price: 18.90, image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80" },
  { id: 507, restaurantId: 5, category: "Bebidas", name: "Kombucha de Hibisco", description: "Kombucha artesanal de hibisco com frutas vermelhas, levemente gaseificado", price: 16.90, image: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&q=80" },
  { id: 508, restaurantId: 5, category: "Sobremesas", name: "Brownie de Tâmaras", description: "Brownie raw vegano de cacau 80% e tâmaras Medjool com sorvete de coco", price: 21.90, image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&q=80" },

  // ── Pizza Napoli (id: 9) — Italiana ───────────────────────────────────────
  { id: 901, restaurantId: 9, category: "Entradas", name: "Focaccia al Rosmarino", description: "Focaccia artesanal com alecrim fresco, sal grosso e azeite extra virgem", price: 22.90, image: "https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=400&q=80" },
  { id: 902, restaurantId: 9, category: "Entradas", name: "Antipasto Misto", description: "Mix de frios italianos: salame Napoli, prosciutto, azeitonas e queijos curados", price: 49.90, image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=80" },
  { id: 903, restaurantId: 9, category: "Pratos Principais", name: "Pizza Margherita", description: "Molho de tomate San Marzano, mozzarella de búfala fresca e manjericão", price: 59.90, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
  { id: 904, restaurantId: 9, category: "Pratos Principais", name: "Pizza Quattro Formaggi", description: "Quatro queijos: mozzarella, gorgonzola DOP, parmesão 24m e provolone", price: 69.90, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { id: 905, restaurantId: 9, category: "Pratos Principais", name: "Pizza Diavola", description: "Molho de tomate, salame picante, mozzarella, pimenta calabresa e mel de abelha", price: 64.90, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80" },
  { id: 906, restaurantId: 9, category: "Bebidas", name: "Negroni", description: "Coquetel clássico com gin London Dry, Campari e vermute rosso", price: 34.90, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80" },
  { id: 907, restaurantId: 9, category: "Bebidas", name: "Limonata Siciliana", description: "Limonada artesanal com limão siciliano, hortelã e água com gás San Pellegrino", price: 14.90, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80" },
  { id: 908, restaurantId: 9, category: "Sobremesas", name: "Cannoli Siciliano", description: "Cannoli crocante artesanal recheado com ricota adocicada e gotas de chocolate", price: 27.90, image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&q=80" },
];

export function getMenuByRestaurant(restaurantId: number): MenuItem[] {
  return menuItems.filter((item) => item.restaurantId === restaurantId);
}

export function getMenuCategories(restaurantId: number): MenuCategory[] {
  const items = getMenuByRestaurant(restaurantId);
  const seen = new Set<string>();
  const categories: MenuCategory[] = [];
  for (const item of items) {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      categories.push(item.category);
    }
  }
  return categories;
}
