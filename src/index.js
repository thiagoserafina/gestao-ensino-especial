const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const routes = require("./routes");

const hostname = "127.0.0.1";
const port = 8080;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Exemplo",
      version: "1.0.0",
      description: `API para demonstração de Documentação API via Swagger.  
            ### TD 01    
            Disciplina: DAII 2024.02 Turma 02  
            Equipe: Claudia, Estefani, Gabriel, Gabrielle e Thiago   
			`,
      license: {
        name: "Licenciado para DAII",
      },
      contact: {
        name: "André F Ruaro",
      },
    },
    servers: [
      {
        url: `http://127.0.0.1:8080/`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use(express.json());

app.use("/", routes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.listen(port, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(`Swagger running at http://${hostname}:${port}/docs`);
});
