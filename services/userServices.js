const { prisma } = require("../lib/prisma");

const findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const findUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: { username },
  });
};

const findUserByEmail = (email) => {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
};

const createUser = (data) => {
  return prisma.user.create({
    data: {
      username: data.username,
      name: data.name,
      password_hash: data.password_hash,
      email: data.email || undefined,
    },
  });
};

const updateUser = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

module.exports = {
  findUserByUsername,
  findUserByEmail,
  createUser,
  findUserById,
  updateUser,
};
