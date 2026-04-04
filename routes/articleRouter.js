const { Router } = require("express");
const {
  getAllArticles,
  getArticle,
  deleteComment,
} = require("../controllers/articleController");
const { requireAuth, requireOwner } = require("../middleware/auth");
const { findCommentById } = require("../services/commentServices");

const articleRouter = Router();

articleRouter.get("/", getAllArticles);
articleRouter.get("/:slug", getArticle);
articleRouter.post("/:slug/comments", requireAuth, postComment);
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
