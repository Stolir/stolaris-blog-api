const { matchedData } = require("express-validator");
const {
  findArticlesByStatus,
  findArticleBySlug,
} = require("../services/articleServices");
const {
  createComment,
  deleteCommentById,
} = require("../services/commentServices");

const getPublishedArticles = async (req, res, next) => {
  try {
    const articles = await findArticlesByStatus("PUBLISHED");
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

const getArticle = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const article = await findArticleBySlug(slug);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    const isPublished = article.status === "PUBLISHED";

    if (!isPublished && !req.user) {
      return res
        .status(401)
        .json({ message: "You must be authenticated to view this resource" });
    }

    if (!isPublished && !req.user.isAuthor) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this resource" });
    }

    res.json(article);
  } catch (err) {
    next(err);
  }
};

const postComment = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const comment = await createComment({
      userId: req.user.id,
      text: data.text,
      articleId: req.params.articleId ?? null,
      parentId: req.body.parentId ?? null,
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    await deleteCommentById(commentId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArticle,
  getPublishedArticles,
  postComment,
  deleteComment,
};
