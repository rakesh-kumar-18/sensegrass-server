import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import generateToken from "../utils/generateToken.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
};

// Register User
export const registerUser = async (req, res, next) => {
    const { username, email, password, confirmPassword, role } = req.body;

    try {
        if (
            [username, email, password, confirmPassword, role].some(
                (field) => !field || field.trim() === ""
            )
        )
            throw new ApiError(400, "All fields are required");

        if (password !== confirmPassword)
            throw new ApiError(400, "Passwords do not match");

        const isUsernameExist = await User.findOne({ username });
        if (isUsernameExist)
            throw new ApiError(409, "User with this username already exists");

        const isEmailExist = await User.findOne({ email });
        if (isEmailExist)
            throw new ApiError(409, "User with this email already exists");

        const user = await User.create({ username, email, password, role });

        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser)
            throw new ApiError(500, "Something went wrong while registering the user");

        const apiResponse = new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        );
        res.status(201).json(apiResponse);
    } catch (error) {
        next(new ApiError(500, error.message || "Error registering user"));
    }
};

// Login User
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if ([email, password].some((field) => !field || field.trim() === ""))
            throw new ApiError(400, "All fields are required");

        const user = await User.findOne({ email });

        if (!user) throw new ApiError(401, "Invalid Credentials");

        const isPasswordValid = await user.isValidPassword(password);

        if (!isPasswordValid) throw new ApiError(401, "Invalid Credentials");

        const accessToken = await generateToken(user);

        const loggedInUser = await User.findById(user._id).select("-password");

        res.cookie("accessToken", accessToken, COOKIE_OPTIONS);

        const apiResponse = new ApiResponse(
            200,
            { loggedInUser, accessToken },
            "Login successful"
        );
        res.status(200).json(apiResponse);
    } catch (error) {
        next(new ApiError(500, error.message || "Error logging in"));
    }
};

// Logout User
export const logoutUser = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) throw new ApiError(404, "User not found");

        res.clearCookie("accessToken", COOKIE_OPTIONS);

        const apiResponse = new ApiResponse(200, {}, "Logout successful");
        res.status(200).json(apiResponse);
    } catch (error) {
        next(new ApiError(500, error.message || "Error logging out"));
    }
};

// Fetch all farmers with pagination
export const getAllFarmers = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const totalFarmers = await User.countDocuments({ role: "Farmer" });
        const farmers = await User.find({ role: "Farmer" })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select("-password");

        res.status(200).json({
            currentPage: Number(page),
            totalPages: Math.ceil(totalFarmers / limit),
            totalFarmers,
            farmers,
        });
    } catch (error) {
        next(new ApiError(500, "Failed to fetch farmers"));
    }
};
