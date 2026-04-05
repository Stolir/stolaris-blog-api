const { Router } = require("express");
const {
  requireAuth,
  requireAuthor,
  requireOwner,
} = require("../middleware/auth");
const {
  getAllArticles,
  postArticle,
  deleteArticle,
  updateArticle,
} = require("../controllers/authorController");
const { findArticleById } = require("../services/articleServices");

const authorRouter = Router();

authorRouter.get("/articles", requireAuth, requireAuthor, getAllArticles);
authorRouter.post("/articles", requireAuth, requireAuthor, postArticle);
authorRouter.delete(
  "/articles/:articleId",
  requireAuth,
  requireAuthor,
  requireOwner({
    idParam: "articleId",
    findById: findArticleById,
    ownerField: "userId",
  }),
  deleteArticle,
);
authorRouter.patch(
  "/articles/:articleId",
  requireAuth,
  requireAuthor,
  requireOwner({
    idParam: "articleId",
    findById: findArticleById,
    ownerField: "userId",
  }),
  updateArticle,
);
module.exports = authorRouter;
