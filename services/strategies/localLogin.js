import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { User } from "models";
import { sendError } from "shared/helpers";
import { badCredentials, invalidStatus } from "shared/authErrors";

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // see if the user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) throw badCredentials;
        if (existingUser.status !== "active") throw invalidStatus;

        // compare password to existingUser password
        const validPassword = await bcrypt.compare(
          password,
          existingUser.password,
        );
        if (!validPassword) throw badCredentials;

        return done(null, existingUser);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

/**
 * Middleware function to login in a user (applies user to req.session).
 *
 * @function localLogin
 * @returns {function}
 * @throws {string}
 */
export const localLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return sendError(badCredentials, res);

  try {
    const existingUser = await new Promise((resolve, reject) => {
      passport.authenticate("local-login", (err, user) => (err ? reject(err) : resolve(user)))(req, res, next);
    });

    req.session.user = {
      id: existingUser._id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      role: existingUser.role,
    };

    return next();
  } catch (err) {
    return sendError(err, res);
  }
};

export default localLogin;
