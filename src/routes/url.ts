import { randomBytes } from "crypto";
import { Router, type Request, type Response } from "express";
import Url from "../models/Url.js";

const router = Router();

const generateShortCode = (): string => {
    return randomBytes(4).toString("base64url").slice(0, 6);
};

router.post("/shorten", async (req, res) => {
    const { url, customCode, expiresInDays } = req.body as {
        url: string;
        customCode?: string;
        expiresInDays?: number;
    };

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        new URL(url);
    } catch (err) {
        return res.status(400).json({
            error: "Invalid URL format",
            err,
        });
        return;
    }

    const shortCode = customCode?.trim() || generateShortCode();
    const expiresAt = expiresInDays
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
        : null;

    try {
        const entry = await Url.create({
            shortCode,
            originalUrl: url,
            expiresAt,
        })
        res.status(201).json({
            shortUrl: `${process.env.BASE_URL}/${entry.shortCode}`
        });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(409).json({
                error: "Custom code already exists, please try another one"
            })
        }
        res.status(500).json({
            error: "Error creating short URL",
            err
        })
    }
});

router.get("analytics/:code", async (req, res) => {
    const entry = await Url.findOne({ shortCode: req.params.code });

    if (!entry) {
        res.status(404).json({ error: "Short URL not found" });
        return;
    }

    res.json({
        shortCode: entry.shortCode,
        originalUrl: entry.originalUrl,
        clicks: entry.clicks,
        createdAt: entry.createdAt,
        expiresAt: entry.expiresAt
    })
})

router.get(":code", async (req, res) => {
    const entry = await Url.findOne({ shortCode: req.params.code });

    if (!entry) {
        res.status(404).json({ error: "Short URL not found" });
        return;
    }

    if (entry.expiresAt && entry.expiresAt < new Date()) {
        await Url.deleteOne({ shortCode: req.params.code });
        res.status(410).json({ error: "Short URL has expired" });
        return;
    }

    entry.clicks += 1;
    await entry.save();

    res.redirect(entry.originalUrl);
})

export default router;
