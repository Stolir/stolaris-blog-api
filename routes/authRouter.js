const { Router } = require("express");
const {
  validateLogin,
  validateUserUpdate,
} = require("../middleware/validation");
const {
  postLogout,
  getMe,
  postAuthorLogin,
  postUserLogin,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const authRouter = Router();

authRouter.post("/login", validateLogin, postUserLogin);
authRouter.post("/login/author", validateLogin, postAuthorLogin);
authRouter.get("/me", requireAuth, getMe);
authRouter.post("/logout", requireAuth, postLogout);
authRouter.patch("/me", requireAuth, validateUserUpdate);

module.exports = authRouter;
