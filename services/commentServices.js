const { prisma } = require("../lib/prisma");

// Get
const findCommentById = (id) => {
  return prisma.comment.findUnique({
    where: { id },
    include: { user: { select: { name: true, username: true } } },
  });
};

const findCommentsByArticleId = (articleId) => {
  return prisma.comment.findMany({
    where: {
      articleId,
    },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, username: true } } },
  });
};

// Create
const createComment = (data) => {
  return prisma.comment.create({
    data,
    include: { user: { select: { name: true, username: true } } },
  });
};

// Delete
const deleteCommentById = (id) => {
  return prisma.comment.delete({
    where: {
      id,
    },
  });
};

// Update
const updateCommentById = (id, data) => {
  return prisma.comment.update({
    where: {
      id,
    },
    data,
    include: { user: { select: { name: true, username: true } } },
  });
};

module.exports = {
  findCommentById,
  findCommentsByArticleId,
  createComment,
  deleteCommentById,
  updateCommentById,
};
