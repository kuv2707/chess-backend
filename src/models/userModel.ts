import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
		required: true,
		validate: {
			//replace with validator library
			validator: function (email: string) {
				return email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
			},
			message: "{VALUE} is not a valid email",
		},
	},
	photoURL: {
		type: String,
	},
	firebaseId: {
		type: String,
		required: true,
	},
	socketId: {
		type: String,
	},
});


export default  mongoose.model("User", userSchema);
