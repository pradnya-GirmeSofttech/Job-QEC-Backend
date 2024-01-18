import mongoose from "mongoose";

const processSchema = new mongoose.Schema({
  processName: {
    type: String,
    required: true,
  },
});

export const Process = mongoose.model("Process", processSchema);
