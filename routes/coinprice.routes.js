const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();


//*GET "/coinprice" => Renderizar la vista del listado de criptomonedas.
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


// GET "/coinprice/:id" => Renderizar la vista en detalle de cada cripto
router.get("/:id", async (req, res, next) => {
  const { id } = req.params
  console.log(req.params)
  
  try {
    let coinDetail = await CoinGeckoClient.coins.markets(["eur"],[`${id}`])
    res.render ("coins/coins-details.hbs", {
      coinDetail
      
    })
    
    // coinDetail.forEach((element) => {
    //   console.log(element)
    // })


    console.log(coinDetail)
  } catch (err) {
    next(err)
  }     
 
})



 

module.exports = router;

