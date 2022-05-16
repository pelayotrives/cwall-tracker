const { Schema, model } = require("mongoose");

const cryptoSchema = new Schema({
  cryptoImg: {
    type: String,
  },
  cryptoName: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currentValue: {
    type: Number,
  },
  profit: {
    type: Number,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const CryptoModel = model("wallet", cryptoSchema);

module.exports = CryptoModel;
