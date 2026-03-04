const express = require("express");
const {
  getSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} = require("../controllers/slotController");
const { requireAuth, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSlots);
router.post("/", requireAuth, allowRoles("ADMIN", "ORGANIZER"), createSlot);
router.put("/:id", requireAuth, allowRoles("ADMIN", "ORGANIZER"), updateSlot);
router.delete("/:id", requireAuth, allowRoles("ADMIN", "ORGANIZER"), deleteSlot);

module.exports = router;
