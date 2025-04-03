import express from "express";
import { OrderCotroller } from "./orderController";
const router = express.Router();
const orderController = new OrderCotroller();

router.post("/", orderController.create.bind(orderController));

export default router;
