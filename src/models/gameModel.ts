import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "New Game",
    },
    players: {
        type: [String],    
    },
    fenstring: {
        type: String,
        default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w"
    },
    status: {
        type: String,
        enum: ["scheduled", "in progress", "finished"],
        default: "scheduled"
    
    },
    startDateTime: {
        type: Date,
        default: Date.now
    },
});

const GameModel = mongoose.model("Game", gameSchema);
export default GameModel;