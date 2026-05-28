import { Schema, model, Document } from "mongoose";

export interface ICounterDocument extends Document {
  key: string;
  seq: number;
  createdAt: Date;
  updatedAt: Date;
}

const counterSchema = new Schema<ICounterDocument>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    seq: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const CounterModel = model<ICounterDocument>("Counter", counterSchema);

