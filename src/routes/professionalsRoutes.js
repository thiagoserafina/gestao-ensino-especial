const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const ProfessionalsDB = require("../db/professionals.json");

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
 *     ProfessionalResponse:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - age
 *        - specialty
 *        - contact
 *        - phone_number
 *        - status
 *      properties:
 *        id:
 *          type: string
 *          description: O id é gerado automaticamente pelo cadastro do Profissional
 *        name:
 *          type: string
 *          description: Nome do Profissional
 *        age:
 *          type: int
 *          description: Idade do Profissional
 *        specialty:
 *         type: string
 *         description: Especialidade do Profissional
 *        contact:
 *         type: int
 *         description: Contato do Profissional
 *        phone_number:
 *         type: string
 *         description: Número de Telefone do Profissional
 *        status:
 *         type: string
 *         description: Status do Profissional
 *      example:
 *        id: 059c5625-7dbd-4893-9164-33d115c6c1a6
 *        name: Emily Duarte
 *        age: 43
 *        specialty: Psicóloga
 *        contact: wb.psico@gmail.com
 *        phone_number: 48 7264 5148
 *        status: on
 *     ProfessionalCreate:
 *      type: object
 *      required:
 *        - name
 *        - age
 *        - specialty
 *        - contact
 *        - phone_number
 *        - status
 *      properties:
 *        name:
 *          type: string
 *          description: Nome do Profissional
 *        age:
 *          type: int
 *          description: Idade do Profissional
 *        specialty:
 *         type: string
 *         description: Especialidade do Profissional
 *        contact:
 *         type: int
 *         description: Contato do Profissional
 *        phone_number:
 *         type: string
 *         description: Número de Telefone do Profissional
 *        status:
 *         type: string
 *         description: Status do Profissional
 *      example:
 *        id: 059c5625-7dbd-4893-9164-33d115c6c1a6
 *        name: Emily Duarte
 *        age: 43
 *        specialty: Psicóloga
 *        contact: wb.psico@gmail.com
 *        phone_number: 48 7264 5148
 *        status: on
 *     ProfessionalUpdate:
 *      type: object
 *      required:
 *        - name
 *        - age
 *        - specialty
 *        - contact
 *        - phone_number
 *        - status
 *      properties:
 *        name:
 *          type: string
 *          description: Nome do Profissional
 *        age:
 *          type: int
 *          description: Idade do Profissional
 *        specialty:
 *         type: string
 *         description: Especialidade do Profissional
 *        contact:
 *         type: int
 *         description: Contato do Profissional
 *        phone_number:
 *         type: string
 *         description: Número de Telefone do Profissional
 *        status:
 *         type: string
 *         description: Status do Profissional
 *      example:
 *        id: 059c5625-7dbd-4893-9164-33d115c6c1a6
 *        name: Emily Duarte
 *        age: 43
 *        specialty: Psicóloga
 *        contact: wb.psico@gmail.com
 *        phone_number: 48 7264 5148
 *        status: on
 */

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description:
 *     API de Controle de profissionais
 *     *Por Gabriel Goulart de Souza*
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
 *                 $ref: '#/components/schemas/ProfessionalResponse'
 */

router.get("/", (req, res) => {
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfessionalResponse'
 *       404:
 *         description: Profissional não encontrado
 */

router.get("/:id", (req, res) => {
  const id = req.params.id;
  var Professional = ProfessionalsDB.find(
    (Professional) => Professional.id === id
  );
  if (!Professional)
    return res.status(404).json({
      erro: "Profissional não encontrado!",
    });
  res.json(Professional);
});

/**
 * @swagger
 * /professionals/name/{name}:
 *   get:
 *     summary: Retorna o profissional por nome
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do profissional
 *     responses:
 *       200:
 *         description: profissional encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProfessionalResponse'
 *       404:
 *         description: Profissional não encontrado
 */

router.get("/name/:name", (req, res) => {
  const name = req.params.name;
  const professional = ProfessionalsDB.filter(
    (professional) => professional.name === name
  );

  if (!professional) {
    return res.status(404).json({
      erro: "Nenhum profissional encontrado com esse nome",
    });
  }

  res.json(professional);
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
 *             $ref: '#/components/schemas/ProfessionalCreate'
 *     responses:
 *       200:
 *         description: O profissional foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfessionalResponse'
 */

router.post("/", (req, res) => {
  const newProfessional = {
    id: uuidv4(),
    ...req.body,
  };
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
 *            $ref: '#/components/schemas/ProfessionalUpdate'
 *    responses:
 *      200:
 *        description: O profissional foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProfessionalResponse'
 *      404:
 *        description: profissional não encontrado
 */

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const newProfessional = req.body;
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
 *              $ref: '#/components/schemas/ProfessionalResponse'
 *       404:
 *         description: profissional não encontrado
 */

router.delete("/:id", (req, res) => {
  const id = req.params.id;
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
