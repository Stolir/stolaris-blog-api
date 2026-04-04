const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const signToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      isAuthor: user.isAuthor,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};

module.exports = { signToken };
