import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getAllFarmers,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/logout").post(isAuthenticated, logoutUser);
router.get("/farmers", isAuthenticated, getAllFarmers);

export default router;
