const router = require("express").Router();
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const CryptoModel = require("../models/Crypto.model.js");

//* GET ("/wallet/wallet") => Renderiza la vista de "My Wallet" al usuario logueado
router.get("/insertcoin", async (req, res, next) => {
  try {
    let marketCoin = await CoinGeckoClient.coins.markets();
    res.render("wallet/wallet-insertcoin.hbs", {
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
  res.redirect("/wallet/walletlist")
});

router.get("/walletlist", async (req, res, next) => {
  const { _id } = req.session.user;
  console.log(_id)
  try {
    let walletList = await CryptoModel.find({userID:_id})
    let walletName = await CryptoModel.find({userID:_id}).select("cryptoName")
    let geckoClient = await CoinGeckoClient.coins.markets()
    
    // console.log(walletList)
    res.render("wallet/wallet-list.hbs", {
      walletList,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
