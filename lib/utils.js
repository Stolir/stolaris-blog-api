function buildCommentsTree(comments, parentId = null) {
  return comments
    .filter((c) => c.parentId === parentId)
    .map((c) => ({ ...c, replies: buildCommentsTree(comments, c.id) }));
}

module.exports = {
  buildCommentsTree,
};
