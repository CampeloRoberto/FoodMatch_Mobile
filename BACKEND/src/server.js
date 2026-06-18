import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import restaurantsRouter from "./routes/restaurants.js";
import ordersRouter from "./routes/orders.js";
import favoritesRouter from "./routes/favorites.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, name: "foodmatch-api" }));

app.use("/auth", authRouter);
app.use("/restaurants", restaurantsRouter);
app.use("/orders", ordersRouter);
app.use("/favorites", favoritesRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`FoodMatch API rodando em http://localhost:${port}`);
});
