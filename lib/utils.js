export function buildCommentTree(comments, parentId = null) {
  return comments
    .filter((c) => c.parentId === parentId)
    .map((c) => ({ ...c, replies: buildCommentTree(comments, c.id) }));
}
