const passport = require("passport");
const { signToken } = require("../lib/authUtils");

const postLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info?.message || "Unauthorized" });
    }
    const token = signToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    return res.json({
      user: { id: user.id, username: user.username },
    });
  })(req, res, next);
};

const postLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.json({ message: "Logged out successfully" });
};

module.exports = { postLogin, postLogout };
