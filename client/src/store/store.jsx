import { configureStore } from "@reduxjs/toolkit";

import stocksReducer from "./reducers/stocksReducer"
import watchListReducer from "./reducers/watchList"
import authReducer from "./reducers/auth"

const store = configureStore({
    reducer:{
        stocks: stocksReducer,
        watchList: watchListReducer,
        auth: authReducer
    }
})


export default store