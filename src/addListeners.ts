import * as SocketIO from "socket.io";
import { User } from "../globals";
import { fbAuth } from "./firebase";
import UserModel from "./models/userModel";
type ChatMessage = {
	message: string;
	user: User;
	timestamp: Date;
};

export default function addListeners(socket: SocketIO.Socket) {
	console.log("new connection");
	socket.on("disconnect", () => {
		console.log("disconnected");
	});
	socket.on("login", (data: User) => {
		fbAuth
			.verifyIdToken(data.idToken)
			.then(async (decodedToken) => {
				console.log(decodedToken);
				let user = await UserModel.findOne({
					firebaseId: decodedToken.uid,
				});
				if (!user) {
					user = new UserModel({
						firebaseId: decodedToken.uid,
						name: decodedToken.name,
						email: decodedToken.email,
						age: 0,
					});
					user = await user.save();
				} else {
					user = await user.save();
				}
				user.socketId = socket.id;
			})
			.catch((error) => {
				console.log("socket connection failed", error);
			});
	});
	socket.on("message", (data) => {
		console.log(data);
		socket.broadcast.emit("message", {
			message: data,
			user: {},
			timestamp: new Date(),
		} as ChatMessage);
	});
}
