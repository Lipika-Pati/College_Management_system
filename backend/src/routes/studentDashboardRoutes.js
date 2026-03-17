const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/studentDashboardController");

/* ================= Dashboard ================= */

router.get("/dashboard", authMiddleware, controller.getDashboard);

/* ================= Update Password ================= */

router.put("/password", authMiddleware, controller.updatePassword);

/* ================= Update DOB ================= */

router.put("/dob", authMiddleware, controller.updateDOB);

/* ================= Attendance ================= */

router.get("/attendance", authMiddleware, controller.getStudentAttendance);

/* ================= Marksheet ================= */

router.get("/marksheet", authMiddleware, controller.getStudentMarksheet);

module.exports = router;

