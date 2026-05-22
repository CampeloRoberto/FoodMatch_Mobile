import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /restaurants — lista todos (com filtros opcionais)
router.get("/", async (req, res, next) => {
  try {
    const { category, featured, popular } = req.query;

    const where = {};
    if (category) where.category = category;
    if (featured === "true") where.featured = true;
    if (popular === "true") where.popular = true;

    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: { rating: "desc" },
    });

    res.json(restaurants);
  } catch (e) { next(e); }
});

// GET /restaurants/:id — detalhes de um restaurante
router.get("/:id", async (req, res, next) => {
  try {
    const restaurant = await prisma.restaurant.findUniqueOrThrow({
      where: { id: Number(req.params.id) },
    });
    res.json(restaurant);
  } catch (e) { next(e); }
});

// GET /restaurants/:id/menu — cardápio do restaurante
router.get("/:id/menu", async (req, res, next) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { restaurantId: Number(req.params.id) },
      orderBy: { category: "asc" },
    });
    res.json(items.map((i) => ({ ...i, price: Number(i.price) })));
  } catch (e) { next(e); }
});

// GET /restaurants/:id/reviews — avaliações do restaurante
router.get("/:id/reviews", async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { restaurantId: Number(req.params.id) },
      orderBy: { date: "desc" },
    });
    res.json(reviews);
  } catch (e) { next(e); }
});

export default router;
