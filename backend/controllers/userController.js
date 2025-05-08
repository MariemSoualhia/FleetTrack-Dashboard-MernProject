const User = require("../models/User");

// ➕ Create User
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📖 Get all Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📖 Get single User
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update User
const generateToken = require("../utils/generateToken");

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        company: updatedUser.company,
        position: updatedUser.position,
        profileImage: updatedUser.profileImage,
      },
      token: generateToken(updatedUser),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 🔑 Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save(); // 🔐 déclenche le pre('save') pour hachage

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ➕ Update only profile image
exports.updateProfileImage = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
      await user.save();
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        position: user.position,
        profileImage: user.profileImage,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = true;
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const nodemailer = require("nodemailer");

// 📧 Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email not found" });

    // Générer un mot de passe temporaire
    const tempPassword = Math.random().toString(36).slice(-8);
    user.password = tempPassword;
    await user.save();

    // Configurer l’envoi de mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password", // ⚠️ Utilise un mot de passe d'application Gmail
      },
    });

    const mailOptions = {
      from: "FleetPulse <your-email@gmail.com>",
      to: email,
      subject: "FleetPulse - Temporary Password",
      text: `Hello ${user.name},\n\nHere is your temporary password: ${tempPassword}\nPlease log in and change it immediately.\n\nFleetPulse Team`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Temporary password sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Error processing request." });
  }
};
