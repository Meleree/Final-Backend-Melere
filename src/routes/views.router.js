import { Router } from "express";
import fs from "fs";
import path from "path";

const viewsRouter = Router();

// Ruta para la vista de productos
viewsRouter.get("/", (req, res) => {
  const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json")));
  res.render("home", { products });
});

// Ruta para la vista en tiempo real de productos
viewsRouter.get("/realtimeproducts", (req, res) => {
  const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json")));
  res.render("realTimeProducts", { products });
});

export default viewsRouter;
