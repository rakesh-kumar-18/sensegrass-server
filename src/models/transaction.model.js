import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        paymentId: {
            type: String,
            required: true
        },
        orderId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Success", "Failed"],
            default: "Success"
        },
    },
    { timestamps: true }
);

export const Transaction = model("Transaction", transactionSchema);
