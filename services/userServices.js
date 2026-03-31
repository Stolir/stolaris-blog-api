const { prisma } = require("../lib/prisma");

const findUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: { username },
  });
};

module.exports = { findUserByUsername };
