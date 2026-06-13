const { Router } = require("express");
const { requireOwner, requireAuth } = require("../middleware/auth");
const { deleteComment } = require("../controllers/commentsController");
const { findCommentById } = require("../services/commentServices");
const { getAllComments } = require("../controllers/commentsController");

const commentRouter = Router();
const ownerCheck = requireOwner({
  idParam: "commentId",
  findById: findCommentById,
  ownerField: "userId",
});

const deleteAuthCheck = (req, res, next) => {
  if (req.user.isAuthor) {
    return next();
  } else {
    return ownerCheck(req, res, next);
  }
};

commentRouter.get("/", getAllComments);

commentRouter.delete(
  "/:commentId",
  requireAuth,
  deleteAuthCheck,
  deleteComment,
);

module.exports = commentRouter;
