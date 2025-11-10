import { createSlice } from "@reduxjs/toolkit";
import { getStocksData, getOrUpdatedStocksHistoryData } from "../actions/stocksAction";


const initialState = {
    stocksRealTimeData: [],
    isloading: false,
    stocksHistoryData: []
}

const stocksSlice = createSlice({
    name:'stocks',
    initialState: initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder
            .addCase(getStocksData.pending, (state)=>{
                state.isloading = false
            })
            .addCase(getStocksData.fulfilled, (state, action)=>{
                state.isloading=false,
                state.stocksRealTimeData = action.payload.data
            })
            .addCase(getStocksData.rejected, (state)=>{
                state.isloading=false
            })

             .addCase(getOrUpdatedStocksHistoryData.pending, (state)=>{
                state.isloading = true
            })
            .addCase(getOrUpdatedStocksHistoryData.fulfilled, (state, action)=>{
                state.isloading=false,
                state.stocksHistoryData = action.payload.data
            })
            .addCase(getOrUpdatedStocksHistoryData.rejected, (state)=>{
                state.isloading=false
            })
    }
})

export default stocksSlice.reducer;