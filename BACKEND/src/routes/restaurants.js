import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middlewares/authenticate.js";
import { menuItemSchema, updateMenuItemSchema, updateRestaurantSchema } from "../schemas/menuSchema.js";

const router = Router();

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

function requirePartnerOf(req, res, next) {
  if (req.user.role !== "PARTNER") {
    return res.status(403).json({ error: "Acesso restrito a parceiros" });
  }
  if (req.user.restaurantId !== Number(req.params.id)) {
    return res.status(403).json({ error: "Você não é parceiro deste restaurante" });
  }
  next();
}

// GET /restaurants — lista todos (com filtros opcionais)
router.get("/", async (req, res, next) => {
  try {
    const { category, featured, popular } = req.query;
    const where = {};
    if (category) where.category = category;
    if (featured === "true") where.featured = true;
    if (popular === "true") where.popular = true;
    const restaurants = await prisma.restaurant.findMany({ where, orderBy: { rating: "desc" } });
    res.json(restaurants);
  } catch (e) { next(e); }
});

// GET /restaurants/:id — detalhes de um restaurante
router.get("/:id", async (req, res, next) => {
  try {
    const restaurant = await prisma.restaurant.findUniqueOrThrow({ where: { id: Number(req.params.id) } });
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

// GET /restaurants/:id/orders — pedidos recebidos (parceiro)
router.get("/:id/orders", authenticate, requirePartnerOf, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { restaurantId: Number(req.params.id) },
      include: {
        user:  { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders.map((o) => ({
      id:            o.id,
      customerName:  o.user.name,
      customerEmail: o.user.email,
      items:         o.items.map((i) => ({ ...i, price: Number(i.price) })),
      total:         Number(o.total),
      status:        o.status,
      date:          o.createdAt,
      address:       o.address,
    })));
  } catch (e) { next(e); }
});

// GET /restaurants/:id/stats — balanço geral do restaurante (parceiro)
router.get("/:id/stats", authenticate, requirePartnerOf, async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.id);

    const orders = await prisma.order.findMany({
      where: { restaurantId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    const delivered  = orders.filter((o) => o.status === "entregue");
    const pending    = orders.filter((o) => o.status === "em andamento");
    const canceled   = orders.filter((o) => o.status === "cancelado");
    const totalRevenue = delivered.reduce((sum, o) => sum + Number(o.total), 0);

    // top 5 itens mais pedidos
    const itemCount = {};
    for (const order of delivered) {
      for (const item of order.items) {
        if (!itemCount[item.name]) itemCount[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        itemCount[item.name].quantity += item.quantity;
        itemCount[item.name].revenue  += Number(item.price) * item.quantity;
      }
    }
    const topItems = Object.values(itemCount)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({
      totalRevenue,
      totalOrders:      orders.length,
      ordersDelivered:  delivered.length,
      ordersPending:    pending.length,
      ordersCanceled:   canceled.length,
      topItems,
    });
  } catch (e) { next(e); }
});

// PUT /restaurants/:id — editar dados do restaurante (parceiro)
router.put("/:id", authenticate, requirePartnerOf, async (req, res, next) => {
  try {
    const data = updateRestaurantSchema.parse(req.body);
    const restaurant = await prisma.restaurant.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(restaurant);
  } catch (e) { next(e); }
});

// POST /restaurants/:id/menu — adicionar item ao cardápio (parceiro)
router.post("/:id/menu", authenticate, requirePartnerOf, async (req, res, next) => {
  try {
    const data = menuItemSchema.parse(req.body);
    const item = await prisma.menuItem.create({
      data: {
        restaurantId: Number(req.params.id),
        name:         data.name,
        description:  data.description,
        price:        data.price,
        category:     data.category,
        image:        data.image ?? DEFAULT_IMAGE,
      },
    });
    res.status(201).json({ ...item, price: Number(item.price) });
  } catch (e) { next(e); }
});

// PUT /restaurants/:id/menu/:itemId — editar item do cardápio (parceiro)
router.put("/:id/menu/:itemId", authenticate, requirePartnerOf, async (req, res, next) => {
  try {
    const data = updateMenuItemSchema.parse(req.body);
    const item = await prisma.menuItem.update({
      where: { id: Number(req.params.itemId) },
      data: { ...data, image: data.image ?? undefined },
    });
    res.json({ ...item, price: Number(item.price) });
  } catch (e) { next(e); }
});

// DELETE /restaurants/:id/menu/:itemId — remover item do cardápio (parceiro)
router.delete("/:id/menu/:itemId", authenticate, requirePartnerOf, async (req, res, next) => {
  try {
    await prisma.menuItem.delete({ where: { id: Number(req.params.itemId) } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
