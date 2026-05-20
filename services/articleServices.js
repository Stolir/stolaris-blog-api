const { prisma } = require("../lib/prisma");

// Get All
const findAllArticles = () => {
  return prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: { user: { select: { name: true, username: true } } },
  });
};

// Get by status
const findArticlesByStatus = (status) => {
  return prisma.article.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, username: true } } },
  });
};

// Get by ID
const findArticleById = (id) => {
  return prisma.article.findUnique({
    where: { id },
    include: { comments: true },
    include: { user: { select: { name: true, username: true } } },
  });
};

// Get by slug
const findArticleBySlug = (slug) => {
  return prisma.article.findUnique({
    where: { slug },
    include: { comments: true },
  });
};

// Get latest for "featured" view
const findLatestArticle = () => {
  return prisma.article.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: {
      createdAt: "desc",
    },
    include: { user: { select: { name: true, username: true } } },
  });
};

const findArticlesByQuery = (query, status) => {
  return prisma.article.findMany({
    where: { title: { contains: query, mode: "insensitive" }, status },
    include: { user: { select: { name: true, username: true } } },
  });
};
// Create
const createArticle = (data) => {
  return prisma.article.create({
    data,
    include: { user: { select: { name: true, username: true } } },
  });
};
// Delete
const deleteArticleById = (id) => {
  return prisma.article.delete({ where: { id } });
};

// Update
const updateArticleById = (id, data) => {
  return prisma.article.update({
    where: { id },
    data,
    include: { user: { select: { name: true, username: true } } },
  });
};

module.exports = {
  findAllArticles,
  findArticlesByStatus,
  findArticleById,
  findArticleBySlug,
  findLatestArticle,
  findArticlesByQuery,
  createArticle,
  deleteArticleById,
  updateArticleById,
};
