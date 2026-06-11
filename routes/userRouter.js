const { Router } = require("express");
const {
  postUsernameAttempt,
  getUser,
  getUserComments,
} = require("../controllers/userRouter");
const { validateUsername } = require("../middleware/validation");

const userRouter = Router();

userRouter.get("/:userId", getUser);
userRouter.get("/:userId/comments", getUserComments);
userRouter.post("/username-attempt", validateUsername, postUsernameAttempt);

module.exports = userRouter;
