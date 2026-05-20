const { Router } = require("express");
const { requireOwner, requireAuth } = require("../middleware/auth");
const { deleteComment } = require("../controllers/articleController");
const { findCommentById } = require("../services/commentServices");

const commentRouter = Router();
const ownerCheck = requireOwner({
  idParam: "commentId",
  findById: findCommentById,
  ownerField: "userId",
});

commentRouter.delete("/:commentId", requireAuth, ownerCheck, deleteComment);

module.exports = commentRouter;
