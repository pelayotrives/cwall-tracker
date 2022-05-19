const router = require("express").Router();

// Home
router.get("/", (req, res, next) => {
  res.render("index");
});

// Auth
const authRouthes = require("./auth.routes.js");
router.use("/auth", authRouthes);

// Profile
const profileRoutes = require("./profile.routes.js");
router.use("/profile", profileRoutes);

// Coins
const coinsRoutes = require("./coinprice.routes.js")
router.use("/coinprice", coinsRoutes)

// Wallet
const walletRoutes = require("./wallet.routes.js")
router.use("/wallet", walletRoutes)


module.exports = router;
