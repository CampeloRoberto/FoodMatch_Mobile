import { z } from "zod";

export const registerSchema = z.object({
  name:     z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email:    z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  address:  z.string().optional(),
});

export const registerPartnerSchema = z.object({
  name:         z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email:        z.string().email("E-mail inválido"),
  password:     z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  restaurantId: z.number().int().positive("Selecione um restaurante"),
});

export const createRestaurantPartnerSchema = z.object({
  name:           z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email:          z.string().email("E-mail inválido"),
  password:       z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  restaurantName: z.string().min(2, "Nome do restaurante obrigatório"),
  category:       z.string().min(2, "Categoria obrigatória"),
  priceRange:     z.string().min(1, "Faixa de preço obrigatória"),
});

export const loginSchema = z.object({
  email:    z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});
