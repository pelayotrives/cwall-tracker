const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

//* GET ("/wallet/wallet") => Renderiza la vista de "My Wallet" al usuario logueado
router.get("/", async (req, res, next) => {

    try {
        let marketCoin = await CoinGeckoClient.coins.markets()
        res.render("wallet/wallet.hbs", {
          walletData: marketCoin.data
        })
  
      } catch (err) {
        next(err)
      } 
})

router.get("/:id", async (req, res, next) => {

    try {
        let marketCoin = await CoinGeckoClient.coins.markets()
        res.render("wallet/wallet.hbs", {
          walletData: marketCoin.data
        })
  
      } catch (err) {
        next(err)
      } 

})


module.exports = router;