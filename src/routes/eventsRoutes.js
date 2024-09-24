const { v4: uuidv4 } = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const eventsDB = require("../db/events.json");

router.get("/", (req, res) => {
  res.json(eventsDB);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  var event = eventsDB.find((event) => event.id === id);
  if (!event)
    return res.status(404).json({
      erro: "Evento não encontrado!",
    });
  res.json(event);
});

router.get("/name/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const event = eventsDB.filter((event) =>
    event.description.toLowerCase().includes(name)
  );

  if (!event) {
    return res.status(404).json({
      erro: "Nenhum evento encontrado com esse nome",
    });
  }

  res.json(event);
});

router.post("/", (req, res) => {
  const event = req.body;
  event.id = uuidv4();
  eventsDB.push(event);

  const filePath = path.join(__dirname, "../db/events.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2));
    res.json(event);
  } catch (err) {
    console.error("Erro ao salvar evento:", err);
    res.status(500).json({
      erro: "Erro ao salvar evento!",
    });
  }
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const event = req.body;
  const index = eventsDB.findIndex((event) => event.id === id);
  if (index < 0)
    return res.status(404).json({
      erro: "Evento não encontrado!",
    });
  eventsDB[index] = event;

  const filePath = path.join(__dirname, "../db/events.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2));
    res.json(event);
  } catch (err) {
    console.error("Erro ao salvar evento:", err);
    res.status(500).json({
      erro: "Erro ao salvar evento!",
    });
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const index = eventsDB.findIndex((event) => event.id === id);
  if (index < 0)
    return res.status(404).json({
      erro: "Evento não encontrado!",
    });
  eventsDB.splice(index, 1);

  const filePath = path.join(__dirname, "../db/events.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2));
    res.json({ id });
  } catch (err) {
    console.error("Erro ao salvar evento:", err);
    res.status(500).json({
      erro: "Erro ao salvar evento!",
    });
  }
});

module.exports = router;
