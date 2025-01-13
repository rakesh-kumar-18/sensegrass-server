import { Router } from "express";
import {
    addField,
    updateField,
    deleteField,
    getFieldsByFarmer,
    getAllFields,
} from "../controllers/field.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(isAuthenticated, getFieldsByFarmer);
router.route("/all").get(isAuthenticated, getAllFields);
router.route("/add").post(isAuthenticated, addField);
router.route("/update/:id").put(isAuthenticated, updateField);
router.route("/delete/:id").delete(isAuthenticated, deleteField);

export default router;
