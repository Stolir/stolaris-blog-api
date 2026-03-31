const { matchedData } = require("express-validator");
const { createUser } = require("../services/userServices");
const { generateHashedPassword } = require("../lib/passwordUtils");

const postRegistration = async (req, res, next) => {
  const data = matchedData(req, {
    onlyValidData: true,
    includeOptionals: true,
  });

  try {
    const { password, confirmPassword, ...rest } = data;
    const password_hash = generateHashedPassword(data.password);
    const user = await createUser({
      ...rest,
      password_hash,
    });
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        isAuthor: user.isAuthor,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = { postRegistration };
