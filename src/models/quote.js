const { model, Schema } = require('mongoose');

const QuoteSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },
    _id: {
        type: Number,
        required: true,
    },
    quoteId: {
        type: String,
        required: true,
    },
    clientId: {
        type: Number,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    vehicleId: {
        type: Number,
        required: true,
    },
    vehicleName: {
        type: String,
        required: true,
    },
    items: [
        {
            item: {
                type: String,
                required: true,
                default: 'Basic Service',
            },
            unit: {
                type: Number,
                required: true,
                min: [1, 'too small'],
                default: 1,
            },
            rate: {
                type: Number,
                required: true,
                default: 1,
            },
            amount: {
                type: Number,
                required: true,
                min: [1, 'Amount too low'],
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    // isPending is true until the client accepts the quote
    isPending: {
        type: Boolean,
        default: true,
    },
    // isApproved is false until it is approved by an approver or admin
    // when isApproved == true it cannot be edited by a clerk, requires admin or approver privilege
    isApproved: {
        type: Boolean,
        default: false,
    },
    createdById: {
        type: String,
        required: true,
    },
    createdByName: {
        type: String,
        required: true,
    },
    quoteHistory: [
        {
            updatedByName: String,
            updatedById: {
                type: String,
            },

            updatedOn: {
                type: Date,
                default: () => new Date(),
            },
        },
    ],

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

model('Quote', QuoteSchema);
