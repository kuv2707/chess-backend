import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

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
