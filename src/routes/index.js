const express = require("express");
const router = express.Router();
// Adicionar aqui as importações dos arquivos de rotas conforme o exemplo abaixo
const exemploRoutes = require("./exemploRoutes");
const teacherRoutes = require("./teachersRoutes");
const appointmentsRoutes = require("./appointmentsRoutes");

router.use(express.json());
// Adicionar aqui as rotas conforme o exemplo abaixo
router.use("/exemplo", exemploRoutes);
router.use("/teachers", teacherRoutes);
router.use("/appointments", appointmentsRoutes);

module.exports = router;
