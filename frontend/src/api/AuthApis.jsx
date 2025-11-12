import React from 'react'
import apiInstance from '../config/apiInstance';

export const RegisterUserApi=async(data)=>{

    console.log(data);
    
    try {
        const response = await apiInstance.post("/auth/register", data);
        console.log(response);
        if (response) {
            return response.data;
        }
    } catch (error) {
        console.log("error in registration->",error);
    }
}
export const loginUserApi=async(data)=>{
    console.log(data);
    try {
        const response = await apiInstance.post("/auth/login", data);
        console.log(response);
        if (response) {
            return response.data;
        }
    } catch (error) {
        console.log("error in login->",error);
    }
}
