import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
  machineName: {
    type: String,
    required: true,
  },
});

export const Machine = mongoose.model("Machine", machineSchema);
