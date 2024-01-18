import { Process } from "../models/process.js";

export const createProcess = async (req, res) => {
  try {
    const { processName } = req.body;

    const newProcess = await Process.create({
      processName,
    });

    res.status(201).json({
      success: true,
      message: "Process created successfully",
      Process: newProcess,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
