import express from "express";
import { createMachine } from "../controllers/machine.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/createMachine").post(createMachine);

export default router;
