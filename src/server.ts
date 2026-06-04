import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import urlRoutes from './routes/url.js';
import registerRoutes from './routes/register.js';
import loginRoutes from './routes/login.js';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

app.use('/auth', registerRoutes);
app.use('/auth', loginRoutes);
app.use('/', urlRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err: Error) => {
    console.error('❌ MongoDB connection failed:', err.message.replace(/[\r\n]/g, ''));
    process.exit(1);
  });
