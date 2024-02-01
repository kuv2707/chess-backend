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
	const token = socket.handshake.auth.token;
	fbAuth
		.verifyIdToken(token)
		.then(async (verifiedUser) => {
			let user = await UserModel.findOne({
				firebaseId: verifiedUser.uid,
			});
			if (!user) {
				//wont happen though
				return;
			}
			user.socketId = socket.id;
			user = await user.save();
		})
		.catch((error) => {
			console.log("socket connection failed", error);
		});
	socket.on("disconnect", () => {
		console.log("disconnected");
	});

}
