const { model, Schema } = require('mongoose');

const ClientSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    telephone: Number,
    billingAddress: {
        repName: {
            type: String,
            default: 'ATB TECHSOFT',
        },
        address: {
            type: String,
            default: '8 CMD ROAD',
        },
        city: {
            type: String,
            default: 'IKOSI KETU ',
        },
        postalCode: {
            type: Number,
            default: 100248,
        },
        state: {
            type: String,
            default: 'LAGOS',
        },
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

model('Client', ClientSchema);
