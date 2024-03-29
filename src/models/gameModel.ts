import mongoose, { Schema } from "mongoose";

const gameSchema = new mongoose.Schema({
	name: {
		type: String,
		default: "New Game",
	},
	players: [
		{
			type: Schema.Types.ObjectId,
			ref: "User", // replace with your player model name
		},
	],
	fenstring: {
		type: String,
		default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
	},
	type: {
		type: String,
		enum: ["2player", "engine"],
		default: "2player",
	
	},
	status: {
		type: String,
		enum: ["scheduled", "in progress", "finished"],
		default: "scheduled",
	},
	startDateTime: {
		type: Date,
		default: Date.now,
	},
	chat: [
		{
			message: String,
			uid: String,
			timestamp: {
				type: Date,
				default: Date.now,
			},
		},
	], //put an upper cap on messages stored
});

const GameModel = mongoose.model("Game", gameSchema);
export default GameModel;
