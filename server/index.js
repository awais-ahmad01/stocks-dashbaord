
const express = require("express");
const db = require('./db');
const bodyParser = require('body-parser');
const app = express();
const stocksRouter = require("./routes/stocks");
const watchlistRouter = require("./routes/watchList")
const authRouter = require("./routes/auth")
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();


app.use(bodyParser.json())    
app.use(cors({
    origin: "http://localhost:5173",
    methods:"GET, POST, PUT, DELETE"
}))

app.use("/", authRouter);
app.use("/api", stocksRouter);
app.use("/api", watchlistRouter);



app.listen('3000', ()=>{
    console.log("Server is listening")
})