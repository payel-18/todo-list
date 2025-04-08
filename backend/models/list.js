const mongoose = require("mongoose");

// Schema for Todo list items
const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // title is required
    },
    body: {
        type: String,
        required: true, // body is required
    },
    user: {
        type: mongoose.Types.ObjectId, // reference to User
        ref: "User",
        required: true
    }
},
{ timestamps: true } // adds createdAt and updatedAt
);

// Export the model
module.exports = mongoose.model("List", listSchema);
