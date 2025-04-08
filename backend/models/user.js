const mongoose = require("mongoose");

// Schema for User
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, // email is required
    },
    username: {
        type: String, // optional username
    },
    password: {
        type: String,
        required: true, // password is required
    },
    list: [
        {
            type: mongoose.Types.ObjectId, // references to List items
            ref: "List",
        },
    ],
});

// Export the model
module.exports = mongoose.model("User", userSchema);
