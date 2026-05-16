const { matchedData } = require("express-validator");
const { findUserByUsername } = require("../services/userServices");

const postUsernameAttempt = async (req, res, next) => {
  const { username } = matchedData(req);
  try {
    const user = await findUserByUsername(username);
    if (user) {
      return res.json({ available: false });
    }
    return res.json({ available: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = { postUsernameAttempt };
