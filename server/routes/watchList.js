const express = require("express");
const router = express.Router();
const {addWatchList,getWatchList} = require("../controllers/watchListController")

router.post('/add-watch-list', addWatchList )
router.get('/get-watch-list/:userId', getWatchList )



module.exports = router;