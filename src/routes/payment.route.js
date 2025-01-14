import { Router } from "express";
import {
    createOrder,
    verifyPayment,
    getTransactionHistory,
} from "../controllers/payment.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/checkout").post(isAuthenticated, createOrder);
router.route("/verify").post(isAuthenticated, verifyPayment);
router.route("/transactions").get(isAuthenticated, getTransactionHistory);

export default router;
