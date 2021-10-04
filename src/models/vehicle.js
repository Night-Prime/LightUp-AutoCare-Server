const { model, Schema } = require('mongoose');

const VehicleSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    _id: {
        type: Number,
        required: true,
    },
    vehicleName: {
        type: String,
        required: true,
    },
    chassis: String,
    model: {
        type: String,
        required: true,
    },
    clientId: {
        type: Number,
        required: true,
    },
    // Model Required fields
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    timeStamp: {
        type: Number,
        required: true,
        default: () => Date.now(),
    },
    createdOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    updatedOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
});

model('Vehicle', VehicleSchema);
