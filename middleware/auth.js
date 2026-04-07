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

const requireOwner = ({ idParam, findById, ownerField }) => {
  return async (req, res, next) => {
    const requesterId = req.user.id;
    const resourceId = req.params[idParam];
    try {
      const resource = await findById(resourceId);
      if (!resource) {
        res.status(404).json({ message: "Resource not found" });
      }
      const ownerId = resource[ownerField];
      if (String(requesterId) !== String(ownerId)) {
        return res
          .status(403)
          .json({ message: "You are not authorized to perform this action" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { requireAuth, requireAuthor, requireOwner };
