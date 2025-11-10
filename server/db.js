const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;


db.on("connected", ()=>{
    console.log("Connected")
})


db.on("disconnected", ()=>{
    console.log("DisConnected")
})

db.on("error", (error)=>{
    console.log("Errr:", error )
})


module.exports = db;