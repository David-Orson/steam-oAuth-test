const express = require("express");
const passport = require("passport");
const util = require("util");
const session = require("express-session");
const SteamStrategy = require("passport-steam");

const path = require("path");

const app = express();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000/",
      apiKey: "80BCC8822E66DC062CADC819AE0412DB",
    },
    function (identifier, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's Steam profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Steam account with a user record in your database,
        // and return that user instead.
        console.log(profile);
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  )
);

app.use(passport.initialize());

app.get("/auth/steam", passport.authenticate("steam"), function (req, res) {
  // The request will be redirected to Steam for authentication, so
  // this function will not be called.
});

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  function (req, res) {
    console.log(res);
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// Set Static Folder

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/auth/steam", (req, res) => {});

app.listen(3000, () => console.log("server started"));
