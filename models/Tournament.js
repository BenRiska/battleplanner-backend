
const {model, Schema} = require("mongoose");

const tournamentSchema = new Schema({
    name: String,
    username: String,
    restrictions: [String],
    rules: [String],
    active: Boolean,
    participants: [{
        name: String,
        status: Boolean
    }],
    fights: [{
        fighterOne: String,
        fighterTwo: String,
        concluded: Boolean,
        winner: String
    }],
    round: Number,
    winner: String,
    user: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }]
})

module.exports = model("Tournament", tournamentSchema);