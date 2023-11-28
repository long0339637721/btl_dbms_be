const pool = require("../configs/connectDB");

let getReviewByProductId = async (product_id) => {
    let [review] = await pool.execute(`SELECT review.id as review_id, product_id, rating, image, content, dateReview, user.name, user.avatar 
            FROM review INNER JOIN user ON user_id = user.id WHERE product_id =?`, [product_id]);
    return review;
};
let getReviewById = async (id) => {
  let [review] = await pool.execute(
    `SELECT * from review where id =?`,
    [id]
  );
  return review;
};
let addReview = async (product_id, user_id, rating, image, content) => {
    try {
        await pool.execute(`INSERT INTO review VALUES (NULL,?,?,?,?,?,CURRENT_TIME)`, [product_id, user_id, rating, image, content])
        return true;
    } catch (error) {
        return error;
    }
};
let editReview = async (review_id, rating, image, content) => {
  try {
    await pool.execute(
      `UPDATE review SET rating = ?, image = ?, content = ? WHERE id = ?`,
      [rating, image, content, review_id]
    );
    return true; 
  } catch (error) {
    console.log(error);
    return error;
  }
};
let deleteReview = async (review_id) => {
  try {
    await pool.execute(
      `DELETE FROM review WHERE id = ?`,
      [review_id]
    );
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getReviewByProductId,
  getReviewById,
  addReview,
  editReview,
  deleteReview,
};
