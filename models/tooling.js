import mongoose from "mongoose";

const toolingSchema = new mongoose.Schema({
  toolingName: {
    type: String,
    required: true,
  },
});

export const Tooling = mongoose.model("Tooling", toolingSchema);
