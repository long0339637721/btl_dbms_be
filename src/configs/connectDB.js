const mssql = require('mssql')
require('dotenv').config();

const config = {
  server: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true
  }
}

const pool = new mssql.ConnectionPool(config);
pool.connect()
  .then(() => {console.log("Connected to SQL Server")})
  .catch(err => console.error("Failed to connect to SQL Server:", err));

// const connection = mssql.connect({
//   server: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   options: {
//     trustServerCertificate: true
//   }
// })
  // .then(pool => {
  //   return pool.request().query('SELECT * FROM categories');
  // })
  // .then(result => {
  //   console.log('Connected: ', result.recordset);
  // })
  // .catch(error => {
  //   console.error('Connect err: ', error);
  // });

module.exports = pool