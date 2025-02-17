import { model, Schema } from "mongoose";

const fieldSchema = new Schema(
    {
        fieldName: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
        },
        cropType: {
            type: String,
            required: true,
        },
        areaSize: {
            type: Number,
            required: true,
        },
        farmerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Field = model("Field", fieldSchema);
