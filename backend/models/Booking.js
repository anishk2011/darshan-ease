const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DarshanSlot",
      required: true,
    },
    status: {
      type: String,
      enum: ["BOOKED", "CANCELLED"],
      default: "BOOKED",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
