import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
    userId?: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Authorization header missing or invalid" });
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided' });
        return;
    }
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as unknown as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}

export default authMiddleware;
