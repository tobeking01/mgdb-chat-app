const { model, Schema, ObjectId } = require("mongoose");

const roleSchema = new Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const roleModel = model('Role', roleSchema);

module.exports = roleModel;