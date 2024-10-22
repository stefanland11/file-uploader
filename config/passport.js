const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Replace raw SQL with Prisma query to find user by username
      const user = await prisma.user.findUnique({
        where: { username: username },
      });

      if (!user) {
        console.log("incorrect user");
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log("incorrect pass");
        return done(null, false, { message: "Incorrect password" });
      }
      console.log("succeess");
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"));
    }
  } catch (err) {
    done(err);
  }
});

module.exports = passport;