const { Schema, model } = require("mongoose");

const cryptoSchema = new Schema({
  cryptoImg: {
    type: String,
  },
  cryptoName: {
    type: String,
    required: true,
  },
  shopPrice: {
    type: Number,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "user",
  }
});

const CryptoModel = model("wallet", cryptoSchema);

module.exports = CryptoModel;
