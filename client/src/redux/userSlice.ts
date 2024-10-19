import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import { User } from "../interfaces/User";

interface userState{
    userEmail:string | null;
    user: User | null;
}

const initialState :userState = {
    userEmail:null,
    user:null,
}

const userSlice = createSlice({
    name:'userSlice',
    initialState,
    reducers:{
        setEmail:(state,action:PayloadAction<string|null>)=>{
            state.userEmail = action.payload;
        },
        saveUser:(state, action:PayloadAction<User|null>)=>{
             state.user = action.payload;
        },
        updateUserImage: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.image = action.payload;
            }
        },
       
        userLogout(state) {
            state.user = null;
            state.userEmail= null;
          },
    }
})

export default userSlice.reducer;
export const userActions = userSlice.actions