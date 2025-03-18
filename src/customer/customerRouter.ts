import express from "express";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { CustomerController } from "./customerController";
const router = express.Router();
const customerController = new CustomerController();
router.get(
    "/",
    asyncWraper(customerController.getCustomer.bind(customerController)),
);
export default router;
