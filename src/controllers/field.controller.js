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
            farmerId: req.user._id, // Assuming req.user contains the authenticated user's details
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

        await field.remove();

        const apiResponse = new ApiResponse(200, {}, "Field deleted successfully");
        res.status(200).json(apiResponse);
    } catch (error) {
        next(new ApiError(500, error.message || "Error deleting field"));
    }
};
