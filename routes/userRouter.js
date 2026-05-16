const { Router } = require("express");
const { postUsernameAttempt } = require("../controllers/userRouter");
const { validateUsername } = require("../middleware/validation");

const userRouter = Router();

userRouter.post("/username-attempt", validateUsername, postUsernameAttempt);

module.exports = userRouter;
