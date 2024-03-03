import { NextFunction, Request, Response } from "express";
import GameModel from "../models/gameModel";
import { sio } from "../server";
import UserModel from "../models/userModel";

export async function getGame(req: Request, res: Response) {
	const { id } = req.params;
	const game = await GameModel.findById(id).populate("players");
	if (!game) {
		res.status(404).json({
			status: "fail",
			message: "Game not found",
		});
		return;
	}
	res.status(200).json({
		status: "success",
		data: {
			game,
		},
	});
}

export async function newGame(req: Request, res: Response) {
	const { name, user } = req.body;
	const { type } = req.params;
	let game = new GameModel({ name, type });
	game.players.push(user._id);
	game.players.push(user._id);
	game = await game.save();
	sio.sockets.sockets.get(user.socketId)?.join(game.id);
	if (game.type == "engine") {
		sio.to(game.id).emit("opponentJoined", {
			gameInfo: {
				gameId: game._id,
				player1: game.players[0],
				player2: game.players[1],
			},
		});
	}
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
	const { gameId, user } = req.body;
	const game = await GameModel.findById(gameId);
	if (!game) {
		res.status(400).json({
			status: "fail",
			message: "invalid game requested",
		});
		return;
	}
	const host = await UserModel.findById(game.players[0]);
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
	game.players.push(user._id);
	await game.save();
	sio.sockets.sockets.get(user.socketId)?.join(game.id);
	sio.to(game.id).emit("opponentJoined", {
		gameInfo: {
			gameId: game._id,
			player1: game.players[0],
			player2: game.players[1],
		},
	});
	res.status(200).end("success");
}

export async function makeMove(req: Request, res: Response) {
	//todo: check if user is allowed to make move based on its color
	const { gameId, move } = req.body;
	console.log("makemove", gameId, move);
	if (!gameId || !move) {
		res.status(400).json({
			status: "fail",
			message: "invalid request body",
		});
		return;
	}
	let game = await GameModel.findById(gameId);
	if (!game) {
		res.status(400).json({
			status: "fail",
			message: "invalid game requested",
		});
		return;
	}
	console.log("makemove", move);
	let moveres = await fetch(
		process.env.NEXT_PUBLIC_CHESS_ENGINE_URL + "makemove",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				fen: game.fenstring,
				mov: move,
			}),
		}
	);
	if (moveres.status != 200) {
		res.status(400).json({
			status: "fail",
			message: "invalid move",
		});
		return;
	}
	let newfen = await moveres.text();
	sio.to(game.id).emit("boardUpdate", {
		fenstring: newfen,
	});
	game.fenstring = newfen;
	await game.save();
	async function enginePostMove(newfen:string) {
		if(game==null)
		return console.log("null game!!!");
		game.fenstring = newfen;
		await game.save();
		sio.to(game.id).emit("boardUpdate", {
			fenstring: newfen,
		});
	}
	if (game.type == "engine") {
		makeEngineMove(newfen).then(enginePostMove);
	}
	res.status(200).json({
		status: "success",
	});
	
	
}
async function makeEngineMove(newfen: string) {
	let r = await fetch(
		process.env.NEXT_PUBLIC_CHESS_ENGINE_URL + "stockfishmakemove",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				fen: newfen,
			}),
		}
	).then((res) => res.text());
	return r;
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
