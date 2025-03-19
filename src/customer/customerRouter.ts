import express from "express";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { CustomerController } from "./customerController";
import authenticate from "../common/middlewares/authenticate";
import { CustomerService } from "./customerService";
const router = express.Router();
const customerService = new CustomerService();
const customerController = new CustomerController(customerService);
router.get(
    "/",
    authenticate,
    asyncWraper(customerController.getCustomer.bind(customerController)),
);
router.patch(
    "/addresses/:id",
    authenticate,
    asyncWraper(customerController.addAdress.bind(customerController)),
);
export default router;
