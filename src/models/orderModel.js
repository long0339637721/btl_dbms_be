const pool = require('../configs/connectDB');
const mssql = require('mssql');

let getAllShipping = async () => {
  let rs = await pool.request().query(`SELECT * FROM shipping_methods`);
  return rs.recordset;
};
let getShipping = async (id) => {
  let rs = await pool
    .request()
    .input('id', mssql.Int, id)
    .query(`SELECT * FROM shipping_methods WHERE id = @id`);
  return rs.recordset;
};
let getVoucherUser = async (id) => {
  let rs = await pool
    .request()
    .input('id', mssql.Int, id)
    .query(
      `SELECT id, name, sale_percent, max_price, min_price_apply, count, expired 
      FROM vouchers
      WHERE user_id = @id`,
    );
  return rs.recordset;
};
const getVoucherValue = async (voucher_id) => {
  const rs = await pool
    .request()
    .input('voucher_id', mssql.Int, voucher_id)
    .query(
      `SELECT sale_percent, max_price, min_price_apply FROM vouchers WHERE id = @voucher_id`,
    );
  return rs.recordset;
};
let getOrderByUser = async (id, status) => {
  if (status) {
    let order = await pool
      .request()
      .input('id', mssql.Int, id)
      .input('status', mssql.NVarChar, status)
      .query(
        `SELECT o.*, SUM(od.count * p.price) AS total_payment
        FROM orders o, order_details od, products p
        WHERE o.user_id = @id 
        AND o.order_status = @status 
        AND od.order_id = o.id 
        AND od.product_id = p.id
        GROUP BY o.id, o.user_id, o.voucher_id, o.payment_id, o.shipping_id, o.time_order, o.time_get, o.order_status, o.notice`,
      );
    return order.recordset;
  }
  let order = await pool
    .request()
    .input('id', mssql.Int, id)
    .query(
      `SELECT o.*, SUM(od.count * p.price) AS total_payment
      FROM orders o, order_details od, products p
      WHERE o.user_id = @id
      AND od.order_id = o.id 
      AND od.product_id = p.id
      GROUP BY o.id, o.user_id, o.voucher_id, o.payment_id, o.shipping_id, o.time_order, o.time_get, o.order_status, o.notice`,
    );
  return order.recordset;
};
const getOrderInfo = async (order_id) => {
  const order = await pool
    .request()
    .input('order_id', mssql.Int, order_id)
    .query(`SELECT * FROM orders WHERE id = @order_id`);
  return order.recordset;
};
let viewDetailOrder = async (orderId) => {
  let order = await pool
    .request()
    .input('id', mssql.Int, orderId)
    .query(
      `SELECT p.id, p.name, p.price, od.count
      FROM order_details od INNER JOIN products p
      ON od.product_id = p.id
      WHERE od.order_id = @id`,
    );
  return order.recordset;
};
let addOrder = async (
  user_id,
  voucher_id,
  payment_id,
  shipping_id,
  notice,
  order_detail,
) => {
  try {
    const transaction = pool.transaction();
    console.log('Transaction begin');
    await transaction.begin();
    try {
      console.log('Transaction request 1');
      await transaction
        .request()
        .input('user_id', mssql.Int, user_id)
        .input('voucher_id', mssql.Int, voucher_id)
        .input('payment_id', mssql.Int, payment_id)
        .input('shipping_id', mssql.Int, shipping_id)
        .input('notice', mssql.NVarChar, notice)
        .query(
          `INSERT INTO orders VALUES (@user_id, @voucher_id, @payment_id, @shipping_id, 
          CURRENT_TIMESTAMP, NULL, 'Confirm', @notice)`,
        );
      console.log('Transaction request 2');
      let newOrder = await transaction
        .request()
        .query(`SELECT id FROM orders ORDER BY id DESC;`);
      for (let i = 0; i < order_detail.length; i++) {
        console.log('Transaction request 3', i);
        await transaction
          .request()
          .input('order_id', mssql.Int, newOrder.recordset[0].id)
          .input('product_id', mssql.Int, order_detail[i].product_id)
          .input('count', mssql.Int, order_detail[i].count)
          .query(
            `INSERT INTO order_details VALUES (@order_id, @product_id, @count)`,
          );
      }
      console.log('Transaction commit');
      await transaction.commit();
      return newOrder.recordset[0].id;
    } catch (error) {
      console.log('Transaction rollback');
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
};
let getOrderByStatus = async (status) => {
  try {
    const rs = await pool
      .request()
      .input('status', mssql.NVarChar, status)
      .query(`SELECT * FROM orders WHERE order_status = @status`);
    return rs.recordset;
  } catch (error) {
    console.log(error);
    return error;
  }
};
let deleteOrder = async (order_id) => {
  try {
    await pool
      .request()
      .input('order_id', mssql.Int, order_id)
      .query(`DELETE FROM orders WHERE id = @order_id`);
    return true;
  } catch (error) {
    return false;
  }
};
let setStatus = async (order_id, status) => {
  try {
    await pool
      .request()
      .input('status', mssql.NVarChar, status)
      .input('order_id', mssql.Int, order_id)
      .query(`UPDATE orders SET order_status = @status WHERE id = @order_id`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getOrderByUser,
  getOrderInfo,
  addOrder,
  getOrderByStatus,
  deleteOrder,
  setStatus,
  viewDetailOrder,
  getAllShipping,
  getShipping,
  getVoucherUser,
  getVoucherValue,
};
