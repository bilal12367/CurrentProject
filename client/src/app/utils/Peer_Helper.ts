import { Peer } from 'peerjs'
import { peer_server_port, peer_server_url } from '../constants';
import { useSocketContext } from '../store/SocketContext';
import { User } from '../store';
import { Dispatch } from 'react';
import { MutationHooks } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { CallState } from '../store/types';
// import { useGetPeerIdMutation } from '../store/RTKQuery';




export class PeerInstance {
    peer: any;
    peerId!: string;
    call!: any;
    user!: User;
    setCallIncomingState!: Dispatch<CallState>
    constructor(socket: any, user: User | null,setCallIncomingState: Dispatch<CallState>) {
        this.peer = new Peer({ host: peer_server_url, port: peer_server_port, path: '/', pingInterval: 5000 })
        this.setCallIncomingState = setCallIncomingState;
        this.peer.on('open', () => {
            if (user) {
                socket.emit("setPeerId", { user: user._id, peerId: this.peer.id })
                this.user = user;
            }
        })
    }

    public awaitInitialize() {
        if (this.peer.id !== undefined) return Promise.resolve(this.peer.id);
        return new Promise(resolve => {
            this.peer.on("open", (id: string) => {
                this.peerId = id;
                resolve(id);
            });
        });
    }

    public setUpCallListener(videoRef: HTMLVideoElement) {
        this.peer.on('call', async (call: any) => {
            console.log('call', call)
            this.call = call;
            // this.setCallIncomingState('call_incoming')
            this.answerCall(videoRef)
        })
    }

    public async answerCall(videoRef: HTMLVideoElement) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        console.log('this.call', this.call)
        this.call.answer(stream)

        this.call.on("stream", (remoteStream: any) => {
            videoRef.srcObject = remoteStream;
            this.setCallIncomingState('call_accepted')
            videoRef.play().catch((err: any) => {
                console.log('err', err)
            })
        })
    }

    public async makeCall(videoRef: HTMLVideoElement,peerId: string) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        const call = await this.peer.call(peerId, stream);

        call.on('stream', (remoteStream: any) => {
            videoRef.srcObject = remoteStream;
            videoRef.play().catch((err: any) => {
                console.log('err', err)
            })
        })
    }
}
