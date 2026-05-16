const passport = require("passport");
const { signToken } = require("../lib/authUtils");
const { matchedData } = require("express-validator");
const { findUserById, updateUser } = require("../services/userServices");
const {
  validatePassword,
  generateHashedPassword,
} = require("../lib/passwordUtils");

const issueTokenResponse = (res, user) => {
  const token = signToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  return res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    },
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
      email: user.email,
    },
  });
};

const patchUserUpdate = async (req, res, next) => {
  const data = matchedData(req);
  const { newPassword, confirmNewPassword, currentPassword, ...rest } = data;
  const userId = req.user.id;
  let newHash;
  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (newPassword) {
      // changing password or email requires current password
      const isValidPass = validatePassword(currentPassword, user.password_hash);
      if (!isValidPass) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      newHash = generateHashedPassword(newPassword);
    }
    const newUser = await updateUser(userId, {
      ...rest,
      ...(newHash && { password_hash: newHash }),
    });
    return res.json({ user: rest });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  postUserLogin,
  postLogout,
  getMe,
  postAuthorLogin,
  patchUserUpdate,
};
