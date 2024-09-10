const { v4: uuidv4 } = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const exemploDB = require("../db/dbExemplo.json");

// Rota para buscar todos os exemplos
router.get("/", (req, res) => {
  res.json(exemploDB);
});

// Rota para buscar um exemplo pelo id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  var exemplos = exemploDB.find((exemplo) => exemplo.id === id);
  if (!exemplos)
    return res.status(404).json({
      erro: "Exemplo não encontrado",
    });
  res.json(exemplos);
});

// Rota para criar um novo exemplo
router.post("/", (req, res) => {
  const exemplo = req.body;
  exemplo.id = uuidv4();
  exemploDB.push(exemplo);

  const filePath = path.join(__dirname, "../db/dbExemplo.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(exemploDB, null, 2));
    res.json(exemplo);
  } catch (err) {
    console.error("Erro ao salvar o exemplo:", err);
    res.status(500).json({
      erro: "Erro ao salvar o exemplo",
    });
  }
});

// Rota para atualizar um exemplo
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const exemplo = req.body;
  const index = exemploDB.findIndex((exemplo) => exemplo.id === id);
  if (index < 0)
    return res.status(404).json({
      erro: "Exemplo não encontrado",
    });
  exemploDB[index] = exemplo;

  const filePath = path.join(__dirname, "../db/dbExemplo.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(exemploDB, null, 2));
    res.json(exemplo);
  } catch (err) {
    console.error("Erro ao salvar o exemplo:", err);
    res.status(500).json({
      erro: "Erro ao salvar o exemplo",
    });
  }
});

// Rota para deletar um exemplo
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const index = exemploDB.findIndex((exemplo) => exemplo.id === id);
  if (index < 0)
    return res.status(404).json({
      erro: "Exemplo não encontrado",
    });
  exemploDB.splice(index, 1);

  const filePath = path.join(__dirname, "../db/dbExemplo.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(exemploDB, null, 2));
    res.json({ id });
  } catch (err) {
    console.error("Erro ao salvar o exemplo:", err);
    res.status(500).json({
      erro: "Erro ao salvar o exemplo",
    });
  }
});

module.exports = router;
