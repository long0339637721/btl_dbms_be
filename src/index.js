const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const route = require('./routes/route');

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

route(app);

app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
});
