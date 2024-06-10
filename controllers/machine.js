import { Machine } from "../models/machins.js";

export const createMachine = async (req, res) => {
  try {
    const { machineName } = req.body;

    const newMachine = await Machine.create({
      machineName,
    });

    res.status(201).json({
      success: true,
      message: "Machine created successfully",
      Machine: newMachine,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
