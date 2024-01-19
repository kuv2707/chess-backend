import { Request, Response } from "express";
import GameModel from "../models/gameModel";

function newGame(req: Request, res: Response) {
	const { name } = req.body;
	const game = new GameModel({ name });
	game.save();
	res.status(201).json(game);
}


export { newGame };