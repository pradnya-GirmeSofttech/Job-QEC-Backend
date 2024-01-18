import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createProcess } from "../controllers/process.js";

const router = express.Router();

router.route("/createProcess").post(createProcess);

export default router;
