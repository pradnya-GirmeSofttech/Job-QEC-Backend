import express from "express";

import { isAuthenticated } from "../middleware/auth.js";
import {
  createJob,
  deleteJob,
  generatePdf,
  getAllJob,
  updateJob,
  viewJob,
  generateReport,
  copyJob,
} from "../controllers/job.js";

const router = express.Router();

router.route("/createjob").post(isAuthenticated, createJob);

router.route("/updatejob/:id").put(isAuthenticated, updateJob);
router.route("/deletejob/:id").delete(isAuthenticated, deleteJob);
router.route("/viewjob/:id").get(isAuthenticated, viewJob);
router.route("/jobs").get(isAuthenticated, getAllJob);
router.route("/generatePdf/:id").get(generatePdf);
router.route("/reports/generate").get(isAuthenticated, generateReport);
router.route("copyJob/:id").post(copyJob);

export default router;
