import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aiforus API Documentation',
      version: '1.0.0',
      description: 'API documentation for Aiforus backend',
    },
    servers: [
      {
        url: 'http://localhost:3001', // 替换为你的服务器地址
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // 指定路由文件路径，用于生成文档
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  console.log('Swagger docs available at http://localhost:3001/api-docs')
}