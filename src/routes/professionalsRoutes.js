const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

var ProfessionalsDB = loadProfessionals();

// Função carrega profissionais a partir do arquivo JSON
function loadProfessionals() {
  try {
    return JSON.parse(fs.readFileSync("./src/db/Professionals.json", "utf8"));
  } catch (err) {
    return [];
  }
}
// Função para salvar os profissionais no arquivo JSON
function saveProfessionals() {
  try {
    fs.writeFileSync(
      "./src/db/professionals.json",
      JSON.stringify(ProfessionalsDB, null, 2)
    );
    return "Saved";
  } catch (err) {
    return "Not saved";
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *      type: object
 *      required:
 *        - id
 *        - nome
 *        - idade
 *        - especialidade
 *        - contato
 *        - número_de_telefone
 *        - status
 *      properties:
 *        id:
 *          type: string
 *          description: O id é gerado automaticamente pelo cadastro do Profissional
 *        nome:
 *          type: string
 *          description: Nome do Profissional
 *        idade:
 *          type: int
 *          description: Idade do Profissional
 *        especialidade:
 *         type: string
 *         description: Especialidade do Profissional
 *        contato:
 *         type: int
 *         description: Contato do Profissional
 *        número_de_telefone:
 *         type: string
 *         description: Número de Telefone do Profissional
 *        status:
 *         type: string
 *         description: Status do Profissional
 *      example:
 *        id: 059c5625-7dbd-4893-9164-33d115c6c1a6
 *        nome: Emily Duarte
 *        idade: 43
 *        especialidade: Psicóloga
 *        contato: wb.psico@gmail.com
 *        número_de_telefone: 48 7264 5148
 *        status: on
 */

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description:
 *     API de Controle de profissionais
 *     **Por Gabriel Goulart de Souza**
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: A lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 */

// GET "/professionals"
router.get("/", (req, res) => {
  ProfessionalsDB = loadProfessionals();
  res.json(ProfessionalsDB);
});

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Um profissional pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: profissional não encontrado
 */

// GET "/professionals/1"
router.get("/:id", (req, res) => {
  const id = req.params.id;
  ProfessionalsDB = loadProfessionals();
  var Professional = ProfessionalsDB.find(
    (Professional) => Professional.id === id
  );
  if (!Professional)
    return res.status(404).json({
      erro: "Aluno não encontrado!",
    });
  res.json(Professional);
});

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       200:
 *         description: O profissional foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 */

// POST "/professionals" BODY { "nome": "Eragon"}
router.post("/", (req, res) => {
  const newProfessional = {
    id: uuidv4(),
    ...req.body,
  };
  ProfessionalsDB = loadProfessionals();
  ProfessionalsDB.push(newProfessional);
  let result = saveProfessionals();
  console.log(result);
  return res.json(newProfessional);
});

/**
 * @swagger
 * /professionals/{id}:
 *  put:
 *    summary: Atualiza um profissional pelo ID
 *    tags: [Professionals]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do profissional
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Professional'
 *    responses:
 *      200:
 *        description: O profissional foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Professional'
 *      404:
 *        description: profissional não encontrado
 */

// PUT "/professionals/1" BODY { "nome": "Eragon"}
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const newProfessional = req.body;
  ProfessionalsDB = loadProfessionals();
  const currentProfessional = ProfessionalsDB.find(
    (Professional) => Professional.id === id
  );
  const currentIndex = ProfessionalsDB.findIndex(
    (Professional) => Professional.id === id
  );
  if (!currentProfessional)
    return res.status(404).json({
      erro: "Aluno não encontrado!",
    });
  ProfessionalsDB[currentIndex] = newProfessional;
  let result = saveProfessionals();
  console.log(result);
  return res.json(newProfessional);
});

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Remove um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: O profissional foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Professional'
 *       404:
 *         description: profissional não encontrado
 */

// DELETE "/professionals/1"
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  ProfessionalsDB = loadProfessionals();
  const currentProfessional = ProfessionalsDB.find(
    (Professional) => Professional.id === id
  );
  const currentIndex = ProfessionalsDB.findIndex(
    (Professional) => Professional.id === id
  );
  if (!currentProfessional)
    return res.status(404).json({
      erro: "Aluno não encontrado!",
    });
  var deletado = ProfessionalsDB.splice(currentIndex, 1);
  let result = saveProfessionals();
  console.log(result);
  res.json(deletado);
});

module.exports = router;
