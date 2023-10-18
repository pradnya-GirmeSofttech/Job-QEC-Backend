import express from "express";
import {
  login,
  register,
  logout,
  updatePassword,
  forgetPassword,
  resetPassword,
  addUser,
  updateUser,
  deleteUser,
  viewUserDetails,
  getMyProfile,
  getUsersWithUserRole,
  resetUserPassword,
  fetchUser,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/updatepassword").put(isAuthenticated, updatePassword);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/user").get(isAuthenticated, fetchUser);
router.route("/forgotpassword").post(forgetPassword);
router.route("/resetpassword").put(resetPassword);
router.route("/adduser").post(addUser);
router.route("/edituser/:id").put(isAuthenticated, updateUser);
router.route("/deleteuser/:id").delete(deleteUser);
router.route("/viewuser/:id").get(viewUserDetails);
router.route("/users").get(getUsersWithUserRole);
router.route("/resetuserpassword").put(resetUserPassword);

export default router;
