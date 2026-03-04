const express = require("express");
const {
  getTemples,
  createTemple,
  updateTemple,
  deleteTemple,
} = require("../controllers/templeController");
const { requireAuth, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getTemples);
router.post("/", requireAuth, allowRoles("ADMIN", "ORGANIZER"), createTemple);
router.put("/:id", requireAuth, allowRoles("ADMIN", "ORGANIZER"), updateTemple);
router.delete("/:id", requireAuth, allowRoles("ADMIN", "ORGANIZER"), deleteTemple);

module.exports = router;
