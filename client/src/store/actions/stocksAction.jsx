import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getStocksData = createAsyncThunk(
    "stocks/getStocksData",
    async ()=>{
        try{
            console.log("dispatching...")
            const response = await axios.get(`${baseURL}/api/stocks/quote`);

            console.log("response:", response);

            return { data: response.data}
            
        }
        catch(error){
            console.log("Error:", error);
        }
    }
)


export const getOrUpdatedStocksHistoryData = createAsyncThunk(
    "stocks/getOrUpdatedStocksHistoryData",
    async (symbol)=>{
        try{
            console.log("symb", symbol)
            const response = await axios.get(`${baseURL}/api/stocks/historyData?symbol=${symbol}`);

            console.log("response:", response);

            return { data: response.data}
            
        }
        catch(error){
            console.log("Error:", error);
        }
    }
)