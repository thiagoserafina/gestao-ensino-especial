const { v4: uuidv4 } = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const appointmentsDB = require("../db/appointments.json");

/**
 * @swagger
 * components:
 *   schemas:
 *     AppointmentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do agendamento
 *         specialty:
 *           type: string
 *           description: Especialidade do agendamento
 *         comments:
 *           type: string
 *           description: Comentários adicionais sobre o agendamento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         student:
 *           type: string
 *           description: Nome do estudante
 *         professional:
 *           type: string
 *           description: Nome do profissional
 *       example:
 *         id: 110c8549-c088-46ea-9ee4-8b65c439f13f
 *         specialty: Fisioterapeuta
 *         comments: Realizar sessão
 *         date: 2023-08-15 16:00:00
 *         student: Bingo Heeler
 *         professional: Winton Blake
 *     AppointmentCreate:
 *       type: object
 *       required:
 *         - specialty
 *         - date
 *         - student
 *         - professional
 *       properties:
 *         specialty:
 *           type: string
 *           description: Especialidade do agendamento
 *         comments:
 *           type: string
 *           description: Comentários adicionais sobre o agendamento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         student:
 *           type: string
 *           description: Nome do estudante
 *         professional:
 *           type: string
 *           description: Nome do profissional
 *       example:
 *         specialty: Cardiologia
 *         comments: Consulta de rotina
 *         date: 2023-10-01T10:00:00Z
 *         student: João Silva
 *         professional: Dr. José
 *     AppointmentUpdate:
 *       type: object
 *       required:
 *         - specialty
 *         - date
 *         - student
 *         - professional
 *       properties:
 *         specialty:
 *           type: string
 *           description: Especialidade do agendamento
 *         comments:
 *           type: string
 *           description: Comentários adicionais sobre o agendamento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         student:
 *           type: string
 *           description: Nome do estudante
 *         professional:
 *           type: string
 *           description: Nome do profissional
 *       example:
 *         specialty: Cardiologia
 *         comments: Consulta de rotina
 *         date: 2023-10-01T10:00:00Z
 *         student: João Silva
 *         professional: Dr. José
 */

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: API de Controle de Agendamentos **Por Thiago Serafina**
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna a lista de todos os agendamentos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppointmentResponse'
 */

router.get("/", (req, res) => {
  res.json(appointmentsDB);
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Retorna um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       404:
 *         description: Agendamento não encontrado
 */

router.get("/:id", (req, res) => {
  const id = req.params.id;
  var appointment = appointmentsDB.find((appointment) => appointment.id === id);
  if (!appointment)
    return res.status(404).json({
      erro: "Agendamento não encontrado",
    });
  res.json(appointment);
});

/**
 * @swagger
 * /appointments/date/{date}:
 *   get:
 *     summary: Retorna agendamentos por data
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: Data do agendamento
 *     responses:
 *       200:
 *         description: Agendamentos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppointmentResponse'
 *       404:
 *         description: Agendamento não encontrado
 */
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

/**
 * @swagger
 * /appointments/specialty/{specialty}:
 *   get:
 *     summary: Retorna agendamentos por nome da especialidade
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: specialty
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome da especialidade
 *     responses:
 *       200:
 *         description: Agendamentos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppointmentResponse'
 *       404:
 *         description: Agendamento não encontrado
 */
router.get("/specialty/:specialty", (req, res) => {
  const specialty = req.params.specialty;
  const appointment = appointmentsDB.filter(
    (appointment) => appointment.specialty === specialty
  );

  if (!appointment) {
    return res.status(404).json({
      erro: "Nenhum agendamento encontrado com esse nome",
    });
  }

  res.json(appointment);
});

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentCreate'
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       500:
 *         description: Erro ao salvar o agendamento
 */
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

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentUpdate'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro ao salvar o agendamento
 */
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

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Exclui um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro ao salvar o agendamento
 */
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
