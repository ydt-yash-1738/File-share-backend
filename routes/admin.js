import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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

export default router;
