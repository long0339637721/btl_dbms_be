const pool = require('../configs/connectDB');
const mssql = require('mssql');

const getUserByPhone = async (phone) => {
  const result = await pool
    .request()
    .input('phone', mssql.NVarChar, phone)
    .query(`select * from users where phone = @phone`);
  return result.recordset;
};
const getUserByEmail = async (email) => {
  const result = await pool
    .request()
    .input('email', mssql.NVarChar, email)
    .query(`select * from users where email = @email`);
  return result.recordset;
};
const getUserById = async (id) => {
  const result = await pool
    .request()
    .input('id', mssql.Int, id)
    .query(`select * from users where id = @id`);
  return result.recordset;
};
const createUser = async (phone, password, email, name) => {
  try {
    await pool.execute(
      `insert into user (name, email, phone, password, passwordChangedAt, registryAt) 
        VALUES (@,@,@,@, CURRENT_TIME, CURRENT_TIME)`,
      [name, email, phone, password],
    );
    return 'success';
  } catch (error) {
    return error;
  }
};
const setAvatar = async (avatar, id) => {
  try {
    await pool.execute(`update user SET avatar =@ where id = @`, [avatar, id]);
    return 'success';
  } catch (error) {
    return error;
  }
};
const editProfile = async (name, phone, email, address, id) => {
  try {
    await pool
      .request()
      .input('name', mssql.NVarChar, name)
      .input('phone', mssql.NVarChar, phone)
      .input('email', mssql.NVarChar, email)
      .input('address', mssql.NVarChar, address)
      .input('id', mssql.Int, id)
      .query(
        `update users set name = @name, phone = @phone, email = @email, address = @address where id = @id`,
      );
    return 'success';
  } catch (error) {
    return error;
  }
};
const changePassword = async (password, id) => {
  try {
    await pool
      .request()
      .input('password', mssql.NVarChar, password)
      .input('id', mssql.Int, id)
      .query(`update users set password = @password where id = @id`);
    return 'success';
  } catch (error) {
    return error;
  }
};

const setLastLogin = async (id) => {
  try {
    await pool
      .request()
      .input('id', mssql.Int, id)
      .query(`update users set last_login = CURRENT_TIMESTAMP where id = @id`);
    console.log(`Set last login success for user ${id} successfully`);
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getUserByPhone,
  createUser,
  setAvatar,
  getUserById,
  editProfile,
  changePassword,
  getUserByEmail,
  setLastLogin,
};
