import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import {
  emptyPassword,
  invalidToken,
  notUniquePassword,
} from "shared/authErrors";
import { sendError } from "shared/helpers";
import { User } from "models";

passport.use(
  "reset-password",
  new LocalStrategy(
    {
      usernameField: "token",
      passwordField: "password",
    },
    async (token, password, done) => {
      try {
        // check to see if email exists in the db
        const existingUser = await User.findOne({ token });
        if (!existingUser) throw invalidToken;

        // compare newpassword to existingUser password
        const samePassword = await existingUser.comparePassword(password);
        if (samePassword) throw notUniquePassword;

        // hash new password before saving
        const newPassword = await User.createPassword(password);

        // update user's password
        await User.updateOne(
          { _id: existingUser._id },
          { $set: { password: newPassword } },
        );

        return done(null, existingUser.email);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

/**
 * Middleware function to update a user's password.
 *
 * @function updatePassword
 * @returns {function}
 * @throws {string}
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token) throw invalidToken;
    if (!password) throw emptyPassword;
    req.body.email = token;

    const existingUser = await new Promise((resolve, reject) => {
      passport.authenticate("reset-password", (err, existingEmail) => (err ? reject(err) : resolve(existingEmail)))(req, res, next);
    });

    req.user = existingUser;

    return next();
  } catch (err) {
    return sendError(err, res);
  }
};

export default updatePassword;
