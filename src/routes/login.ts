import bcrypt from "bcrypt";
import { Router } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ error: "Invalid email" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({ error: "Invalid password" });
            return;
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" },
        );

        res.json({ token });
    } catch {
        res.status(500).json({ error: "Failed to login" });
    }
});

export default router;
