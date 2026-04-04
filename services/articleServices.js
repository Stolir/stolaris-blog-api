const { prisma } = require("../lib/prisma");

// Get All
const findAllArticles = () => {
  return prisma.article.findMany();
};

// Get by status
const findArticlesByStatus = (status) => {
  return prisma.article.findMany({ where: { status } });
};

// Get by ID
const findArticleById = (id) => {
  return prisma.article.findUnique({
    where: { id },
    include: { comments: true },
  });
};

// Get by slug
const findArticleBySlug = (slug) => {
  return prisma.article.findUnique({
    where: { slug },
    include: { comments: true },
  });
};
// Create
const createArticle = (data) => {
  return prisma.article.create({
    data,
  });
};
// Delete
const deleteArticle = (id) => {
  return prisma.article.delete({ where: { id } });
};

// Update
const updateArticle = (id, data) => {
  return prisma.article.update({
    where: { id },
    data,
  });
};

module.exports = {
  findAllArticles,
  findArticlesByStatus,
  findArticleById,
  findArticleBySlug,
  createArticle,
  deleteArticle,
  updateArticle,
};
