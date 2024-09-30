const express = require("express");
const router = express.Router();
const teacherRoutes = require("./teachersRoutes");
const appointmentsRoutes = require("./appointmentsRoutes");
const eventsRoutes = require("./eventsRoutes");
const usersRoutes = require("./usersRoutes");
const professionalsRoutes = require("./professionalsRoutes");
const studentsRoutes = require("./studentsRoutes");

router.use(express.json());
router.use("/teachers", teacherRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/events", eventsRoutes);
router.use("/users", usersRoutes);
router.use("/professionals", professionalsRoutes);
router.use("/students", studentsRoutes);

module.exports = router;
