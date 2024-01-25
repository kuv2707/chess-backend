import { Request, Response } from "express";
import GameModel from "../models/gameModel";
import { sio } from "../server";
import UserModel from "../models/userModel";

export async function newGame(req: Request, res: Response) {
	const { name, user, dbuser } = req.body;
	let game = new GameModel({ name });
	sio.sockets.sockets.get(dbuser.socketId)?.join(game.id);
	console.log("joined", dbuser.socketId, game.id);
	game.players.push(req.body.user.uid);
	game = await game.save();
	res.status(201).json({
		status: "success",
		data: {
			id: game._id,
		},
	});
}

GameModel.deleteMany({}).then(() => {
	console.log("deleted all games");
});
export async function joinGame(req: Request, res: Response) {
	const { gameId, user, dbuser } = req.body;
	const game = await GameModel.findById(gameId);
	if (game == null) {
		res.status(404).json({
			status: "fail",
			message: "Game not found",
		});
		return;
	}
	const host = await UserModel.findOne({
		firebaseId: game.players[0],
	});
	if (!host) {
		res.status(400).json({
			status: "fail",
			message: "invalid game requested: host not found",
		});
		await GameModel.findByIdAndDelete(gameId);
		return;
	}
	if (!host.socketId) {
		res.status(400).json({
			status: "fail",
			message: "host not connected",
		});
		return;
	}
	const hostsocket = sio.sockets.sockets.get(host.socketId);
	if (!hostsocket) {
		res.status(404).json({
			status: "fail",
			message: "Host not found",
		});
		return;
	}
	game.players.push(req.body.user.uid);
	await game.save();
	sio.sockets.sockets.get(dbuser.socketId)?.join(game.id);
		console.log("joined2", dbuser.socketId, game.id);

	const gameInfo = {
		gameId: game._id,
		player1: game.players[0],
		player2: game.players[1],
	};
	hostsocket.emit("opponentJoined", {
		gameInfo,
	});
	res.status(200).json({
		status: "success",
		data: gameInfo,
	});
}

export async function PiecewiseMoves(req: Request, res: Response) {
	await fetch(process.env.NEXT_PUBLIC_CHESS_ENGINE_URL + "piecewisemoves", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(req.body),
	})
		.then((response) => response.json())
		.then((data) => {
			res.status(200).json({
				status: "success",
				data,
			});
		})
		.catch((err) => {
			res.status(500).json({
				status: "fail",
				message: err.message,
			});
		});
}
