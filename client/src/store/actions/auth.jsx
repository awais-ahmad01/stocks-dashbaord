import {createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async(formData)=>{
    try{

        console.log('form:', formData)
        const response = await axios.post(`${baseURL}/register`, formData)

        console.log('response:', response)

        return true
    }
    catch(error){
         console.log('Error: ', error)
    }
  }
)



export const signinUser = createAsyncThunk(
    'auth/siginUser',
    async(formData)=>{
        try{
            console.log('form: ', formData)

           

            const response = await axios.post(`${baseURL}/login`, formData)

            console.log('response:', response)

            if(response){
                localStorage.setItem('token', response.data.token)
            }

            return {userData: response.data.user, auth:true}
        }
        catch(error){
            console.log("Error:", error)
            throw error;
        }
    }
)



export const signOut = createAsyncThunk(
    'auth/signOut',
    async()=>{
        localStorage.removeItem('token');
        return true;
    }
)



