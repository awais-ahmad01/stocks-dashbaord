const mongoose = require("mongoose");
const User = require("./user")

const watchListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },

});



const WatchList = mongoose.model("WatchList", watchListSchema)

module.exports = WatchList;