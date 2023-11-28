const reviewModel = require('../models/reviewModel');
const fs = require("fs");
const { createJSONToken, parseJwt } = require("../utils/auth");

const getReviewByProductId = async (req, res) => {
    let product_id = req.params.product_id;
    let review = await reviewModel.getReviewByProductId(product_id);
    review.forEach(element => {
        if (element.avatar !== null || element.avatar !== "") {
          let type = element.avatar.match(
            /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/
          );
          type = type[1];
          const contents = fs.readFileSync(
            "./src/public/image/user/" + element.avatar,
            {
              encoding: "base64",
            }
          );
          const buffedInput = contents.toString("base64");
          element.avatar = "data:image/" + type + ";base64," + buffedInput;
        }
    });
    
    return res.status(200).json(review);
};

const addReview = async (req, res) => {
    let {product_id, rating, content} = req.body;
    const authFragments = req.headers.authorization.split(" ");
    let user_id = parseJwt(authFragments[1]).id;
    if (req.fileValidationError)
      return res.status(400).json({ message: req.fileValidationError });
    let image = req.file.filename;
    let result = await reviewModel.addReview(product_id, user_id, rating, image, content);
    if (result !== true) return res.status(400).json({ message: 'Add Failed!' });
    return res.status(200).json({message: 'Add Success'});
};

const editReview = async (req, res) => {
  let {review_id, rating, content } = req.body;
  const authFragments = req.headers.authorization.split(" ");
  let user_id = parseJwt(authFragments[1]).id;
  let review = await reviewModel.getReviewById(review_id);
  if (review.length && review[0].user_id !== user_id) 
  return res.status(400).json({message: "You cannot access this"});
  if (req.fileValidationError)
    return res.status(400).json({ message: req.fileValidationError });
  let image = req.file.filename;
  let result = await reviewModel.editReview(review_id, rating, image, content);
  if (result !== true) return res.status(400).json({ message: "Edit Failed!" });
  return res.status(200).json({ message: "Edit Success" });
};

const deleteReview = async (req, res) => {
    let {review_id } = req.params;
    const authFragments = req.headers.authorization.split(" ");
    let user_id = parseJwt(authFragments[1]).id;
    let review = await reviewModel.getReviewById(review_id);
    if (review.length && review[0].user_id !== user_id) 
    return res.status(400).json({message: "You cannot access this"});
    let result = await reviewModel.deleteReview(review_id);
    if (result !== true) return res.status(400).json({ message: "Delete Failed!" });
    return res.status(200).json({ message: "Delete Success" });
};  

module.exports = {
  getReviewByProductId,
  addReview,
  editReview,
  deleteReview
};