const { v4: uuidv4 } = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const teacherDB = require("../db/teachers.json");

/**
 * @swagger
 * components:
 *   schemas:
 *     TeachersResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do professor
 *         name:
 *           type: string
 *           description: Nome do professor
 *         school_disciplines:
 *           type: string
 *           description: Disciplina ministrada pelo professor
 *         contact:
 *           type: string
 *           description: Email do professor
 *         phone_number:
 *           type: string
 *           description: Numero de telefone do professor
 *         status:
 *           type: string
 *           description: Se está trabalhando ou não na empresa
 *         example:
 *           id: 1c4f53a2-8d87-4e36-8c2b-40b7c88cf0b1
 *           name: Ana Silva
 *           school_disciplines: Matemática
 *           contact: ana.silva@escola.com
 *           phone_number: 123456789
 *           status: on
 *     TeachersCreate:
 *       type: object
 *       required:
 *         - name
 *         - school_disciplines
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do professor
 *         school_disciplines:
 *           type: string
 *           description: Disciplina ministrada pelo professor
 *         contact:
 *           type: string
 *           description: Email do professor
 *         phone_number:
 *           type: string
 *           description: Numero de telefone do professor
 *         status:
 *           type: string
 *           description: Se trabalha ou não na empresa
 *         example:
 *           name: Carlos Pereira
 *           school_disciplines: História
 *           contact: carlos.pereira@escola.com
 *           phone_number: 987654321
 *           status: on
 *     TeachersUpdate:
 *       type: object
 *       required:
 *         - name
 *         - school_disciplines
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do professor
 *         school_disciplines:
 *           type: string
 *           description: Disciplina ministrada pelo professor
 *         contact:
 *           type: string
 *           description: Email do professor
 *         phone_number:
 *           type: string
 *           description: Numero de telefone do professor
 *         status:
 *           type: string
 *           description: Se trabalha ou não na empresa
 *         example:
 *           name: Mariana Costa
 *           school_disciplines: Biologia
 *           contact: mariana.costa@escola.com
 *           phone_number: 456123789
 *           status: on
 */

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: API de cadastro de professores **Por Estefani de Souza**
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retorna a lista de todos os professores
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeachersResponse'
 */

router.get("/", (req, res) => {
  res.json(teacherDB);
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Retorna o professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeachersResponse'
 *       404:
 *         description: Professor não encontrado
 */

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

/**
 * @swagger
 * /teachers/name/{name}:
 *   get:
 *     summary: Retorna o professor por nome
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do professor
 *     responses:
 *       200:
 *         description: Professor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeachersResponse'
 *       404:
 *         description: Professor não encontrado
 */

router.get("/name/:name", (req, res) => {
  const name = req.params.name;
  const teacher = teacherDB.filter((teacher) => teacher.name === name);

  if (!teacher) {
    return res.status(404).json({
      erro: "Nenhum(a) professor(a) encontrado(a) com esse nome",
    });
  }

  res.json(teacher);
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Cadastrar um novo professor
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeachersCreate'
 *     responses:
 *       200:
 *         description: Professor cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeachersResponse'
 *       500:
 *         description: Erro ao salvar o cadastro do novo professor
 */

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

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Atualiza o professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeachersUpdate'
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeachersResponse'
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro ao salvar a atualização do professor
 */

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

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Exclui o professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor excluído com sucesso
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
 *         description: Professor não encontrado
 *       500:
 *         description: Erro ao salvar a exlusão doprofessor
 */

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
