import { User } from "../models/users.js";
import { generatePassword } from "../utils/generatePassword.js";
import { sendMail } from "../utils/sendmail.js";
import { sendToken } from "../utils/sendToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    sendToken(res, user, 201, "Successfully register");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    console.log("user", user);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("ismatch", isMatch);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    sendToken(res, user, 200, "Login Successful");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchUser = async (req, res) => {
  try {
    // User data is available in req.user due to the isAuthenticated middleware
    const user = req.user;

    // Respond with the user data
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    let { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Old Password" });
    }

    user.password = newPassword;

    await user.save();
    sendToken(user, 200, res);
    res
      .status(200)
      .json({ success: true, message: "Password Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    const message = `Your OTP for reseting the password ${otp}. If you did not request for this, please ignore this email.`;

    await sendMail(email, "Request for Reseting Password", message);

    res.status(200).json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Otp Invalid or has been Expired" });
    }
    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: `Password Changed Successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new User
export const addUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Generate a random password
    const randomPassword = generatePassword();

    // Compose the email text
    const text = `Welcome to QEC!! 
      Please find your login details below.
      Email: ${email}
      Password: ${randomPassword} `;

    // Send the mail
    await sendMail(email, "Invitation mail", text);

    // Create the user
    user = await User.create({
      name,
      email,
      password: randomPassword,
      role: "user",
    });

    // Send the response
    sendToken(
      res,
      user,
      201,
      "Credentials sent to your email, please login your account"
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, role } = req.body;
    // Find the user by ID
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Update user data
    user.name = name;
    user.email = email;
    user.role = role;

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the user by ID and remove them
    const result = await User.deleteOne({ _id: id });

    // Check if the user was found and deleted
    if (result.n === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// view user details
export const viewUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Remove sensitive information (e.g., password) if needed
    const userDetails = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Add other user details you want to expose
    };

    res.status(200).json({ success: true, user: userDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.user._id);
    console.log(req.user.role);
    if (req.user.role === "admin" || req.user.role === "user") {
      const user = await User.findById(req.user._id);
      res.status(201).json({ success: true, user });
    }

    // sendToken(res, user, 201, `Welcome back ${user.name}`);
    // res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch user

export const getUsersWithUserRole = async (req, res) => {
  const { role } = req.query;
  try {
    // Query the database for users with the "user" role
    const users = await User.find({ role: "user" });

    // Send the user data as a JSON response
    res.status(200).json({ success: true, users });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Reset user password
export const resetUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Check if the provided current password matches the user's current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
