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
const createUser = async (phone, password, email, name, role) => {
  try {
    await pool
      .request()
      .input('name', mssql.NVarChar, name)
      .input('email', mssql.NVarChar, email)
      .input('phone', mssql.NVarChar, phone)
      .input('password', mssql.NVarChar, password)
      .input('role', mssql.VarChar, role)
      .query(`insert into users (name, email, phone, password, passwordChangedAt, registryAt, role) 
      VALUES (@name,@email,@phone,@password, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, @role)`);
    return true;
  } catch (error) {
    return error;
  }
};
const setAvatar = async (avatar, id) => {
  try {
    await pool
      .request()
      .input('avatar', mssql.NVarChar, avatar)
      .input('id', mssql.Int, id)
      .query(`update users set avatar = @avatar where id = @id`);
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
    return true;
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
