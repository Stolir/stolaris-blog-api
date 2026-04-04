const passport = require("passport");
const { signToken } = require("../lib/authUtils");

const postLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info?.message || "Unauthorized" });
    }
    const token = signToken(user);
    return res.json({
      token,
      user: { id: user.id, username: user.username },
    });
  })(req, res, next);
};

module.exports = { postLogin };
