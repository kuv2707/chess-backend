import * as SocketIO from "socket.io";

type ChatMessage = {
	message: string;
	user: User;
	timestamp: Date;
};
type User = {
	email: string;
	displayName: string;
	photoURL: string;
	uid: string;
};
const socket_user_map: Map<string, User> = new Map();
export default function addListeners(socket: SocketIO.Socket) {
    console.log("new connection");
    socket.on("disconnect", () => {
        console.log("disconnected")
        socket_user_map.delete(socket.id)
    });
    socket.on("login",(data:User)=>{
        socket_user_map.set(socket.id,data)
    })
    socket.on("message",(data)=>{
        console.log(data)
        socket.broadcast.emit("message",{
            message:data,
            user:socket_user_map.get(socket.id),
            timestamp:new Date()
        } as ChatMessage)
    })
}