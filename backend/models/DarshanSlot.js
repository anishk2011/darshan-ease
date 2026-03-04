const mongoose = require("mongoose");

const darshanSlotSchema = new mongoose.Schema(
  {
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("DarshanSlot", darshanSlotSchema);
