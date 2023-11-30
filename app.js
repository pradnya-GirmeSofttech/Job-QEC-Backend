import express from "express";
import User from "./routers/User.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import Job from "./routers/Job.js";
export const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://job-qec.netlify.app",
];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(
//   cors({
//     origin: "https://job-qec.netlify.app", // Set the origin of your frontend
//     credentials: true, // Allow cookies and credentials to be sent
//   })
// );
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Check if the origin is in the allowedOrigins array or if it's undefined (for same-origin requests)
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Allow cookies and credentials to be sent
//   })
// );

app.use(cookieParser());
app.use("/api/v1", User);
app.use("/api/v1", Job);
