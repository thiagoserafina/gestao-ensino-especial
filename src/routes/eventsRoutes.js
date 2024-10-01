const { v4: uuidv4 } = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const eventsDB = require("../db/events.json");

/**
 * @swagger
 * components:
 *   schemas:
 *     EventsResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do evento
 *         description:
 *           type: string
 *           description: Nome do evento
 *         comments:
 *           type: string
 *           description: Comentário sobre o evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *         example:
 *           id: ee52f313-2483-4715-ad80-eb2a28cf8eea
 *           description: Oficina de Desenho e Expressão
 *           comments: Atividade de artes para estimular a criatividade dos alunos
 *           date: 2023-08-22 14:30:00
 *     EventsCreate:
 *       type: object
 *       required:
 *         - description
 *         - comments
 *         - date
 *       properties:
 *         description:
 *           type: string
 *           description: Nome do evento
 *         comments:
 *           type: string
 *           description: Comentário sobre o evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *         example:
 *           description: Aula de Música e Ritmo
 *           comments: Explorando instrumentos simples para desenvolver o senso de ritmo
 *           date: 2023-09-05 10:00:00
 *     EventsUpdate:
 *       type: object
 *       required:
 *         - description
 *         - comments
 *         - date
 *       properties:
 *         description:
 *           type: string
 *           description: Nome do evento
 *         comments:
 *           type: string
 *           description: Comentário sobre o evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *         example:
 *           description: Sessão de Leitura Interativa
 *           comments: Leitura de histórias com a participação ativa dos alunos
 *           date: 2023-09-12 11:00:00
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API de Cadastros de Eventos **Por Gabrielle Coral**
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna a lista de todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista dos eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventsResponse'
 */
router.get("/", (req, res) => {
  res.json(eventsDB);
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retorna o evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventsResponse'
 *       404:
 *         description: Evento não encontrado!
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;
  var event = eventsDB.find((event) => event.id === id);
  if (!event)
    return res.status(404).json({
      erro: "Evento não encontrado!",
    });
  res.json(event);
});

/**
 * @swagger
 * /events/name/{name}:
 *   get:
 *     summary: Retorna eventos por nome
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventsResponse'
 *       404:
 *         description: Nenhum evento encontrado com esse nome!
 */
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

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cadastrar um novo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventsCreate'
 *     responses:
 *       200:
 *         description: Evento cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventsResponse'
 *       500:
 *         description: Erro ao salvar evento!
 */
router.post("/", (req, res) => {
  const { description, comments, date } = req.body;
  const event = {
    id: uuidv4(),
    description,
    comments,
    date,
  };
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

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventsUpdate'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventsResponse'
 *       404:
 *         description: Evento não encontrado!
 *       500:
 *         description: Erro ao salvar evento!
 */
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { description, comments, date } = req.body;
  const index = eventsDB.findIndex((event) => event.id === id);

  if (index < 0) {
    return res.status(404).json({
      erro: "Evento não encontrado!",
    });
  }

  const event = {
    id,
    description,
    comments,
    date,
  };

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

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Exclui um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento excluído com sucesso!
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
 *         description: Evento não encontrado!
 *       500:
 *         description: Erro ao salvar evento!
 */
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
    res.json({ id, message: "Evento excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar evento:", err);
    res.status(500).json({
      erro: "Erro ao salvar evento!",
    });
  }
});

module.exports = router;
