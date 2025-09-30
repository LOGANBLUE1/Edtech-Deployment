const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require("dotenv").config();
const PORT = process.env?.PORT || 5000;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0"
        }
    },
    apis: ["./routes/*.js"], // <- Make sure this path matches your route files
};


const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };