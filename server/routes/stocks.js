const express = require("express");
const router = express.Router();
const {getStocksData, getOrUpdateStockHistoryData} = require("../controllers/stocksController")

router.get('/stocks/quote', getStocksData )
router.get('/stocks/historyData', getOrUpdateStockHistoryData )


module.exports = router;