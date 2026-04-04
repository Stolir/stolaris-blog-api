// ========= Posts =========

const { prisma } = require("../lib/prisma");

// Get All
const findAllPosts = () => {
  return prisma.post.findMany();
};

// Get by status
const findPostsByStatus = (status) => {
  return prisma.post.findMany({ where: { status } });
};

// Get by ID
const findPostById = (id) => {
  return prisma.post.findUnique({ where: { id } });
};

// Get by slug
const findPostBySlug = (slug) => {
  return prisma.post.findUnique({ where: { slug } });
};
// Create
const createPost = (data) => {
  return prisma.post.create({
    data,
  });
};
// Delete
const deletePost = (id) => {
  return prisma.post.delete({ where: { id } });
};

// Update
const updatePost = (id, data) => {
  return prisma.post.update({
    where: { id },
    data,
  });
};

module.exports = {
  findAllPosts,
  findPostsByStatus,
  findPostById,
  findPostBySlug,
  createPost,
  deletePost,
  updatePost,
};
