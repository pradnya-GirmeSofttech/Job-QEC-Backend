import { Tooling } from "../models/tooling.js";

export const createTools = async (req, res) => {
  try {
    const { toolingName } = req.body;

    const newTools = await Tooling.create({
      toolingName,
    });
    res.status(201).json({
      success: true,
      message: "Tools created successfully",
      tools: newTools,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
