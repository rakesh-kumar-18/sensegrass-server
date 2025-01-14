import Razorpay from "razorpay";
import crypto from "crypto";
import { Transaction } from "../models/transaction.model.js";
import ApiError from "../utils/ApiError.js";

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order for payment
export const createOrder = async (req, res, next) => {
    const { amount, planId } = req.body;

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${planId}_${Date.now()}`,
        });

        res.status(200).json({
            key: process.env.RAZORPAY_KEY_ID,
            amount: order.amount,
            orderId: order.id,
            prefill: {
                name: req.user.username,
                email: req.user.email,
            },
        });
    } catch (error) {
        next(new ApiError(500, "Failed to create payment order"));
    }
};

// Verify payment
export const verifyPayment = async (req, res, next) => {
    const { paymentId, orderId, signature, amount } = req.body;

    try {
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (generatedSignature !== signature) {
            throw new ApiError(400, "Invalid payment signature");
        }

        await Transaction.create({
            userId: req.user._id,
            paymentId,
            orderId,
            amount: amount,
            status: "Success",
        });

        res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
        next(new ApiError(500, error.message || "Payment verification failed"));
    }
};

// Get transaction history
export const getTransactionHistory = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const totalTransactions = await Transaction.countDocuments();
        const transactions = await Transaction.find()
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("userId", "username")
            .lean();

        res.status(200).json({
            currentPage: Number(page),
            totalPages: Math.ceil(totalTransactions / limit),
            totalTransactions,
            transactions,
        });
    } catch (error) {
        next(new ApiError(500, "Failed to fetch transactions"));
    }
};
