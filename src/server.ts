import 'dotenv/config';
import express from "express";
import helmet from "helmet";
import urlRoutes from './routes/url.js';
import registerRoutes from './routes/register.js';
import loginRoutes from './routes/login.js';
import mongoose from "mongoose";

const app = express();
app.use(helmet());
app.use(express.json());

app.use('/auth', registerRoutes);
app.use('/auth', loginRoutes);
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
    .catch((err: Error) => {
        console.error("Failed to connect to MongoDB", err.message.replace(/[\r\n]/g, ''));
        process.exit(1);
    });
