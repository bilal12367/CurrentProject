import { PayloadAction } from "@reduxjs/toolkit";

export const SET_SOCKET = 'SET_SOCKET'

export const Reducer = (state: any,action: PayloadAction<any> ) => {
    if(action.type == SET_SOCKET){
        return {
            socket: action.payload
        }
    }else if(action.type == ''){
        return {}
    }
    
}