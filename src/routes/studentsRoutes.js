const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const studentsDB = require("../db/students.json");

function saveStudents() {
  try {
    fs.writeFileSync(
      "./src/db/students.json",
      JSON.stringify(studentsDB, null, 2)
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
 *     StudentResponse:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - age
 *        - kin
 *        - phone_number
 *        - special_needs
 *        - status
 *      properties:
 *        id:
 *          type: string
 *          description: O id é gerado automaticamente pelo cadastro do Estudante
 *        name:
 *          type: string
 *          description: Nome do Estudante
 *        age:
 *          type: int
 *          description: Idade do Estudante
 *        kin:
 *         type: string
 *         description: Parentes do Estudante
 *        phone_number:
 *         type: int
 *         description: Número de Telefone do Estudante
 *        special_needs:
 *         type: string
 *         description: Necessidades Especiais do Estudante
 *        status:
 *         type: string
 *         description: Status do Estudante
 *      example:
 *        id: d7285041-3a09-4a71-8d0e-3070763d3d00
 *        name: Emily Goulart
 *        age: 43
 *        kin: Leandro Goulart e Carol Goulart
 *        phone_number: 48 9696 5858
 *        special_needs: Síndrome de down
 *        status: on
 *     StudentCreate:
 *      type: object
 *      required:
 *        - name
 *        - age
 *        - kin
 *        - phone_number
 *        - special_needs
 *        - status
 *      properties:
 *        name:
 *          type: string
 *          description: Nome do Estudante
 *        age:
 *          type: int
 *          description: Idade do Estudante
 *        kin:
 *         type: string
 *         description: Parentes do Estudante
 *        phone_number:
 *         type: int
 *         description: Número de Telefone do Estudante
 *        special_needs:
 *         type: string
 *         description: Necessidades Especiais do Estudante
 *        status:
 *         type: string
 *         description: Status do Estudante
 *      example:
 *        id: d7285041-3a09-4a71-8d0e-3070763d3d00
 *        name: Emily Goulart
 *        age: 43
 *        kin: Leandro Goulart e Carol Goulart
 *        phone_number: 48 9696 5858
 *        special_needs: Síndrome de down
 *        status: on
 *     StudentUpdate:
 *      type: object
 *      required:
 *        - name
 *        - age
 *        - kin
 *        - phone_number
 *        - special_needs
 *        - status
 *      properties:
 *        name:
 *          type: string
 *          description: Nome do Estudante
 *        age:
 *          type: int
 *          description: Idade do Estudante
 *        kin:
 *         type: string
 *         description: Parentes do Estudante
 *        phone_number:
 *         type: int
 *         description: Número de Telefone do Estudante
 *        special_needs:
 *         type: string
 *         description: Necessidades Especiais do Estudante
 *        status:
 *         type: string
 *         description: Status do Estudante
 *      example:
 *        id: d7285041-3a09-4a71-8d0e-3070763d3d00
 *        name: Emily Goulart
 *        age: 43
 *        kin: Leandro Goulart e Carol Goulart
 *        phone_number: 48 9696 5858
 *        special_needs: Síndrome de down
 *        status: on
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description:
 *     API de Controle de Estudantes
 *     **Por Gabriel Goulart de Souza**
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentResponse'
 */

router.get("/", (req, res) => {
  res.json(studentsDB);
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Um estudante pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *       404:
 *         description: Estudante não encontrado
 */

router.get("/:id", (req, res) => {
  const id = req.params.id;
  var student = studentsDB.find((student) => student.id === id);
  if (!student)
    return res.status(404).json({
      erro: "Aluno não encontrado!",
    });
  res.json(student);
});

/**
 * @swagger
 * /students/name/{name}:
 *   get:
 *     summary: Retorna o aluno por nome
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do aluno
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentResponse'
 *       404:
 *         description: Aluno não encontrado
 */

router.get("/name/:name", (req, res) => {
  const name = req.params.name;
  var student = studentsDB.filter((student) => student.name === name);

  if (!student) {
    return res.status(404).json({
      erro: "Nenhum aluno encontrado com esse nome",
    });
  }

  res.json(student);
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentCreate'
 *     responses:
 *       200:
 *         description: O estudante foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 */

router.post("/", (req, res) => {
  const newStudent = {
    id: uuidv4(),
    ...req.body,
  };
  console.log(newStudent);
  studentsDB.push(newStudent);
  let result = saveStudents();
  console.log(result);
  return res.json(newStudent);
});

/**
 * @swagger
 * /students/{id}:
 *  put:
 *    summary: Atualiza um estudante pelo ID
 *    tags: [Students]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do estudante
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/StudentUpdate'
 *    responses:
 *      200:
 *        description: O estudante foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StudentResponse'
 *      404:
 *        description: Estudante não encontrado
 */

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const newStudent = req.body;
  const currentStudent = studentsDB.find((student) => student.id === id);
  const currentIndex = studentsDB.findIndex((student) => student.id === id);
  if (!currentStudent)
    return res.status(404).json({
      erro: "Aluno não encontrado!",
    });
  studentsDB[currentIndex] = newStudent;
  let result = saveStudents();
  console.log(result);
  return res.json(newStudent);
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: O estudante foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StudentResponse'
 *       404:
 *         description: Estudante não encontrado
 */

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const currentStudent = studentsDB.find((student) => student.id === id);
  const currentIndex = studentsDB.findIndex((student) => student.id === id);
  if (!currentStudent)
    return res.status(404).json({
      erro: "Aluno não encontrado!",
    });
  var deletado = studentsDB.splice(currentIndex, 1);
  let result = saveStudents();
  console.log(result);
  res.json(deletado);
});

module.exports = router;
