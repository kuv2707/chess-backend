import Express from "express";
import morgan from "morgan";
import helmet from "helmet";

import gameRouter from "./routers/gameRouter";
const app = Express();

export default app;

app.use(helmet())
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
app.use(Express.json({ limit: "10kb" }));
app.use(Express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/v1/game",gameRouter)