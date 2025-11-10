import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const addWatchList = createAsyncThunk(
    "watchList/addWatchList",
    async ({userId,symbol,name}, {rejectWithValue})=>{
        try{
            console.log("dispatching...")

            console.log(name, symbol)

            const response = await axios.post(`${baseURL}/api/add-watch-list`, {userId,symbol,name});

            console.log("response:", response);
            if(!response.data.success){
                return rejectWithValue(response.data.message)
            }

            return true
            
        }
        catch(error){
            console.log("Error:", error);
            return rejectWithValue(error?.response?.data?.message || "Failed to add watchlist")
        }
    }
)



export const getWatchList = createAsyncThunk(
    "watchList/getWatchList",
    async (userId)=>{
        try{
            console.log("dispatching...")
            const response = await axios.get(`${baseURL}/api/get-watch-list/${userId}`);

            console.log("response:", response);

            return {data: response.data}
            
        }
        catch(error){
            console.log("Error:", error);
        }
    }
)