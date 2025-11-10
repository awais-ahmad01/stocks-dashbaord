const mongoose = require("mongoose");

const stocksHistorySchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  
  daily: {
    lastUpdated: { type: Date, default: Date.now },
    data: { type: Array },
  },
  weekly: {
    lastUpdated: { type: Date, default: Date.now },
    data: { type: Array },
  },
  monthly: {
    lastUpdated: { type: Date, default: Date.now },
    data: { type: Array },
  },
  yearly: {
    lastUpdated: { type: Date, default: Date.now },
    data: { type: Array },
  },
});



const StocksHistory = mongoose.model("StocksHistory", stocksHistorySchema)

module.exports = StocksHistory;