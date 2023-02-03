import React, { useContext, useReducer } from 'react'
import { Reducer, SET_SOCKET } from './Reducer';
import { io } from 'socket.io-client'
import { User } from '.';
import { useNavigate } from 'react-router-dom';

export const SocketContext = React.createContext({});

interface contextState {
  socket: any | null
}

const initialState: contextState = {
  socket: null,
}

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socketState, dispatch] = useReducer(Reducer, initialState)
  var socket = io('http://localhost:5000')
  // const navigate = useNavigate();
  const setSocket = (userId: string, user: any) => {
    console.log('SetSocket1:', user)

    console.log("User set")
    socket.emit("user", user)

  }

  const getSocket = () => {
    return socket;
  }

  return <SocketContext.Provider value={{ ...socketState, setSocket, getSocket }}>{children}</SocketContext.Provider>;
}

export { SocketProvider }

export const useSocketContext: () => any = () => {
  return useContext(SocketContext);
}