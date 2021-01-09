
const {model, Schema} = require("mongoose");

const tournamentSchema = new Schema({
    name: String,
    username: String,
    restrictions: [String],
    rules: [String],
    participants: [{
        name: String,
        status: Boolean
    }],
    user: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }]
})

module.exports = model("Tournament", tournamentSchema);