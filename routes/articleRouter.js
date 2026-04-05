const { Router } = require("express");
const {
  getPublishedArticles,
  getArticle,
  deleteComment,
  postComment,
} = require("../controllers/articleController");
const { requireAuth, requireOwner } = require("../middleware/auth");
const { findCommentById } = require("../services/commentServices");
const { validateComment } = require("../middleware/validation");

const articleRouter = Router();
const ownerCheck = requireOwner({
  idParam: "commentId",
  findById: findCommentById,
  ownerField: "userId",
});

articleRouter.get("/", getPublishedArticles);
articleRouter.get("/:slug", getArticle);
articleRouter.post(
  "/:slug/comments",
  requireAuth,
  validateComment,
  postComment,
);
articleRouter.delete(
  "/:slug/comments/:commentId",
  requireAuth,
  ownerCheck,
  deleteComment,
);

module.exports = articleRouter;
