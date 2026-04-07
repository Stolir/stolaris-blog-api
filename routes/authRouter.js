const { Router } = require("express");
const { validateLogin } = require("../middleware/validation");
const {
  postLogin,
  postLogout,
  getMe,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const authRouter = Router();

authRouter.post("/login", validateLogin, postLogin);
authRouter.get("/me", requireAuth, getMe);
authRouter.post("/logout", requireAuth, postLogout);

module.exports = authRouter;
