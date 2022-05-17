const router = require("express").Router();
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const CryptoModel = require("../models/Crypto.model.js");

//* GET ("/wallet/wallet") => Renderiza la vista de "My Wallet" al usuario logueado
router.get("/insertcoin", async (req, res, next) => {
  try {
    let marketCoin = await CoinGeckoClient.coins.markets();
    res.render("wallet/wallet.hbs", {
      walletData: marketCoin.data,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/insertcoin", async (req, res, next) => {
  const { cryptoName, purchasePrice, amount, userID } = req.body;
  const { _id } = req.session.user;
  try {
    CryptoModel.create({
      cryptoName,
      purchasePrice,
      amount,
      userID: _id,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/editwallet", async (req, res, next) => {
  const { _id } = req.session.user;
  try {
    let walletList = CryptoModel.findById(_id);
    res.render("wallet/wallet-list.hbs", {
      walletList,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
