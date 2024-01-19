import Express from "express";
import { newGame } from "../controllers/gameController";
const router = Express.Router();

router.post("/newgame", newGame);


export default router;