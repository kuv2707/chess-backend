import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";
import SocketIO from "socket.io";
import addListeners from "./addListeners";

mongoose
	.connect(process.env.MONGODB_DATABASE_URI!)
	.then(() => {
		console.log("connection to mongoDB successful");
	})
	.catch((err) => {
		console.log("connection to mongoDB failed");
		console.log(err);
		process.exit(-1);
	});

const server = app.listen(process.env.PORT, () => {
	console.log("Server started on port " + process.env.PORT);
});

const sio = new SocketIO.Server(server,{
	cors:{
		origin:"http://localhost:3000",
	}
});
sio.on("connection", (socket) => {
	console.log("new connection");
	addListeners(socket);
	
});

export {
	sio
}

process.on("uncaughtException", (err) => {
	console.log(err);
	console.log("Uncaught Exception🤡");
	process.exit(-1);
});
process.on("unhandledRejection", (err) => {
	console.log(err);
	console.log("Unhandled rejection🔥");
	server.close(() => process.exit(-1));
});
