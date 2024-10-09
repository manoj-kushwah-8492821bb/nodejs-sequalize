const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "NodeJs Assessment API with Swagger",
            version: "0.1.0",
            description: "",
        },
        servers: [{ url: "http://localhost:5000" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Optional, indicates the token type is JWT
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["src/routes/*.js"],
};

module.exports = swaggerOptions;
