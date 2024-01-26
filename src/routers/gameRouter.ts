import Express from "express";
import { PiecewiseMoves, joinGame, makeMove, newGame } from "../controllers/gameController";
import { authenticateUserMiddleware } from "../controllers/authController";
const router = Express.Router();

router.use(authenticateUserMiddleware)

router.get("/newgame", newGame);
router.post("/joingame", joinGame)
router.post("/piecewisemoves",PiecewiseMoves)
router.post("/makemove",makeMove)


export default router;