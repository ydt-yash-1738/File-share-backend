import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyAdmin } from "../controllers/adminAuth.controller.js"; 

dotenv.config();

const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT Token for admin
    const token = jwt.sign(
        { email, isAdmin: true }, 
        process.env.ADMIN_SECRET, 
        { expiresIn: "1h" }
    );

    res.json({ success: true, token });
});

// for data
// Protected Admin Data Route
router.get("/data", verifyAdmin, async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Welcome Admin!",
            users: ["User1", "User2", "User3"], // Mock data
            files: ["File1.pdf", "File2.jpg"]
        });
    } catch (error) {
        console.error("Admin API Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
