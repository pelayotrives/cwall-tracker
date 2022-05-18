const router = require("express").Router();
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const CryptoModel = require("../models/Crypto.model.js");
const User = require("../models/User.model.js");

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

    let nameArr = []; // array de nombres de las monedas de nuestro usuario
    let walletNames = walletList.forEach((eachElement) => {
      nameArr.push(eachElement.cryptoName);
    });
    let coinDetail = await CoinGeckoClient.coins.markets({
      vs_currency: "usd",
      ids: nameArr,
    });
    let clearAllData = coinDetail.data;

    let data = await CoinGeckoClient.simple.price({
      //Llamada de la API solo precios
      ids: nameArr,
      vs_currencies: ["usd"],
    });
    let dataClear = data.data;

    //PROFIT
    walletList.forEach((eachElement) => {
      eachElement.profit = //! Itera por cada propiedad del modelo
        //Funcionalidad de conseguir el profit
        dataClear[eachElement.cryptoName].usd * eachElement.amount -
        eachElement.amount * eachElement.purchasePrice;
    });

    //PROFIT TO FIXED
    walletList.forEach((eachElement) => {
      eachElement.profit = eachElement.profit.toFixed(2);
    });

    //PROFIT PERCENTAGE
    walletList.forEach((eachElement) => {
      eachElement.profitPercentage =
        (dataClear[eachElement.cryptoName].usd * 100) /
          eachElement.purchasePrice -
        100;
    });

    //PROFIT PERCENTAGE TO FIXED
    walletList.forEach((eachElement) => {
      eachElement.profitPercentage = eachElement.profitPercentage.toFixed(3);
    });

    //YOUR PROFIT
    let yourProfit = 0;
    walletList.forEach((eachElement) => {
      yourProfit += eachElement.profit;
    });

    res.render("wallet/wallet-list.hbs", {
      walletList,
      yourProfit,
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
  const { user } = req.session;

  try {
    let walletList = await CryptoModel.findById(id);
    let walletDetailName = walletList.cryptoName;
    let apiPrice = await CoinGeckoClient.coins.markets({
      vs_currency: "usd",
      ids: [walletDetailName],
    });

    //Datos del usuario

    let profile = await User.findById(user._id);

    res.render("wallet/wallet-edit.hbs", {
      walletList,
      nowPrice: apiPrice.data,
      profile,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const { amount, purchasePrice, purchaseValue } = req.body;
  try {
    await CryptoModel.findByIdAndUpdate(_id, {
      amount,
      purchasePrice,
      purchaseValue: purchasePrice * amount,
    });

    res.redirect("/wallet/walletlist");
  } catch (err) {
    next(err);
  }
});

//! DELETE -------------------------

//POST: (/wallet/:id/delete)=> elimina los datos del usuario
router.post("/:id/delete", async (req, res, next) => {
  const { id } = req.params;
  console.log();
  try {
    await CryptoModel.findByIdAndDelete(id);
    res.redirect("/wallet/walletlist");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
