const { Router } = require("express");
const {
  getPublishedArticles,
  getArticle,
  deleteComment,
  postComment,
  searchArticles,
  getFeaturedArticle,
  getComments,
} = require("../controllers/articleController");
const {
  requireAuth,
  requireOwner,
  optionalAuth,
} = require("../middleware/auth");
const { findCommentById } = require("../services/commentServices");
const { validateComment } = require("../middleware/validation");

const articleRouter = Router();

articleRouter.get("/", getPublishedArticles);
articleRouter.get("/search", searchArticles);
articleRouter.get("/featured", getFeaturedArticle);
articleRouter.get("/:slug", getArticle);

articleRouter.get("/:id/comments", getComments);
articleRouter.post("/:id/comments", optionalAuth, validateComment, postComment);

module.exports = articleRouter;
