const pool = require('../configs/connectDB');
const mssql = require('mssql');

let getReviewByProductId = async (product_id) => {
  let review = await pool
    .request()
    .input('product_id', mssql.Int, product_id)
    .query(
      `SELECT reviews.id as review_id, product_id, rating, image, content, dateReview, users.name, users.avatar 
      FROM reviews INNER JOIN users 
      ON user_id = users.id 
      WHERE product_id = @product_id`,
    );
  return review.recordset;
};
let getReviewById = async (id) => {
  let review = await pool
    .request()
    .input('id', mssql.Int, id)
    .query(`SELECT * from reviews where id = @id`);
  return review.recordset;
};
let addReview = async (product_id, user_id, rating, image, content) => {
  try {
    await pool
      .request()
      .input('product_id', mssql.Int, product_id)
      .input('user_id', mssql.Int, user_id)
      .input('rating', mssql.Int, rating)
      .input('image', mssql.NVarChar, image)
      .input('content', mssql.NVarChar, content)
      .query(
        `INSERT INTO reviews (product_id, user_id, rating, image, content, dateReview)
        VALUES (@product_id, @user_id, @rating, @image, @content, CURRENT_TIMESTAMP)`,
      );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
let editReview = async (review_id, rating, image, content) => {
  try {
    await pool
      .request()
      .input('review_id', mssql.Int, review_id)
      .input('rating', mssql.Int, rating)
      .input('image', mssql.NVarChar, image)
      .input('content', mssql.NVarChar, content)
      .query(
        `UPDATE reviews SET rating = @rating, image = @image, content = @content WHERE id = @review_id`,
      );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
let deleteReview = async (review_id) => {
  try {
    await pool
      .request()
      .input('review_id', mssql.Int, review_id)
      .query(`DELETE FROM reviews WHERE id = @review_id`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getReviewByProductId,
  getReviewById,
  addReview,
  editReview,
  deleteReview,
};
