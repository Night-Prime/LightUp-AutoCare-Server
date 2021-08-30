const { model, Schema } = require("mongoose");

const QuoteSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    default: 0,
  },
  clientId: {
    type: Number,
    required: true,
  },
  vehicleId: {
    type: Number,
    required: true,
  },
  items: [
    {
      item: {
        type: String,
        required: true,
        default: "Basic Service",
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
        min: [1, "Amount too low"],
      },
    },
  ],
  isPending: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: false
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

model("Quote", QuoteSchema);