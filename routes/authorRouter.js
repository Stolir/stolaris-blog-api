const { Router } = require("express");
const { requireAuth, requireAuthor } = require("../middleware/auth");
const { getAllArticles } = require("../controllers/authorController");

const authorRouter = Router();

authorRouter.get("/articles", requireAuth, requireAuthor, getAllArticles);

module.exports = authorRouter;
