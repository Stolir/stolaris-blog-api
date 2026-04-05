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
  publishArticle,
  draftArticle,
  archiveArticle,
  unpublishArticle,
} = require("../controllers/articleController");
const { findArticleById } = require("../services/articleServices");
const { validateArticle } = require("../middleware/validation");

const authorRouter = Router();

authorRouter.use(requireAuth, requireAuthor);
const ownerCheck = requireOwner({
  idParam: "articleId",
  findById: findArticleById,
  ownerField: "userId",
});

authorRouter.get("/articles", getAllArticles);

authorRouter.post("/articles", validateArticle, postArticle);

// Separate route for every status update
authorRouter.post("/articles/:articleId/publish", ownerCheck, publishArticle);
authorRouter.post(
  "/articles/:articleId/unpublish",
  ownerCheck,
  unpublishArticle,
);
authorRouter.post("/articles/:articleId/draft", ownerCheck, draftArticle);
authorRouter.post("/articles/:articleId/archive", ownerCheck, archiveArticle);

authorRouter.delete("/articles/:articleId", ownerCheck, deleteArticle);

authorRouter.patch(
  "/articles/:articleId",
  ownerCheck,
  validateArticle,
  updateArticle,
);

module.exports = authorRouter;
