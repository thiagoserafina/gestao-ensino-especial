const { v4: uuidv4 } = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const usersDB = require("../db/users.json");

/**
 * @swagger
 * components:
 *   schemas:
 *     UsersResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do usuário
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         username:
 *           type: string
 *           description: Nome de usuário
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *         level:
 *           type: string
 *           description: Tipo de permissão do usuário
 *         status:
 *           type: string
 *           description: Status do usuário
 *       example:
 *         id: 5b7cc1282c4f6ec0235acd4bfa780145aa2a67fd
 *         name: Claudia Trescher
 *         email: claudia@gmail.com
 *         username: claudia.trescher
 *         pwd: claudia123
 *         level: admin
 *         status: on
 *     UserCreate:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - username
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         username:
 *           type: string
 *           description: Nome de usuário
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *         level:
 *           type: string
 *           description: Tipo de permissão do usuário
 *         status:
 *           type: string
 *           description: Status do usuário
 *       example:
 *         name: Silvio Junior
 *         email: silvio@gmail.com
 *         username: silvio.jr
 *         pwd: silvio123
 *         level: user
 *         status: on
 *     UserUpdate:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - username
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         username:
 *           type: string
 *           description: Nome de usuário
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *         level:
 *           type: string
 *           description: Tipo de permissão do usuário
 *         status:
 *           type: string
 *           description: Status do usuário
 *       example:
 *         name: Silvio Junior
 *         email: silvio@gmail.com
 *         username: silvio.jr
 *         pwd: silvio123
 *         level: user
 *         status: on
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para cadastro de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UsersResponse'
 */
router.get("/", (req, res) => {
  res.json(usersDB);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O ID do usuário a ser buscado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const user = usersDB.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      erro: "Usuário não encontrado",
    });
  }

  res.json(user);
});

/**
 * @swagger
 * /users/username/{username}:
 *   get:
 *     summary: Retorna os dados do usuário pelo seu nome de cadastro
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome de usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UsersResponse'
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/username/:username", (req, res) => {
  const username = req.params.username;
  const users = usersDB.filter((users) => users.username.startsWith(username));
  if (users.length === 0)
    return res.status(404).json({
      erro: "Usuário não encontrado",
    });
  res.json(users);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       500:
 *         description: Erro ao salvar o usuário
 */
router.post("/", (req, res) => {
  const { name, email, username, pwd, level, status } = req.body;
  const user = {
    id: uuidv4(),
    name,
    email,
    username,
    pwd,
    level,
    status,
  };
  usersDB.push(user);

  const filePath = path.join(__dirname, "../db/users.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(usersDB, null, 2));
    res.status(201).json(user);
  } catch (err) {
    console.error("Erro ao salvar o usuário:", err);
    res.status(500).json({
      erro: "Erro ao salvar o usuário",
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao salvar o usuário
 */
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, username, pwd, level, status } = req.body;
  const index = usersDB.findIndex((user) => user.id === id);

  if (index < 0) {
    return res.status(404).json({
      erro: "Usuário não encontrado",
    });
  }

  const updatedUser = { id, name, email, username, pwd, level, status };

  usersDB[index] = updatedUser;

  const filePath = path.join(__dirname, "../db/users.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(usersDB, null, 2));
    res.json(updatedUser);
  } catch (err) {
    console.error("Erro ao salvar o usuário:", err);
    res.status(500).json({
      erro: "Erro ao salvar o usuário",
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
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
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao salvar o usuário
 */
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const index = usersDB.findIndex((user) => user.id === id);

  if (index < 0) {
    return res.status(404).json({
      erro: "Usuário não encontrado",
    });
  }

  usersDB.splice(index, 1);

  const filePath = path.join(__dirname, "../db/users.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(usersDB, null, 2));
    res.json({ id, message: "Usuário removido com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar as alterações:", err);
    res.status(500).json({
      erro: "Erro ao salvar as alterações",
    });
  }
});

module.exports = router;
