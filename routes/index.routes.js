const router = require("express").Router();

// Home
router.get("/", (req, res, next) => {
  res.render("index");
});

// Auth
const authRouthes = require("./auth.routes.js");
router.use("/auth", authRouthes);

// Profile
// const profileRoutes = require("./profile.routes.js");
// router.use("/profile", profileRoutes);

module.exports = router;
