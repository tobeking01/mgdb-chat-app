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
        ref: 'Role',
        required: true,
    },
    orgId: {
        type: ObjectId,
        ref: 'Organization',
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const User = model('User', userSchema);

module.exports = User;