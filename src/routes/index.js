const express = require("express");
const router = express.Router();
// Adicionar aqui as importações dos arquivos de rotas conforme o exemplo abaixo
const exemploRoutes = require("./exemploRoutes");

router.use(express.json());
// Adicionar aqui as rotas conforme o exemplo abaixo
router.use("/exemplo", exemploRoutes);

module.exports = router;
