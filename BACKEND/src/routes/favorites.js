import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

// GET /favorites — restaurantes favoritos do usuário
router.get("/", async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { restaurant: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites.map((f) => f.restaurant));
  } catch (e) { next(e); }
});

// POST /favorites/:restaurantId — favoritar restaurante
router.post("/:restaurantId", async (req, res, next) => {
  try {
    await prisma.favorite.create({
      data: {
        userId:       req.user.id,
        restaurantId: Number(req.params.restaurantId),
      },
    });
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

// DELETE /favorites/:restaurantId — desfavoritar restaurante
router.delete("/:restaurantId", async (req, res, next) => {
  try {
    await prisma.favorite.deleteMany({
      where: {
        userId:       req.user.id,
        restaurantId: Number(req.params.restaurantId),
      },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
