import { Request, Response } from "express";
import GameModel from "../models/gameModel";
import { sio } from "../server";
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
	game.chat.push({ message, uid: user.uid });
	await game.save();
	sio.to(gameId).emit("message", { message,user, timestamp: Date.now() });
	sio.sockets.adapter.rooms.get(gameId)?.forEach((socketId) => {
		console.log(">",socketId);
	});

	res.send("ok");
}
