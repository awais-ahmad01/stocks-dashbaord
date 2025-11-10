import { createSlice } from "@reduxjs/toolkit";
import { addWatchList, getWatchList} from "../actions/watchList";


const initialState = {
    watchList: [],
    isloading: false
}

const watchListSlice = createSlice({
    name:'watchList',
    initialState: initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder
            .addCase(getWatchList.pending, (state)=>{
                state.isloading = false
            })
            .addCase(getWatchList.fulfilled, (state, action)=>{
                state.isloading=false,
                state.watchList = action.payload.data
            })
            .addCase(getWatchList.rejected, (state)=>{
                state.isloading=false
            })
    }
})

export default watchListSlice.reducer;