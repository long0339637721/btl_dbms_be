const pool = require("../configs/connectDB");

let getAllShipping = async () => {
    let [rs] = await pool.execute(`select * from shipping_method`);
    return rs; 
};
let getShipping = async (id) => {
  let [rs] = await pool.execute(`select * from shipping_method where id = ?`,[id]);
  return rs;
};
let getVoucherUser = async (id) => {
  let [rs] = await pool.execute(`select voucher_id, name, sale_percent, max_price, min_price_apply, count, expired from own_voucher INNER join voucher on id = voucher_id where user_id = ?`, [
    id,
  ]);
  return rs;
};
let getOrderByUser = async (id) => {
    let [order] = await pool.execute(`select * from \`order\` where user_id = ?`, [id]);
    return order; 
};

let viewDetailOrder = async (orderId) => {
let [order] = await pool.execute(`select * from \`order_detail\` where order_id = ?`, [orderId]);
    return order; 
};
let addOrder = async (oid, id, voucher_id, payment_id, shipping_id, notice, sum_price, order_detail) => {
    try {
        await pool.execute(`insert into \`order\` VALUES (?,?,?,?,?, CURRENT_TIME, NULL, 'Confirm',?,?)`,[oid, id, voucher_id, payment_id, shipping_id, sum_price, notice]);
        let [[{order_id}]] = await pool.execute(`SELECT id as order_id FROM \`order\` ORDER BY id DESC LIMIT 1;`);
        order_detail.forEach(async element => {
            await pool.execute(`insert into order_detail VALUES (NULL,?,?,?)`, [order_id, element.product_id, element.count]);
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
let getOrderByStatus = async (status) =>{
  try {
    const [rs] = await pool.execute(`select * from \`order\` where status = ?`, [status]);
    return rs;
  } catch (error) {
    return false;
  }
};
let deleteOrder = async (order_id) =>{
  try {
    await pool.execute(`DELETE FROM \`order\` where id =?`, [order_id]);
    return true;
  } catch (error) {
    return false;
  }
};
let setStatus = async (order_id, status) =>{
  try {
    await pool.execute(`UPDATE \`order\` SET status = ? where id =?`, [status, order_id]);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getOrderByUser,
  addOrder,
  getOrderByStatus,
  deleteOrder,
  setStatus,
  viewDetailOrder,
  getAllShipping,
  getShipping,
  getVoucherUser,
};