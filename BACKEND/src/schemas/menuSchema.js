import { z } from "zod";

export const menuItemSchema = z.object({
  name:        z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  description: z.string().min(5, "Descrição muito curta"),
  price:       z.number().positive("Preço deve ser positivo"),
  category:    z.string().min(2, "Informe a categoria"),
  image:       z.string().url("URL de imagem inválida").optional(),
});

export const updateMenuItemSchema = menuItemSchema.partial();

export const updateRestaurantSchema = z.object({
  name:        z.string().min(2).optional(),
  description: z.string().optional(),
  phone:       z.string().optional(),
  hours:       z.string().optional(),
  address:     z.string().optional(),
  image:       z.string().url("URL de imagem inválida").optional(),
  priceRange:  z.string().optional(),
});
