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
    email: String,
    firebaseId: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
    },
});


export default  mongoose.model("User", userSchema);
