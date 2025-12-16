const express = require("express");
const app = express();
const port = 3000;

const products = require("./routes/products");

app.use(express.json());

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ECP Technologies - Mi nueva API",
            version: "2.0.0",
            description: "Descripción actualizada",
            contact: {
                name: "Elí Castillo",
                email: "eli@castillo.com", 
            }
        },
        servers: [
            {url: "http://localhost:3000"}
        ],
            supportedSubmitMethods: []
    },
    apis: [
        "./routes/products.js"
    ]
    }

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs, {CustomCss: ".swagger-ui.topbar, .swagger-ui .try-out {display: none}" }))

app.use("/products", products);

app.use((req, res) => {
    res.status(404).json({
        message: "Incorrect Route or params",
    })
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
})

module.exports = app;

