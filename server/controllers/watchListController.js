const WatchList = require("../models/watchlist")

const addWatchList = async(req, res)=>{
    try{
        const {userId, symbol, name} = req.body;

        console.log(symbol,name, userId);

        const exists = await WatchList.findOne({userId, symbol, name });
        if (exists) {
        return res.status(409).json({ success: false, message: "Already in watchlist" });
        }

        const newWatchList = new WatchList({
            userId,symbol,name
        });

        await newWatchList.save();

        res.status(201).json({data: newWatchList, success:true})

    }
    catch(error){
        console.log(error)
        res.status(500).json({error: error.message})
    }
}


const getWatchList = async(req, res)=>{
    try{
        
        const userId = req.params.userId;

        const watchList = await WatchList.find({userId});
       

        res.status(200).json({data: watchList, success:true})

    }
    catch(error){
        console.log(error)
        res.status(500).json({error: error.messsage})
    }
}


module.exports = {addWatchList, getWatchList}