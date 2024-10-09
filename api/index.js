const cors = require("cors");
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../src/routes');

// swagger ui
const swaggerOptions = require("./swagger");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const specs = swaggerJsdoc(swaggerOptions);

require("dotenv/config");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// api routes
app.use("/api", router);
app.get("/", (_, res) => res.send("Your Api is ready✔"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;