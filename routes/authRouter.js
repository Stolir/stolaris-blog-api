const { Router } = require("express");
const { validateLogin } = require("../middleware/validation");
const { postLogin } = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/login", validateLogin, postLogin);

module.exports = authRouter;
