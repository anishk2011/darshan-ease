const Booking = require("../models/Booking");
const Temple = require("../models/Temple");
const DarshanSlot = require("../models/DarshanSlot");
const asyncHandler = require("../middleware/asyncHandler");
const { ApiError } = require("../middleware/errorHandler");
const { isValidObjectId, requireFields } = require("../middleware/validators");

const createBooking = asyncHandler(async (req, res) => {
  const { templeId, slotId } = req.body;
  requireFields(req.body, ["templeId", "slotId"]);

  if (!isValidObjectId(templeId) || !isValidObjectId(slotId)) {
    throw new ApiError(400, "Invalid templeId or slotId");
  }

  const temple = await Temple.findById(templeId);
  if (!temple) {
    throw new ApiError(404, "Temple not found");
  }

  const existing = await Booking.findOne({
    userId: req.user._id,
    slotId,
    status: "BOOKED",
  });

  if (existing) {
    throw new ApiError(400, "You already have an active booking for this slot");
  }

  const slot = await DarshanSlot.findOneAndUpdate(
    {
      _id: slotId,
      templeId,
      isActive: true,
      $expr: { $lt: ["$bookedCount", "$capacity"] },
    },
    { $inc: { bookedCount: 1 } },
    { new: true }
  );

  if (!slot) {
    throw new ApiError(
      400,
      "Slot unavailable: either inactive, full, or does not belong to temple"
    );
  }

  const booking = await Booking.create({
    userId: req.user._id,
    templeId,
    slotId,
    status: "BOOKED",
  });

  res.status(201).json({ success: true, data: booking });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate("templeId", "name location")
    .populate("slotId", "date time capacity bookedCount isActive")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid booking id");
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (String(booking.userId) !== String(req.user._id) && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden: cannot cancel this booking");
  }

  if (booking.status === "CANCELLED") {
    throw new ApiError(400, "Booking is already cancelled");
  }

  booking.status = "CANCELLED";
  await booking.save();

  const slot = await DarshanSlot.findById(booking.slotId);
  if (slot) {
    slot.bookedCount = Math.max(0, slot.bookedCount - 1);
    await slot.save();
  }

  res.json({ success: true, message: "Booking cancelled successfully", data: booking });
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("userId", "name email role")
    .populate("templeId", "name location")
    .populate("slotId", "date time capacity bookedCount isActive")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
});

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
};
