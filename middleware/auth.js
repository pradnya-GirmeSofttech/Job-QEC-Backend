import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "Login first" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    // Check user role and restrict access if necessary
    // if (req.user.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Access denied. Admins only." });
    // }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
