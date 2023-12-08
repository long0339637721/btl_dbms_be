const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const route = require('./routes/route');

const configSwagger = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/userRoute.js'], // files containing annotations as above
};

const app = express();
const port = process.env.APP_PORT || 5000;
const host = process.env.APP_HOST || 'localhost';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join('log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.json({ Message: 'OK' });
});

const openapiSpecification = swaggerJsdoc(configSwagger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

route(app);

app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
});
