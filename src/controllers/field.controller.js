import { Field } from "../models/field.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Add a new field
export const addField = async (req, res, next) => {
    const { fieldName, location, cropType, areaSize } = req.body;

    try {
        if ([fieldName, location, cropType, areaSize].some(field => !field || field.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const field = await Field.create({
            fieldName,
            location,
            cropType,
            areaSize,
            farmerId: req.user._id,
        });

        const apiResponse = new ApiResponse(201, field, "Field added successfully");
        res.status(201).json(apiResponse);
    } catch (error) {
        next(new ApiError(500, error.message || "Error adding field"));
    }
};

// Update an existing field
export const updateField = async (req, res, next) => {
    const { id } = req.params;
    const { fieldName, location, cropType, areaSize } = req.body;

    try {
        const field = await Field.findById(id);

        if (!field) {
            throw new ApiError(404, "Field not found");
        }

        if (field.farmerId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to update this field");
        }

        field.fieldName = fieldName || field.fieldName;
        field.location = location || field.location;
        field.cropType = cropType || field.cropType;
        field.areaSize = areaSize || field.areaSize;

        await field.save();

        const apiResponse = new ApiResponse(200, field, "Field updated successfully");
        res.status(200).json(apiResponse);
    } catch (error) {
        next(new ApiError(500, error.message || "Error updating field"));
    }
};

// Delete a field
export const deleteField = async (req, res, next) => {
    const { id } = req.params;

    try {
        const field = await Field.findById(id);

        if (!field) {
            throw new ApiError(404, "Field not found");
        }

        if (field.farmerId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this field");
        }

        await Field.findOneAndDelete({ _id: id });

        const apiResponse = new ApiResponse(200, {}, "Field deleted successfully");
        res.status(200).json(apiResponse);
    } catch (error) {
        next(new ApiError(500, error.message || "Error deleting field"));
    }
};

// Fetch all fields for the logged-in farmer
export const getFieldsByFarmer = async (req, res, next) => {
    try {
        const fields = await Field.find({ farmerId: req.user._id });

        if (!fields || fields.length === 0) {
            throw new ApiError(404, "No fields found for this farmer");
        }

        const apiResponse = new ApiResponse(200, fields, "Fields fetched successfully");
        res.status(200).json(apiResponse);
    } catch (error) {
        next(new ApiError(500, error.message || "Error fetching fields"));
    }
};

// Fetch all fields
export const getAllFields = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const totalFields = await Field.countDocuments();
        const fields = await Field.find()
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            currentPage: Number(page),
            totalPages: Math.ceil(totalFields / limit),
            totalFields,
            fields,
        });
    } catch (error) {
        next(new ApiError(500, "Failed to fetch fields"));
    }
};
