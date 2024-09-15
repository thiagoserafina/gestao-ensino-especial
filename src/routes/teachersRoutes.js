const { v4: uuidv4 } = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const teacherDB = require("../db/teachers.json");

router.get("/", (req, res) => {
  res.json(teacherDB);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  var teacher = teacherDB.find((teacher) => teacher.id === id);

  if (!teacher) {
    return res.status(404).json({
      erro: "Professor(a) não encontrado",
    });
  }

  res.json(teacher);
});

// Faltou a rota de busca por nome

router.post("/", (req, res) => {
  const teacher = req.body;
  teacher.id = uuidv4();
  teacherDB.push(teacher);

  const filePath = path.join(__dirname, "../db/teachers.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(teacherDB, null, 2));
    res.json(teacher);
  } catch (err) {
    console.error("Erro ao salvar o(a) professor(a):", err);
    res.status(500).json({
      erro: "Erro ao salvar o(a) professor(a)",
    });
  }
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const teacher = req.body;
  const index = teacherDB.findIndex((teacher) => teacher.id === id);

  if (index < 0) {
    return res.status(404).json({
      erro: "Professor(a) não encontrado",
    });
  }

  if (!teacher.id) {
    teacher.id = uuidv4();
  }

  teacherDB[index] = teacher;

  const filePath = path.join(__dirname, "../db/teachers.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(teacherDB, null, 2));
    res.json(teacher);
  } catch (err) {
    console.error("Erro ao salvar o(a) professor(a):", err);
    res.status(500).json({
      erro: "Erro ao salvar o(a) professor(a)",
    });
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const index = teacherDB.findIndex((teacher) => teacher.id === id);

  if (index < 0) {
    return res.status(404).json({
      erro: "Professor(a) não encontrado",
    });
  }

  teacherDB.splice(index, 1);

  const filePath = path.join(__dirname, "../db/teachers.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(teacherDB, null, 2));
    res.json({ id, message: "Professor(a) removido(a) com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar o(a) professor(a):", err);
    res.status(500).json({
      erro: "Erro ao salvar o(a) professor(a)",
    });
  }
});

module.exports = router;
