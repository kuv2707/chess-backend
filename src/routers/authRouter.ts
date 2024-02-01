import Express from "express";
import { login } from "../controllers/authController";

const router = Express.Router();

router.route("/login").post(login)

export default router;