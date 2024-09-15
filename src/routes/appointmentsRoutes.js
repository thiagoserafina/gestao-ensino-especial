const { v4: uuidv4 } = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const appointmentsDB = require("../db/appointments.json");

router.get("/", (req, res) => {
  res.json(appointmentsDB);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  var appointment = appointmentsDB.find((appointment) => appointment.id === id);
  if (!appointment)
    return res.status(404).json({
      erro: "Agendamento não encontrado",
    });
  res.json(appointment);
});

router.get("/date/:date", (req, res) => {
  const date = req.params.date;
  const appointment = appointmentsDB.filter((appointment) =>
    appointment.date.startsWith(date)
  );
  if (appointment.length === 0)
    return res.status(404).json({
      erro: "Agendamento não encontrado",
    });
  res.json(appointment);
});

router.post("/", (req, res) => {
  const { specialty, comments, date, student, professional } = req.body;
  const appointment = {
    id: uuidv4(),
    specialty,
    comments,
    date,
    student,
    professional,
  };
  appointmentsDB.push(appointment);

  const filePath = path.join(__dirname, "../db/appointments.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(appointmentsDB, null, 2));
    res.json(appointment);
  } catch (err) {
    console.error("Erro ao salvar o agendamento:", err);
    res.status(500).json({
      erro: "Erro ao salvar o agendamento",
    });
  }
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { specialty, comments, date, student, professional } = req.body;
  const index = appointmentsDB.findIndex(
    (appointment) => appointment.id === id
  );

  if (index < 0) {
    return res.status(404).json({
      erro: "Agendamento não encontrado",
    });
  }

  const appointment = {
    id,
    specialty,
    comments,
    date,
    student,
    professional,
  };

  appointmentsDB[index] = appointment;

  const filePath = path.join(__dirname, "../db/appointments.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(appointmentsDB, null, 2));
    res.json(appointment);
  } catch (err) {
    console.error("Erro ao salvar o agendamento:", err);
    res.status(500).json({
      erro: "Erro ao salvar o agendamento",
    });
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const index = appointmentsDB.findIndex(
    (appointment) => appointment.id === id
  );

  if (index < 0) {
    return res.status(404).json({
      erro: "Agendamento não encontrado",
    });
  }

  appointmentsDB.splice(index, 1);

  const filePath = path.join(__dirname, "../db/appointments.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(appointmentsDB, null, 2));
    res.json({ id, message: "Agendamento excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar o agendamento:", err);
    res.status(500).json({
      erro: "Erro ao salvar o agendamento",
    });
  }
});

module.exports = router;
