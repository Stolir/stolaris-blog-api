const { prisma } = require("../lib/prisma");

// Get
const findCommentById = (id) => {
  return prisma.comment.findUnique({
    where: { id },
  });
};

const findCommentsByArticleId = (articleId) => {
  return prisma.comment.findMany({
    where: {
      articleId,
    },
  });
};

// Create
const createComment = (data) => {
  return prisma.comment.create({
    data,
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
  });
};

module.exports = {
  findCommentById,
  findCommentsByArticleId,
  createComment,
  deleteCommentById,
  updateCommentById,
};
