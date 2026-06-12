const {
  findAllComments,
  deleteCommentById,
} = require("../services/commentServices");

const getAllComments = async (req, res, next) => {
  try {
    const comments = await findAllComments();
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    await deleteCommentById(Number(commentId));
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllComments, deleteComment };
