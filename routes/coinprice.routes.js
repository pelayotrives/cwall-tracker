const router = require("express").Router();
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

//*GET "/coinprice" => Renderizar la vista del listado de criptomonedas.

router.get("/", async (req, res, next) => {
  const { search } = req.query;

  try {
    let marketCoin = await CoinGeckoClient.coins.markets();

    if (search === undefined) {
      res.render("coins/coins-prices.hbs", {
        coinList: marketCoin.data,
      });

      return;
    }

    let searching = marketCoin.data;

    let searchResult = searching.find((eachCoin) => {
      if (
        search.toUpperCase() === eachCoin.name.toUpperCase() ||
        search.toUpperCase() === eachCoin.symbol.toUpperCase()
      ) {
        return eachCoin;
      }
    });
    res.redirect(`/coinprice/${searchResult.id}`);
    console.log(searchResult);
  } catch (err) {
    next(err);
  }
});

// GET "/coinprice/:id" => Renderizar la vista en detalle de cada cripto
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    let coinDetail = await CoinGeckoClient.coins.markets({
      vs_currency: "usd",
      ids: [`${id}`],
    });
    console.log(coinDetail);
    res.render("coins/coins-details.hbs", {
      Detail: coinDetail.data,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
