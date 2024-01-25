import Express from "express";
import { PiecewiseMoves, joinGame, newGame } from "../controllers/gameController";
import { authenticateUserMiddleware } from "../controllers/authController";
const router = Express.Router();

router.use(authenticateUserMiddleware)

router.get("/newgame", newGame);
router.post("/joingame", joinGame)
router.post("/piecewisemoves",PiecewiseMoves)


export default router;