const pool = require("../configs/connectDB");

const getAllUser = async (admin) => {
    let [user] = await pool.execute(`SELECT * FROM User where isAdmin = ?`, [admin]);
    return user;
};

const getUser = async (id) => {
  let [user] = await pool.execute(`SELECT * FROM User where id = ?`, [
    id,
  ]);
  return user;
};

const deleteUser = async (id) => {
    try {
    await pool.execute(`Delete from user where id = ?`, [id]);
    } catch (error) {
        return error;
    }
};
const addStaff = async (name, email, phone, password, address) => {
    try {
      await pool.execute(
        `insert into user (name, email, phone, password, passwordChangedAt, registryAt, address, isAdmin) 
        VALUES (?,?,?,?, CURRENT_TIME, CURRENT_TIME, ?, 1)`,
        [name, email, phone, password, address]
      );
      return true;
    } catch (error) {
      return error;
    }
}; 

module.exports = {
  getAllUser,
  deleteUser,
  addStaff,
  getUser,
};
