const { Router } = require("express");
const { validateRegistration } = require("../middleware/validation");
const { postRegistration } = require("../controllers/registerController");

const registerRouter = Router();

registerRouter.post("/", validateRegistration, postRegistration);

module.exports = registerRouter;
