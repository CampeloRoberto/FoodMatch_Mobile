import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { registerSchema, registerPartnerSchema, loginSchema } from "../schemas/authSchema.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role ?? "CUSTOMER", restaurantId: user.restaurantId ?? null },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function userPayload(user) {
  return { id: user.id, name: user.name, email: user.email, address: user.address ?? null, role: user.role ?? "CUSTOMER", restaurantId: user.restaurantId ?? null };
}

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed, address: data.address },
    });

    res.status(201).json({ token: signToken(user), user: userPayload(user) });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    res.json({ token: signToken(user), user: userPayload(user) });
  } catch (e) { next(e); }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user.id } });
    res.json(userPayload(user));
  } catch (e) { next(e); }
});

router.post("/register-partner", async (req, res, next) => {
  try {
    const data = registerPartnerSchema.parse(req.body);

    const restaurant = await prisma.restaurant.findUnique({ where: { id: data.restaurantId } });
    if (!restaurant) return res.status(404).json({ error: "Restaurante não encontrado" });

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ error: "E-mail já cadastrado" });

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed, role: "PARTNER", restaurantId: data.restaurantId },
    });

    res.status(201).json({ token: signToken(user), user: userPayload(user) });
  } catch (e) { next(e); }
});

export default router;
