import 'dotenv/config';
import express from "express";
import urlRoutes from './routes/url.js';
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use('/', urlRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });
