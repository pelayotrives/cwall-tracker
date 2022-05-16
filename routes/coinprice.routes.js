const router = require("express").Router();
const CoinGecko = require('coingecko-api');

//*GET "/coinprice" => Renderizar la vista del listado de monedas.

router.get("/", (req, res, next) => {
    res.render("coins/coins-prices.hbs");
  });



 

module.exports = router;

