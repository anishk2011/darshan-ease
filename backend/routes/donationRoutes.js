const express = require("express");
const {
  createDonation,
  getMyDonations,
  getAllDonations,
} = require("../controllers/donationController");
const { requireAuth, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.post("/", createDonation);
router.get("/me", getMyDonations);
router.get("/", allowRoles("ADMIN"), getAllDonations);

module.exports = router;
