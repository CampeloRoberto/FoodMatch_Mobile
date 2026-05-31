import { z } from "zod";

export const createOrderSchema = z.object({
  restaurantId: z.number().int().positive(),
  address:      z.string().min(5, "Endereço inválido"),
  items: z.array(z.object({
    menuItemId: z.number().int().positive(),
    name:       z.string(),
    quantity:   z.number().int().min(1),
    price:      z.number().positive(),
  })).min(1, "Pedido deve ter ao menos 1 item"),
});
