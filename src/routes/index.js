const express = require("express");
const router = express.Router();
const teacherRoutes = require("./teachersRoutes");
const appointmentsRoutes = require("./appointmentsRoutes");
const eventsRoutes = require("./eventsRoutes");
const usersRoutes = require("./usersRoutes");

router.use(express.json());
router.use("/teachers", teacherRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/events", eventsRoutes);
router.use("/users", usersRoutes);

module.exports = router;
