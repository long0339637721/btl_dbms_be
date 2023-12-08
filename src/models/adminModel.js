const pool = require('../configs/connectDB');
const mssql = require('mssql');

const getAllUserByRole = async (role = 'user') => {
  try {
    const user = await pool
      .request()
      .input('role', mssql.VarChar, role)
      .query(`SELECT * FROM Users WHERE role = @role`);
    return user.recordset;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const getAllCustomerByOrder = async (minOrderValue, startTime, endTime) => {
  try {
    const user = await pool
      .request()
      .input('minOrderValue', mssql.Int, minOrderValue)
      .input('startTime', mssql.DateTime, startTime)
      .input('endTime', mssql.DateTime, endTime)
      .query(
        `SELECT id, name, email, phone
        FROM users 
        WHERE id IN (SELECT O.user_id
        FROM order_details AS OD, products AS P, orders AS O 
        WHERE OD.product_id = P.id 
        AND OD.order_id = O.id 
        AND O.time_order >= @startTime AND O.time_order <= @endTime
        GROUP BY O.user_id 
        HAVING SUM(P.price*OD.count) >= @minOrderValue)`,
      );
    return user.recordset;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const getUserById = async (id) => {
  try {
    const user = await pool
      .request()
      .input('id', mssql.Int, id)
      .query(`SELECT * FROM Users WHERE id = @id`);
    return user.recordset;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const deleteUser = async (id) => {
  try {
    const res = await pool
      .request()
      .input('id', mssql.Int, id)
      .query(`DELETE FROM Users WHERE id = @id`);
    return res.recordset;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const getAllStaff = async () => {
  try {
    const staff = await pool.request().query(`SELECT * FROM staffs`);
    return staff.recordset;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const addStaff = async (name, email, phone, password, address) => {
  try {
    const query = `insert into users (name, email, phone, password, passwordChangedAt, registryAt, address, role) 
      VALUES (@name,@email,@phone,@password, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, @address, @role)`;
    const newStaff = await pool
      .request()
      .input('name', mssql.NVarChar, name)
      .input('email', mssql.NVarChar, email)
      .input('phone', mssql.NVarChar, phone)
      .input('password', mssql.NVarChar, password)
      .input('address', mssql.NVarChar, address)
      .input('role', mssql.VarChar, 'staff')
      .query(query);
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getAllUserByRole,
  getAllCustomerByOrder,
  getUserById,
  deleteUser,
  getAllStaff,
  addStaff,
};
