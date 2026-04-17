const passport = require("passport");
const { signToken } = require("../lib/authUtils");

const issueTokenResponse = (res, user) => {
  const token = signToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  return res.json({
    user: { id: user.id, username: user.username, name: user.name },
  });
};

const postUserLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info?.message || "Unauthorized" });
    }
    issueTokenResponse(res, user);
  })(req, res, next);
};

const postAuthorLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info?.message || "Unauthorized" });
    }
    if (!user.isAuthor) {
      return res.status(401).json({ message: "An author account is required" });
    }
    issueTokenResponse(res, user);
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

const getMe = (req, res, next) => {
  const user = req.user;
  return res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
    },
  });
};

module.exports = { postUserLogin, postLogout, getMe, postAuthorLogin };
