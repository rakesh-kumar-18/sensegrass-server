import { Router } from "express";
import {
    addField,
    updateField,
    deleteField,
} from "../controllers/field.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(isAuthenticated, addField);
router.route("/update/:id").put(isAuthenticated, updateField);
router.route("/delete/:id").delete(isAuthenticated, deleteField);

export default router;
