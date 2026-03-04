const express = require("express");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");
const { requireAuth, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.post("/", createBooking);
router.get("/me", getMyBookings);
router.patch("/:id/cancel", cancelBooking);
router.get("/", allowRoles("ADMIN"), getAllBookings);

module.exports = router;
