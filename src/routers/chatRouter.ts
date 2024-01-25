import Express from "express";
import { authenticateUserMiddleware } from "../controllers/authController";
import { postMessage } from "../controllers/chatController";


const router = Express.Router();
router.use(authenticateUserMiddleware)
router.route("/")
.post(postMessage)
//todo: add a get endpoint to get all chats of a game

export default router;