const Donation = require("../models/Donation");
const Temple = require("../models/Temple");
const asyncHandler = require("../middleware/asyncHandler");
const { ApiError } = require("../middleware/errorHandler");
const { isValidObjectId, requireFields } = require("../middleware/validators");

const createDonation = asyncHandler(async (req, res) => {
  const { templeId, amount } = req.body;
  requireFields(req.body, ["templeId", "amount"]);

  if (!isValidObjectId(templeId)) {
    throw new ApiError(400, "Invalid templeId");
  }

  if (Number(amount) <= 0) {
    throw new ApiError(400, "amount must be greater than 0");
  }

  const temple = await Temple.findById(templeId);
  if (!temple) {
    throw new ApiError(404, "Temple not found");
  }

  const donation = await Donation.create({
    userId: req.user._id,
    templeId,
    amount: Number(amount),
  });

  res.status(201).json({ success: true, data: donation });
});

const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ userId: req.user._id })
    .populate("templeId", "name location")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: donations });
});

const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .populate("userId", "name email role")
    .populate("templeId", "name location")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: donations });
});

module.exports = {
  createDonation,
  getMyDonations,
  getAllDonations,
};
