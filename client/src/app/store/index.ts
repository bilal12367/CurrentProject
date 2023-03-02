import { combineReducers, configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import mongoose from "mongoose";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { getName } from "./asyncThunks";
import { pokemonApi, useGetAllUsersQuery } from "./RTKQuery";

export type pageType = 'teams' | 'search' | 'posts' | 'aboutDev'

export interface LoaderState {
    getName: 'idle' | 'loading' | 'failed',
    getAge: 'idle' | 'loading' | 'failed',
}

export interface User {
    _id: String,
    name: String,
    email: String,
    friends: string[] | null,
    profilePic: String
}

export interface Chat {
    chat_id: string,
    team_name: string,
    participants: string[],
    messages: Message[]
}


export interface Message {
    _id: String,
    from: String,
    toChat: String,
    message: String,
    files: String[],
    replyFor: String,
}

export interface State2 {
    age: number | null,
    status: LoaderState
}

export interface Payload1 {
    name: string | null
}
export interface Payload2 {
    age: number | null
}



export interface ChatItem {
    _id: string,
    chat_id: string,
    chat_type: string,
    team_name: string,
    urMessages: string[], // unread messages
    participants: User[],
    lastMessage: Message,
    admin: User[]
}


const initialState2: State2 = {
    age: null,
    status: {
        getName: 'idle',
        getAge: 'idle'
    }
}

export interface ErrorType {
    error: String | null,
    type: String | null,
    message: String | null
}


export interface State {
    user: User | null,
    selectedPage: pageType,
    selectedUser: User | null,
    selectedChat: ChatItem | null,
    usersList: User[] | [],
    selectedChatData: Chat | null,
    userChatList: ChatItem[],
    errors: {
        login: ErrorType
    },
    endpointStatus: {
        getChat: 'loading' | 'idle' | 'success'
    }
}
const initialState: State = {
    user: null,
    selectedPage: 'teams',
    selectedUser: null,
    selectedChat: null,
    selectedChatData: null,
    usersList: [],
    userChatList: [],
    errors: {
        login: { error: null, type: null, message: null }
    },
    endpointStatus: {
        getChat: 'idle'
    }
}

const slice = createSlice({
    name: "AppState",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setPage: (state, action: PayloadAction<pageType>) => {
            state.selectedPage = action.payload;
        },
        setSelectedUser: (state, action: PayloadAction<User>) => {
            if (!(action.payload._id === state.selectedUser?._id)) {
                state.selectedUser = action.payload;
            }
        },
        setSelectedChat: (state, action: PayloadAction<ChatItem>) => {
            state.selectedChat = action.payload
        },
        setSelectedChatDataNull:(state) => {
            console.log("Selected Chat is set null")
            state.selectedChat = null
            state.selectedChatData = null
        },
        addChatListItem: (state, action: PayloadAction<ChatItem>) => {
            state.userChatList.push(action.payload)
        },
        pushChatMessage: (state, action: PayloadAction<Message>) => {
            const messageItem: Message = action.payload;
            if (state.selectedChatData?.chat_id === messageItem.toChat) {
                if (!state.selectedChatData?.messages.includes(messageItem)) {
                    state.selectedChatData?.messages.push(action.payload)
                }
            }
        },
        messageUpdate: (state, action: PayloadAction<Message>) => {
            let index = 0;
            const messageItem: Message = action.payload;
            for (let chatItem of state.userChatList) {
                if (messageItem.toChat == chatItem._id) {
                    state.userChatList[index].lastMessage = messageItem;
                    if (state.selectedChatData?.chat_id != messageItem.toChat) {
                        state.userChatList[index].urMessages.push(messageItem._id.toString());
                    }
                    const item = state.userChatList.splice(index,1)
                    const tempArr = state.userChatList;
                    Array.prototype.push.apply(item,tempArr)
                    state.userChatList = item
                }
                index++;
            }
        },
        clearUnReadMessage: (state, action: PayloadAction<ChatItem>) => {
            let index = 0;
            const chatItem1: ChatItem = action.payload;
            for (let chatItem of state.userChatList) {
                if (chatItem._id == chatItem1._id) {
                    console.log("Unread Messages cleared")
                    state.userChatList[index].urMessages = []
                }
                index++;
            }
        }
    },
    extraReducers: (builder) => {
        interface data1 {
            data: User[]
        }
        interface getUserChatListData {
            resp: ChatItem[]
        }
        interface ErrorType {
            data: {
                error: String,
                message: String
            }
        }
        builder
            .addMatcher(pokemonApi.endpoints.loginUser.matchRejected, (state, action: any) => {
                const errorObj = action.payload.data;
                if (errorObj) {
                    switch (errorObj.type) {
                        case "UserNotRegistered":
                            state.errors.login = errorObj;
                            break;
                        case "IncorrectPassword":
                            state.errors.login = errorObj;
                            break;
                        default:
                            break;
                    }
                }
                return state;
            })
            .addMatcher(pokemonApi.endpoints.getAllUsers.matchPending, (state, action) => {
                return state;
            })
            .addMatcher(pokemonApi.endpoints.getAllUsers.matchFulfilled, (state, action: PayloadAction<data1>) => {
                state.usersList = action.payload.data;
            })
            .addMatcher(pokemonApi.endpoints.getUserChatList.matchFulfilled, (state, action: PayloadAction<getUserChatListData>) => {
                state.userChatList = action.payload.resp;
            })
            .addMatcher(pokemonApi.endpoints.getChat.matchFulfilled, (state, action: PayloadAction<Chat>) => {
                // console.log("Get Chat Called: ", action.payload)
                console.log("SelectedChatData Updated")
                state.selectedChatData = action.payload;
            }).addMatcher(pokemonApi.endpoints.getChat.matchPending, (state,action: any)=> {
                state.endpointStatus.getChat = 'loading'
            }).addMatcher(pokemonApi.endpoints.getChat.matchFulfilled, (state,action: any)=> {
                state.endpointStatus.getChat = 'success'
            })
        // builder.addCase(getName.pending, (state) => {
        //     state.status.getName = 'loading'
        // }).addCase(getName.fulfilled, (state, action) => {
        //     state.status.getName = 'idle'
        //     state.name = action.payload.name;
        // })
        //     .addCase(getName.rejected, (state) => {
        //         state.status.getName = 'failed'
        //     })
    }
})

const slice2 = createSlice({
    name: 'slice2',
    initialState: initialState2,
    reducers: {
        setAge: (state, action: PayloadAction<Payload2>) => {
            state.age = action.payload.age;
        }
    }
})
export const reducers = combineReducers({
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    slice: slice.reducer,
    slice2: slice2.reducer
})
export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
})


setupListeners(store.dispatch)
// export const actions = { slice1: slice.actions, slice2: slice2.actions };
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export default slice.reducer

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const actions = { slice1: slice.actions, slice2: slice2.actions }
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;