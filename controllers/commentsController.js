const { findAllComments } = require("../services/commentServices");

const getAllComments = async (req, res, next) => {
  try {
    const comments = await findAllComments();
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllComments };
