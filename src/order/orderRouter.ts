import express from "express";
import { OrderCotroller } from "./orderController";
import { asyncWraper } from "../common/utils/asyncWrapper";
const router = express.Router();
const orderController = new OrderCotroller();

router.post("/", asyncWraper(orderController.create.bind(orderController)));

export default router;
