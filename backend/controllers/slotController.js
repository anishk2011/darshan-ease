const DarshanSlot = require("../models/DarshanSlot");
const Temple = require("../models/Temple");
const Booking = require("../models/Booking");
const asyncHandler = require("../middleware/asyncHandler");
const { ApiError } = require("../middleware/errorHandler");
const { isValidObjectId, requireFields } = require("../middleware/validators");

const getSlots = asyncHandler(async (req, res) => {
  const { templeId } = req.query;
  const filter = {};

  if (templeId) {
    if (!isValidObjectId(templeId)) {
      throw new ApiError(400, "Invalid templeId");
    }
    filter.templeId = templeId;
  }

  const slots = await DarshanSlot.find(filter)
    .populate("templeId", "name location")
    .sort({ date: 1, time: 1 });

  res.json({ success: true, data: slots });
});

const createSlot = asyncHandler(async (req, res) => {
  const { templeId, date, time, capacity } = req.body;
  requireFields(req.body, ["templeId", "date", "time", "capacity"]);

  if (!isValidObjectId(templeId)) {
    throw new ApiError(400, "Invalid templeId");
  }

  if (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0) {
    throw new ApiError(400, "capacity must be a positive integer");
  }

  const temple = await Temple.findById(templeId);
  if (!temple) {
    throw new ApiError(404, "Temple not found");
  }

  const slot = await DarshanSlot.create({
    templeId,
    date,
    time,
    capacity: Number(capacity),
    isActive: req.body.isActive ?? true,
  });

  res.status(201).json({ success: true, data: slot });
});

const updateSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid slot id");
  }

  const existing = await DarshanSlot.findById(id);
  if (!existing) {
    throw new ApiError(404, "Slot not found");
  }

  if (req.body.capacity !== undefined) {
    const nextCapacity = Number(req.body.capacity);
    if (!Number.isInteger(nextCapacity) || nextCapacity <= 0) {
      throw new ApiError(400, "capacity must be a positive integer");
    }
    if (nextCapacity < existing.bookedCount) {
      throw new ApiError(
        400,
        "capacity cannot be less than the current bookedCount"
      );
    }
  }

  const slot = await DarshanSlot.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: slot });
});

const deleteSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid slot id");
  }

  const slot = await DarshanSlot.findByIdAndDelete(id);
  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  await Booking.deleteMany({ slotId: id });

  res.json({ success: true, message: "Slot deleted successfully" });
});

module.exports = {
  getSlots,
  createSlot,
  updateSlot,
  deleteSlot,
};
