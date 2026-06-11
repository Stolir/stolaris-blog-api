const { matchedData } = require("express-validator");
const {
  findUserByUsername,
  findUserById,
} = require("../services/userServices");
const { findCommentsByUserId } = require("../services/commentServices");

const postUsernameAttempt = async (req, res, next) => {
  const { username } = matchedData(req);
  try {
    const user = await findUserByUsername(username);
    if (user) {
      return res.json({ available: false });
    }
    return res.json({ available: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await findUserById(Number(userId));
    // Since this is not a protected route, only return safe information
    return res.json({
      name: user.name,
      username: user.username,
      isAuthor: user.isAuthor,
    });
  } catch (err) {
    next(err);
  }
};

const getUserComments = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const comments = await findCommentsByUserId(Number(userId));
    return res.json(comments);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUser, postUsernameAttempt, getUserComments };
