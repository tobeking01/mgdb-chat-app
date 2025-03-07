const { model, Schema } = require("mongoose");

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const organizationModel = model('Organization', organizationSchema);

module.exports = organizationModel;