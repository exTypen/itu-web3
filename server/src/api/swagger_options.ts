import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'This is the API documentation for firebase EVM simulation project',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // API server url
      },
    ],
  },
  apis: ['./src/api/routes/**/*.ts'], // Swagger dokümantasyonu için route dosyalarındaki açıklamaları alacak
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec, swaggerUi };
