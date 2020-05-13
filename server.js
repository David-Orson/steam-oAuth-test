const express = require("express");
const passport = require("passport");
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
      process.nextTick(function () {
        console.log(profile);
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  )
);

app.use(passport.initialize());

app.get("/auth/steam", passport.authenticate("steam"), function (req, res) {});

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  function (req, res) {
    console.log(res);
    res.redirect("/");
  }
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/auth/steam", (req, res) => {});

app.listen(3000, () => console.log("server started"));
