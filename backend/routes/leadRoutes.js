const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
  getAnalytics,
} = require("../controllers/leadController");
const protect = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").post(createLead).get(getLeads);
router.get("/analytics", getAnalytics);
router.patch("/:id/status", updateLeadStatus);
router.delete("/:id", deleteLead);

module.exports = router;
