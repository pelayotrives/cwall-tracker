const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();



// let func = async() => {
//   let data = await CoinGeckoClient.ping()
// }



//*GET "/coinprice" => Renderizar la vista del listado de monedas.

// router.get("/", (req, res, next) => {
//     res.render("coins/coins-prices.hbs");

//   });


router.get("/", async (req, res, next) => {
    
    try {
      let marketCoin = await CoinGeckoClient.coins.markets()
      res.render ("coins/coins-prices.hbs", {
        marketCoin
      })

    } catch (err) {
      next(err)
    }
    

  });





    
    
 





 

module.exports = router;

