import Express from "express";
import { PiecewiseMoves, getGame, joinGame, makeMove, newGame } from "../controllers/gameController";
import { authenticateUserMiddleware } from "../controllers/authController";
const router = Express.Router();

router.use(authenticateUserMiddleware)

router.get("/newgame/:type", newGame);
router.post("/joingame", joinGame)
router.post("/piecewisemoves",PiecewiseMoves)
router.post("/makemove",makeMove)

router.get("/:id",getGame)

export default router;