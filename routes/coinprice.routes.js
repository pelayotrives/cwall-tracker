const router = require("express").Router();
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

//*GET "/coinprice" => Renderizar la vista del listado de criptomonedas.
router.get("/", async (req, res, next) => {
  try {
    let marketCoin = await CoinGeckoClient.coins.markets();
    res.render("coins/coins-prices.hbs", {
      coinList: marketCoin.data,
    });
  } catch (err) {
    next(err);
  }
});

// GET "/coinprice/:id" => Renderizar la vista en detalle de cada cripto
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    let coinDetail = await CoinGeckoClient.coins.markets({
      vs_currency: "usd",
      ids: [`${id}`],
    });

    res.render("coins/coins-details.hbs", {
      Detail: coinDetail.data,
    });

    console.log(coinDetail);
  } catch (err) {
    next(err);
  }
});

// GET para el buscador
router.get("/", async (req, res, next) => {
  const { search } = req.query;
  console.log(req.query.search);
  try {
    let marketCoin = await CoinGeckoClient.coins.markets();
    let searching = marketCoin.data;

    let searchCoin = searching.find((eachCoin) => {
      if (search.toUpperCase() === eachCoin.name.toUpperCase()) {
        res.redirect(`/coinprice/${eachCoin.id}`);
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
