const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        default: "",
    },
    googleUsername: {
        type: String,
        default: "",
    },
    googleEmail: {
        type: String,
        default: "",
    },
    discordId: {
        type: String,
        default: "",
    },
    discordName: {
        type: String,
        default: "",
    },
    discordRefreshToken: {
        type: String,
        default: "",
    },
    gitId: {
        type: String,
        default: "",
    },
    gitUsername: {
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
