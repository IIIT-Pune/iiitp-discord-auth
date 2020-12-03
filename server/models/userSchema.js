const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firebaseUid: {
        type: String,
        default: "",
    },
    name: {
        type: String,
        default: "",
    },
    gmail: {
        type: String,
        default: "",
    },
    discordId: {
        type: String,
        default: "",
    },
    discordUserName: {
        type: String,
        default: "",
    },
    gitId: {
        type: String,
        default: "",
    },
    points: {
        type: Number,
        default: 0,
        required: true,
    },
});

module.exports = mongoose.model("User", userSchema, "User");
