const {model, Schema} = require("mongoose");

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    events: [{
        name: String,
        rules: [{
            text: String
        }],
        restrictions: [{
            text: String
        }],
        participants: [{
            name: String,
            status: Boolean,
        }]
    }]
})


module.exports = model("User", userSchema);