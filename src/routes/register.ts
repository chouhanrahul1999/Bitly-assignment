import { Router } from "express";
import bcrypt from 'bcrypt';
import User from "../models/User.js";

const router = Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    } catch (err: unknown) {
        if ((err as { code?: number }).code === 11000) {
            res.status(409).json({ error: "User already exists" });
            return;
        }
        res.status(500).json({ error: "Failed to create user" });
    }
})

export default router;
