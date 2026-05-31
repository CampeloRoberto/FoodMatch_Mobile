import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middlewares/authenticate.js";
import { createOrderSchema } from "../schemas/orderSchema.js";

const router = Router();

router.use(authenticate);

// GET /orders — pedidos do usuário logado
router.get("/", async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        restaurant: { select: { name: true, image: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      restaurantId:    o.restaurantId,
      restaurantName:  o.restaurant.name,
      restaurantImage: o.restaurant.image,
      items:    o.items.map((i) => ({ ...i, price: Number(i.price) })),
      total:    Number(o.total),
      status:   o.status,
      date:     o.createdAt,
      address:  o.address,
    }));

    res.json(formatted);
  } catch (e) { next(e); }
});

// POST /orders — criar novo pedido
router.post("/", async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);

    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId:       req.user.id,
        restaurantId: data.restaurantId,
        total:        total,
        address:      data.address,
        items: {
          create: data.items.map((item) => ({
            menuItemId: item.menuItemId,
            name:       item.name,
            quantity:   item.quantity,
            price:      item.price,
          })),
        },
      },
      include: { items: true, restaurant: { select: { name: true, image: true } } },
    });

    res.status(201).json({
      id:              order.id,
      restaurantId:    order.restaurantId,
      restaurantName:  order.restaurant.name,
      restaurantImage: order.restaurant.image,
      items:   order.items.map((i) => ({ ...i, price: Number(i.price) })),
      total:   Number(order.total),
      status:  order.status,
      date:    order.createdAt,
      address: order.address,
    });
  } catch (e) { next(e); }
});

// PATCH /orders/:id/status — atualizar status do pedido (parceiro do restaurante)
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["em andamento", "entregue", "cancelado"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const order = await prisma.order.findUniqueOrThrow({ where: { id: req.params.id } });

    const isPartner = req.user.role === "PARTNER" && req.user.restaurantId === order.restaurantId;
    if (!isPartner) {
      return res.status(403).json({ error: "Sem permissão para atualizar este pedido" });
    }

    await prisma.order.update({ where: { id: req.params.id }, data: { status } });
    res.json({ ok: true, status });
  } catch (e) { next(e); }
});

export default router;
