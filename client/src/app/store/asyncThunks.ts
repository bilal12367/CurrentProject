
import { createAsyncThunk } from "@reduxjs/toolkit";

const delay = (ms:number) => new Promise(res => setTimeout(res, ms));

export const getName = createAsyncThunk(
    "AppState/getName",
    async (id: string) => {
        await delay(2000);
        return { name: 'Shaik Mohammed Bilal' }
    }
)

