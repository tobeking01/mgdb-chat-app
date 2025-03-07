const {model, Schema, ObjectId} = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    roleId: {
        type: ObjectId,
        required: false,
    },
    orgId: {
        type: ObjectId,
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const userModel = model('User', userSchema);

module.exports = userModel;