import { Request, Response } from "express";
import GameModel from "../models/gameModel";
import { sio } from "../server";

type ChatMessage = {
	message: string;
	userId: string;
	timestamp: Date;
};
export async function postMessage(req: Request, res: Response) {
	const { message, gameId, user } = req.body;
	const game = await GameModel.findOne({ _id: gameId });
	if (!game) {
		res.status(404).json({
			status: "fail",
			message: "Game not found",
		});
		return;
	}
	sio.to(gameId).emit("message", {
		message,
		userId: user._id,
		timestamp: new Date(),
	} as ChatMessage);
	sio.sockets.adapter.rooms.get(gameId)?.forEach((socketId) => {
		console.log(">", socketId);
	});

	res.status(200).send("message sent");
}
