const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      company: user.company,
      position: user.position,
      profileImage: user.profileImage,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

module.exports = generateToken;
