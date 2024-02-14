import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

// Creating an instance of Express router
const router = express.Router();

// Register user route
router.post("/", registerUser);

// Login user route
router.post("/login", loginUser);

export { router as userRoutes };
