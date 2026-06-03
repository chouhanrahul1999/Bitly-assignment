import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  expiresAt: Date | null;
  createdAt: Date;
  userId: mongoose.Types.ObjectId;
}

const UrlSchema = new Schema<IUrl>({
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

export default mongoose.model<IUrl>("Url", UrlSchema);
