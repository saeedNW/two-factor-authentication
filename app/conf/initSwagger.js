/** import swagger ui express module */
const swaggerUi = require("swagger-ui-express");
/** import swagger jsdoc module */
const swaggerJsDoc = require("swagger-jsdoc");

/** swagger configs */
exports.initializeSwagger = (app) => {
    app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc({
        swaggerDefinition: {
            info: {
                title: "2FA",
                version: "1.0.0",
                description: "simple two factor authentication",
                contact: {
                    name: "Saeed Noroozi",
                    url: "https://codding.ir",
                    email: "saeednorouzi98@gmail.com"
                }
            },
            servers: [
                {
                    url: "http://localhost:3000"
                }
            ]
        },
        apis: ['./app/routes/**.js'],
    })));
}