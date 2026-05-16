const { Router } = require("express");
const { postUsernameAttempt, getUser } = require("../controllers/userRouter");
const { validateUsername } = require("../middleware/validation");

const userRouter = Router();

userRouter.get("/:userId", getUser);
userRouter.post("/username-attempt", validateUsername, postUsernameAttempt);

module.exports = userRouter;
