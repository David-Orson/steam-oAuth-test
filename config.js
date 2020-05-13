const passport = require("passport");
const SteamStrategy = require("passport-steam");

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000/",
      apiKey: "88C1885F780B9CF6AB6A818EF5413261",
    },
    function (identifier, profile, done) {
      User.findByOpenID({ openId: identifier }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

app.get("/auth/steam", passport.authenticate("steam"), function (req, res) {
  // The request will be redirected to Steam for authentication, so
  // this function will not be called.
});

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
