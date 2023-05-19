import React, { useContext, useReducer } from 'react'
import { Reducer, SET_SOCKET } from './Reducer';
import { io } from 'socket.io-client'
import { User } from '.';
import { useNavigate } from 'react-router-dom';
import { Peer } from 'peerjs'
import axios from 'axios';
import { server_url } from '../constants';
export const SocketContext = React.createContext({});

interface contextState {
  socket: any | null
}

const initialState: contextState = {
  socket: null,
}

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socketState, dispatch] = useReducer(Reducer, initialState)
  
  var socket = io(server_url)
  // var peer = new Peer({host: '192.168.0.9',port: 9000,path:'/',pingInterval: 5000})
  
  
  // function getID() {
  //   if (peer.id !== undefined) return Promise.resolve(peer.id);
  //   return new Promise(resolve => {
  //     peer.on("open", id => {
  //       resolve(id);
  //     });
  //   });
  // }
  
  // const navigate = useNavigate();
  const setSocket = async(userId: string, user: any) => {
    // console.log('SetSocket1:', user)
    
    // console.log("User set")
    socket.emit("user", user)
    // peer.on('open',()=>{
    //   socket.emit("setPeerId",{user: user._id,peerId: peer.id})
    // })
  }

  const getSocket = () => {
    return socket;
  }

  return <SocketContext.Provider value={{ ...socketState, setSocket, getSocket}}>{children}</SocketContext.Provider>;
}

export { SocketProvider }

export const useSocketContext: () => any = () => {
  return useContext(SocketContext);
}