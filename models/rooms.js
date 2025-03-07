const { model, Schema, ObjectId } = require("mongoose");

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const roomModel = model('Room', roomSchema);

module.exports = roomModel;