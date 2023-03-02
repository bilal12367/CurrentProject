import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '.';
import { server_url } from '../constants';

const headers = {
  'Content-type': 'application/json; charset=UTF-8',
}
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: server_url + '/api/v1', credentials: 'include' }),
  endpoints: (builder) => ({
    addDuoChat: builder.mutation({
      query: (payload) => ({
        url:'addDuoChat',
        method: 'POST',
        body: payload,
        headers
      })
    })
    ,
    sendMessage: builder.mutation({
      query: (payload) => ({
        url: 'sendMessage',
        method:'POST',
        body: payload,
        headers
      })
    }),
    getChat: builder.query({
      query: (data) => {
        return 'getChat/'+data
      }
    }),
    // Get Request
    getAllProducts: builder.query({
      query: (data) => {
        // console.log('data', data);
        return `users`
      }
    }),
    // Post Request
    addNewPost: builder.mutation({
      query: (payload) => ({
        url: 'users?page=1',
        method: 'POST',
        body: payload,
        headers: headers,
        credentials:'include'
      }),
    }),
    addTeam: builder.mutation({
      query: (payload) => ({
        url: 'addTeam',
        method:'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
    }),
    registerUser: builder.mutation({
      query: (payload) => ({
        url: 'register',
        method: 'POST',
        body: payload,
        headers
      }),
      extraOptions: {

      }
    }),
    getAllUsers: builder.query({
      query: () => {
        return 'getUsers'
      }
    }),
    getUser: builder.query<User | null, void>({
      query: () => {
        return '/getUser'
      }
    }),
    getUserChatList: builder.query({
      query: () => {
        return '/getUserChatList'
      } 
    }),
    loginUser: builder.mutation({
      query: (payload) => ({
        url: 'login',
        method: 'POST',
        body: payload,
        headers
      })
    }),
    requestDeleteFile: builder.mutation({
      query: (payload) => ({
        url: 'deleteFileById',
        method: 'POST',
        body: payload,
        headers
      })
    })
  }),

})

// export const {  useRegisterUserMutation, useGetUserQuery, useLoginUserMutation } = pokemonApi
export const {useRequestDeleteFileMutation, useAddDuoChatMutation ,useSendMessageMutation, useGetChatQuery ,useGetUserChatListQuery, useAddTeamMutation, useGetAllUsersQuery, useGetAllProductsQuery, useAddNewPostMutation, useRegisterUserMutation, useGetUserQuery, useLoginUserMutation } = pokemonApi