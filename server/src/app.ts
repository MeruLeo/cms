import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

import config from "./config/config";
import { errorHandler } from "./middlewares/errorHandler";

import authRouter from "./modules/routes/auth.routes";
import usersRouter from "./modules/routes/user.routes";
import productsRouter from "./modules/routes/product.routes";
import categoriesRouter from "./modules/routes/category.routes";
import couponsRouter from "./modules/routes/coupon.routes";

const app: Express = express();

const productionMode = config.nodeEnv === "production";

app.use(express.json({ limit: "50kb" }));

app.use(
  cors({
    origin: productionMode ? config.origions.product : config.origions.local,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());

app.use(cookieParser());

if (!productionMode) {
  app.use(morgan("dev"));
}

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/coupons", couponsRouter);

app.use(errorHandler);

export default app;
