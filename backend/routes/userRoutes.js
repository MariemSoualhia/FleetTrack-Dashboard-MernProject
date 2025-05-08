const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  updateProfileImage,
  approveUser,
  forgotPassword,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Routes publiques
router.post("/", createUser);
router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);

// ✅ Routes protégées (authentification requise)
router.put("/:id", protect, updateUser); // 🔧 Modifier profil
router.delete("/:id", protect, deleteUser); // ❌ Supprimer
router.put("/:id/change-password", protect, changePassword); // 🔑 Changer mot de passe
router.put(
  "/:id/profile-image",
  protect,
  upload.single("profileImage"),
  updateProfileImage
);
router.put("/:id/approve", protect, approveUser);
router.post("/forgot-password", forgotPassword);

module.exports = router;
