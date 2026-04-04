const { Router } = require("express");
const { requireAuth, requireAuthor } = require("../middleware/auth");
const { getAllPosts } = require("../controllers/authorController");

const authorRouter = Router();

authorRouter.get("/posts", requireAuth, requireAuthor, getAllPosts);

module.exports = authorRouter;
