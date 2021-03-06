import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { missingEmailCreds } from "shared/authErrors";
import { createDate, createRandomToken, sendError } from "shared/helpers";
import { newPasswordTemplate } from "services/templates";
import { Mail, User } from "models";

const { CLIENT } = process.env;

passport.use(
  "reset-token",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, _, done) => {
      try {
        // create a new token for email reset
        const token = createRandomToken();

        // check to see if email exists in the db
        const existingUser = await User.findOne({ email });
        if (!existingUser) throw missingEmailCreds;

        // add token to user
        await User.updateOne({ email }, { token });

        // creates an email template for a password reset
        await Mail.create({
          sendTo: `${existingUser.firstName} ${existingUser.lastName} <${existingUser.email}>`,
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          sendDate: createDate().toDate(),
          subject: "Password Reset Confirmation",
          message: newPasswordTemplate(
            CLIENT,
            existingUser.firstName,
            existingUser.lastName,
            token,
          ),
        });

        return done(null, existingUser.email);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

/**
 * Middleware function to send a new token (authorization key) to a user.
 *
 * @function resetToken
 * @returns {function}
 */
export const resetToken = async (req, res, next) => {
  try {
    const { email } = req.body;
    req.body.password = "reset-password";

    if (!email) throw missingEmailCreds;

    const existingUser = await new Promise((resolve, reject) => {
      passport.authenticate("reset-token", (err, existingEmail) => (err ? reject(err) : resolve(existingEmail)))(req, res, next);
    });

    req.user = existingUser;

    return next();
  } catch (err) {
    return sendError(err, res);
  }
};

export default resetToken;
