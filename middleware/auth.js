const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });

const requireAuthor = (req, res, next) => {
  if (!req.user.isAuthor) {
    return res
      .status(403)
      .json({ message: "You do not have permission to view this resource" });
  }
  next();
};

module.exports = { requireAuth, requireAuthor };
