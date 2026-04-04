const { prisma } = require("../lib/prisma");

// Create
const createComment = (data) => {
  return prisma.comment.create({
    data,
  });
};

// Delete
const deleteComment = (id) => {
  return prisma.comment.delete({
    where: {
      id,
    },
  });
};

// Update
const updateComment = (id, data) => {
  return prisma.comment.update({
    where: {
      id,
    },
    data,
  });
};

module.exports = {
  createComment,
  deleteComment,
  updateComment,
};
