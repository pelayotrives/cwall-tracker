const { Schema, model } = require("mongoose");

const cryptoSchema = new Schema({
  cryptoImg: {
    //Imagen de la cripto
    type: String,
  },
  cryptoName: {
    //Nombre de la cripto
    type: String,
    required: true,
  },
  purchasePrice: {
    //Precio de compra
    type: Number,
    required: true,
  },
  amount: {
    //Cantidad
    type: Number,
    required: true,
  },
  currentPrice: {
    // Precio actual
    type: Number,
  },
  purchaseValue: {
    // PurchasePrice * amount
    type: Number,
  },
  profit: {
    // purchaseValue - currentPrice
    type: Number,
  },
  totalResult: {
    type: Number,
  },
  profitPercentage: {
    type: Number,
  },
  userID: {
    // Relación con el usuario propietario de la Wallet
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const CryptoModel = model("wallet", cryptoSchema);

module.exports = CryptoModel;
