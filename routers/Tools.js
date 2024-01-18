import express from "express";
import { createTools } from "../controllers/tooling.js";
const router = express.Router();

router.route("/createTools").post(createTools);

export default router;
