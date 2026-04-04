const { Router } = require("express");
const {
  getPublishedArticles,
  getArticle,
  deleteComment,
} = require("../controllers/articleController");
const { requireAuth, requireOwner } = require("../middleware/auth");
const { findCommentById } = require("../services/commentServices");
const { validateComment } = require("../middleware/validation");

const articleRouter = Router();

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
  requireOwner({
    idParam: "commentId",
    findById: findCommentById,
    ownerField: "userId",
  }),
  deleteComment,
);

module.exports = articleRouter;
