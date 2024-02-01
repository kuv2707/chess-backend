import UserModel from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { fbAuth } from "../firebase";

export function login(req: Request, res: Response) {
	const { token } = req.body;
	if (!token) {
		res.status(401).json({
			status: "fail",
			message: "auth failed: provide an ID Token!",
		});
		return;
	}
	fbAuth
		.verifyIdToken(token)
		.then(async (authUserInfo) => {
			let dbuser = await UserModel.findOne({ firebaseId: authUserInfo.uid });
			if (!dbuser) {
				dbuser = new UserModel({
					firebaseId: authUserInfo.uid,
					name: authUserInfo.name,
					email: authUserInfo.email,
					photoURL: authUserInfo.picture,
					age: 0,
				});
			}
			dbuser.save();
			res.status(200).json({
				status: "success",
				data: {
					user: dbuser,
				},
			})
		})
		.catch((error) => {
			res.json({
				status: "fail",
				message: "auth failed:" + error.message,
			});
		});
}

export function authenticateUserMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const idToken = req.headers.authorization?.split(" ")[1] ?? "";
	if (!idToken) {
		res.status(401).json({
			status: "fail",
			message: "auth failed: provide an ID Token!",
		});
		return;
	}
	fbAuth
		.verifyIdToken(idToken)
		.then(async(decodedToken) => {
			const uid = decodedToken.uid;
			let dbuser = await UserModel.findOne({ firebaseId: uid });
			if (!dbuser) {
				res.status(401).json({
					status: "fail",
					message: "auth failed: user not found",
				});
			}
			req.body.user = dbuser;
			next();
		})
		.catch((error) => {
			// Handle error
			res.json({
				status: "fail",
				message: "auth failed:" + error.message,
			});
		});
}
