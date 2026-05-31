import type { Review } from "@/types";

export const reviews: Review[] = [
  // Sabor & Brasa (1)
  { id: 1, restaurantId: 1, userName: "Carlos M.", rating: 5, comment: "Picanha perfeita! Ponto exato, suculenta demais. Melhor churrasco da cidade sem dúvida.", date: "2024-03-10" },
  { id: 2, restaurantId: 1, userName: "Ana Paula", rating: 4, comment: "Costela no bafo sensacional, desmanchando. Só achei o tempo de espera um pouco longo.", date: "2024-03-05" },
  { id: 3, restaurantId: 1, userName: "Fernando K.", rating: 5, comment: "Fui no aniversário da minha esposa e não nos decepcionamos. Atendimento impecável!", date: "2024-02-28" },
  { id: 4, restaurantId: 1, userName: "Bruna S.", rating: 4, comment: "Caipirinha artesanal é incrível. A carne veio no ponto certo. Voltarei com certeza.", date: "2024-02-20" },
  { id: 5, restaurantId: 1, userName: "Rafael T.", rating: 5, comment: "Pão de alho como entrada é de outro nível. Porcão enorme e preço justo para a qualidade.", date: "2024-02-14" },

  // Bella Pasta (2)
  { id: 6, restaurantId: 2, userName: "Giovanna L.", rating: 5, comment: "Tagliatelle al ragù é simplesmente divino. Massa fresca artesanal, ragù cozido lentamente. Voltei 3 vezes esse mês!", date: "2024-03-12" },
  { id: 7, restaurantId: 2, userName: "Pedro H.", rating: 5, comment: "Melhor carbonara que já comi fora da Itália. Cremosa, sem creme de leite, do jeito tradicional.", date: "2024-03-08" },
  { id: 8, restaurantId: 2, userName: "Mariana F.", rating: 4, comment: "Tiramisù maravilhoso. O risotto estava um pouco salgado pra mim mas o serviço compensou.", date: "2024-03-01" },
  { id: 9, restaurantId: 2, userName: "Thiago N.", rating: 5, comment: "Vinho da casa surpreendeu positivamente. Ambiente romântico, perfeito para jantar a dois.", date: "2024-02-22" },

  // Sushi Yama (3)
  { id: 10, restaurantId: 3, userName: "Yuki A.", rating: 5, comment: "Salmão fresco de verdade! O combo 16 peças vale muito o preço. Skin é irresistível.", date: "2024-03-11" },
  { id: 11, restaurantId: 3, userName: "Camila R.", rating: 4, comment: "Ramen de porco com caldo rico e profundo. Único porém é que o tempero é bem forte.", date: "2024-03-06" },
  { id: 12, restaurantId: 3, userName: "Lucas V.", rating: 5, comment: "Gyoza perfeita, crocante por fora e suculenta por dentro. Mochi de matcha é incrível.", date: "2024-02-27" },
  { id: 13, restaurantId: 3, userName: "Isabela C.", rating: 4, comment: "Ótima qualidade do peixe. O edamame poderia ter mais flor de sal. No geral excelente!", date: "2024-02-18" },

  // Burger Point (4)
  { id: 14, restaurantId: 4, userName: "Diego M.", rating: 5, comment: "BBQ Bacon Burger é o hambúrguer da minha vida. Cebola caramelizada + cheddar + bacon = perfeição.", date: "2024-03-09" },
  { id: 15, restaurantId: 4, userName: "Leticia P.", rating: 4, comment: "Smash burger bem executado, bem crocante nas bordas. Batata frita cheddar chegou quentinha, top!", date: "2024-03-04" },
  { id: 16, restaurantId: 4, userName: "Gabriel O.", rating: 3, comment: "Lanche bom, mas demorou 45 min para chegar. Para fast food esperava mais rapidez.", date: "2024-02-25" },
  { id: 17, restaurantId: 4, userName: "Priscila M.", rating: 5, comment: "Veggie burger me surpreendeu muito! Não parece que falta carne. Milkshake de chocolate é viciante.", date: "2024-02-15" },

  // Green Bowl (5)
  { id: 18, restaurantId: 5, userName: "Sofia B.", rating: 5, comment: "Buddha Bowl lindo e delicioso. O molho tahini de limão é o toque especial que eleva tudo.", date: "2024-03-13" },
  { id: 19, restaurantId: 5, userName: "Henrique Z.", rating: 5, comment: "Curry de grão-de-bico incrivelmente saboroso. Não senti falta de carne nenhuma. Recomendo demais!", date: "2024-03-07" },
  { id: 20, restaurantId: 5, userName: "Amanda L.", rating: 4, comment: "Kombucha artesanal deliciosa! Tacos de jackfruit surpreenderam. O guacamole estava perfeito.", date: "2024-02-29" },
  { id: 21, restaurantId: 5, userName: "Victor N.", rating: 5, comment: "Melhor opção vegana da cidade. Brownie de tâmaras é impossível de acreditar que não tem açúcar.", date: "2024-02-19" },

  // Pizza Napoli (9)
  { id: 22, restaurantId: 9, userName: "Roberta C.", rating: 5, comment: "Margherita com mozzarella de búfala é outra coisa! Massa no ponto, levemente crocante nas bordas.", date: "2024-03-10" },
  { id: 23, restaurantId: 9, userName: "André F.", rating: 4, comment: "Quattro Formaggi é pra quem curte queijo. Bem intenso e rico. Cannoli siciliano de sobremesa, top!", date: "2024-03-02" },
  { id: 24, restaurantId: 9, userName: "Natália S.", rating: 5, comment: "Diavola com mel de abelha é uma combinação genial. Piccante e doce se complementam perfeitamente.", date: "2024-02-24" },
];

export function getReviewsByRestaurant(restaurantId: number): Review[] {
  return reviews.filter((r) => r.restaurantId === restaurantId);
}

export function getAverageRating(restaurantId: number): number {
  const r = getReviewsByRestaurant(restaurantId);
  if (!r.length) return 0;
  return Math.round((r.reduce((sum, rv) => sum + rv.rating, 0) / r.length) * 10) / 10;
}
