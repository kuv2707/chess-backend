import UserModel from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { fbAuth } from "../firebase";

export function authenticateUserMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const idToken = req.headers.authorization?.split(" ")[1] ?? "";
	if (!idToken) {
		res.status(500).json({
			status: "fail",
			message: "auth failed: provide an ID Token!",
		});
		return;
	}
	fbAuth
		.verifyIdToken(idToken)
		.then(async(decodedToken) => {
			// console.log("deco", decodedToken);
			const uid = decodedToken.uid;
			req.body.user = decodedToken;
			let dbuser = await UserModel.findOne({ firebaseId: uid });
			if (!dbuser) {
				dbuser = new UserModel({
					firebaseId: uid,
					name: decodedToken.name,
					email: decodedToken.email,
					age: 0,//todo
				});
				dbuser.save();
			}
			req.body.dbuser = dbuser;
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
