const passport = require("passport");
const {
  findUserByUsername,
  findUserById,
} = require("../services/userServices");
const { validatePassword } = require("../lib/passwordUtils");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;

const JWT_SECRET = process.env.JWT_SECRET;

// Local Strategy Setup
const verifyCallbackLocal = async (username, password, done) => {
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Invalid username or password" });
    }

    const isValid = validatePassword(password, user.password_hash);
    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid username or password" });
    }
  } catch (err) {
    done(err);
  }
};

const localStrategy = new LocalStrategy(verifyCallbackLocal);

passport.use(localStrategy);

// JWT Setup
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer <token>
  secretOrKey: JWT_SECRET,
};
const jwtVerifyCallback = async (jwtPayload, done) => {
  try {
    const user = await findUserById(jwtPayload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerifyCallback);

passport.use(jwtStrategy);

module.exports = passport;
