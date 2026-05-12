import express from "express";
import { signin, signup, logout, profile, me } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/logout", logout);

router.put("/profile", protectedRoute, profile);

router.get("/me", protectedRoute, me);



export default router;