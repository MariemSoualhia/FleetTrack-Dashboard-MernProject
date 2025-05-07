const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    // ✅ Envoie le user + token dans le bon format
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: generateToken(user), // ✅ ici on envoie l'objet user complet
    });
    console.log(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isApproved && user.role !== "manager") {
        return res
          .status(403)
          .json({ message: "Your account is not yet approved." });
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
        token: generateToken(user), // ✅ objet user ici aussi
      });
      console.log(user);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
