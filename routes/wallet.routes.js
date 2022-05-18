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
//*
router.post("/insertcoin", async (req, res, next) => {
  const { cryptoImg, cryptoName, purchasePrice, amount, userID } = req.body;
  const { _id } = req.session.user;

  let coinDetail = await CoinGeckoClient.coins.markets({
    vs_currency: "usd",
    ids: [cryptoName],
  });

  try {
    CryptoModel.create({
      cryptoImg: coinDetail.data[0].image,
      cryptoName,
      purchasePrice,
      amount,
      currentPrice: coinDetail.data[0].current_price,
      purchaseValue: purchasePrice * amount,
      userID: _id,
    });
  } catch (err) {
    next(err);
  }
  res.redirect("/wallet/walletlist");
});

router.get("/walletlist", async (req, res, next) => {
  const { _id } = req.session.user;

  try {
    let walletList = await CryptoModel.find({ userID: _id });

    let nameArr = [];
    let walletNames = walletList.forEach((eachElement) => {
      nameArr.push(eachElement.cryptoName);
    });
    let coinDetail = await CoinGeckoClient.coins.markets({
      vs_currency: "usd",
      ids: nameArr,
    });
    let clearAllData = coinDetail.data;

    let data = await CoinGeckoClient.simple.price({
      ids: nameArr,
      vs_currencies: ["usd"],
    });
    let dataClear = data.data;

    // let priceArr = [];
    // console.log(walletList);
    // let valuesPrices = clearAllData.forEach((eachElement) => {
    //   let allValues = Object.values(eachElement);
    //   priceArr.push(allValues[4]);
    // });

    // priceArr.forEach((eachElement) => {
    //   console.log(eachElement);
    // });

    walletList.forEach((eachElement) => {
      console.log(dataClear[eachElement.cryptoName].usd);
    });

    res.render("wallet/wallet-list.hbs", {
      walletList,
      coinDetailPrice: coinDetail.data,
    });
  } catch (err) {
    next(err);
  }
});

//! ---------- RUTA DETALLES & EDITAR LAS POSICIONES EN CARTERA (WALLET)

// GET "/wallet/:id" => Renderizar la vista en detalle de cada cripto
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  let name = id.cryptoName;

  try {
    let walletList = await CryptoModel.findById(id);
    let walletDetailName = walletList.cryptoName;
    let apiPrice = await CoinGeckoClient.coins.markets({
      vs_currency: "usd",
      ids: [walletDetailName],
    });
    console.log(apiPrice);
    res.render("wallet/wallet-edit.hbs", {
      walletList,
      nowPrice: apiPrice.data,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const { amount, purchasePrice } = req.body;
  try {
    await CryptoModel.findByIdAndUpdate(_id, {
      amount,
      purchasePrice,
    });

    res.redirect("/wallet/walletlist");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
