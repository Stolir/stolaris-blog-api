const { matchedData } = require("express-validator");
const {
  findArticlesByStatus,
  findArticleBySlug,
  findAllArticles,
  createArticle,
  updateArticleById,
  deleteArticleById,
} = require("../services/articleServices");
const {
  createComment,
  deleteCommentById,
} = require("../services/commentServices");
const slugify = require("slugify");

const getPublishedArticles = async (req, res, next) => {
  try {
    const articles = await findArticlesByStatus("PUBLISHED");
    return res.json(articles);
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

    return res.json(article);
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
    return res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    await deleteCommentById(commentId);
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

// =========== AUTHOR PROTECTED ACTIONS ==============

// Retrieves all articles regardless of their status
const getAllArticles = async (req, res, next) => {
  try {
    const articles = await findAllArticles();
    return res.json(articles);
  } catch (err) {
    next(err);
  }
};

// post new article
const postArticle = async (req, res, next) => {
  const { title, content } = matchedData(req);
  const userId = req.user.id;
  const slug = slugify(title);
  try {
    const article = await createArticle({ userId, title, content, slug });
    return res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

// update article status factory
const updateArticleStatus = (status) => async (req, res, next) => {
  try {
    const article = await updateArticleById(req.params.articleId, { status });
    return res.json(article);
  } catch (err) {
    next(err);
  }
};

const publishArticle = updateArticleStatus("PUBLISHED");
const unpublishArticle = updateArticleStatus("UNPUBLISHED");
const draftArticle = updateArticleStatus("DRAFT");
const archiveArticle = updateArticleStatus("ARCHIVE");

// delete article
const deleteArticle = async (req, res, next) => {
  const { articleId } = req.params;
  try {
    await deleteArticleById(articleId);
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

// Update Article
const updateArticle = async (req, res, next) => {
  let slug;
  const data = matchedData(req);
  const { articleId } = req.params;
  if (data.title) {
    slug = slugify(data.title);
  }
  try {
    const article = await updateArticleById(articleId, {
      ...data,
      ...(slug && { slug }),
    });
    return res.json(article);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArticle,
  getPublishedArticles,
  postComment,
  deleteComment,
  getAllArticles,
  postArticle,
  publishArticle,
  unpublishArticle,
  draftArticle,
  archiveArticle,
  deleteArticle,
  updateArticle,
};
