const Temple = require("../models/Temple");
const DarshanSlot = require("../models/DarshanSlot");
const Booking = require("../models/Booking");
const Donation = require("../models/Donation");
const asyncHandler = require("../middleware/asyncHandler");
const { ApiError } = require("../middleware/errorHandler");
const { isValidObjectId, requireFields } = require("../middleware/validators");

const getTemples = asyncHandler(async (req, res) => {
  const temples = await Temple.find().sort({ createdAt: -1 });
  res.json({ success: true, data: temples });
});

const createTemple = asyncHandler(async (req, res) => {
  requireFields(req.body, ["name", "location", "description"]);
  const temple = await Temple.create(req.body);
  res.status(201).json({ success: true, data: temple });
});

const updateTemple = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid temple id");
  }

  const temple = await Temple.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!temple) {
    throw new ApiError(404, "Temple not found");
  }

  res.json({ success: true, data: temple });
});

const deleteTemple = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid temple id");
  }

  const temple = await Temple.findByIdAndDelete(id);
  if (!temple) {
    throw new ApiError(404, "Temple not found");
  }

  await DarshanSlot.deleteMany({ templeId: id });
  await Booking.deleteMany({ templeId: id });
  await Donation.deleteMany({ templeId: id });

  res.json({ success: true, message: "Temple deleted successfully" });
});

module.exports = {
  getTemples,
  createTemple,
  updateTemple,
  deleteTemple,
};
