const reviewModel = require('../models/reviewModel');
const fs = require('fs');
const { createJSONToken, parseJwt } = require('../utils/auth');

const getReviewByProductId = async (req, res) => {
  const product_id = req.params.product_id;
  let reviews = await reviewModel.getReviewByProductId(product_id);
  reviews.forEach((review) => {
    if (review.avatar !== null && review.avatar !== '') {
      let type = review.avatar.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/);
      type = type[1];
      const contents = fs.readFileSync(
        './src/public/image/user/' + review.avatar,
        {
          encoding: 'base64',
        },
      );
      const buffedInput = contents.toString('base64');
      review.avatar = 'data:image/' + type + ';base64,' + buffedInput;
    }
  });

  return res.status(200).json({ data: reviews });
};

const addReview = async (req, res) => {
  const { product_id, rating, content } = req.body;
  const user = req.user;
  if (req.fileValidationError)
    return res.status(400).json({ message: req.fileValidationError });
  const image = req.file ? req.file.filename : '';
  const result = await reviewModel.addReview(
    product_id,
    user.id,
    rating,
    image,
    content,
  );
  if (!result) return res.status(400).json({ message: 'Add Failed' });
  return res.status(200).json({ message: 'Create review success' });
};

const editReview = async (req, res) => {
  const { review_id, rating, content } = req.body;
  const user = req.user;
  const review = await reviewModel.getReviewById(review_id);
  if (!review.length) {
    return res.status(404).json({ message: 'Review not found' });
  }
  if (review.length && review[0].user_id !== user.id)
    return res.status(403).json({ message: 'You cannot access this' });
  if (req.fileValidationError)
    return res.status(400).json({ message: req.fileValidationError });
  const image = req.file ? req.file.filename : '';
  const result = await reviewModel.editReview(
    review_id,
    rating,
    image,
    content,
  );
  if (!result) return res.status(400).json({ message: 'Edit Failed!' });
  return res.status(200).json({ message: 'Edit review success' });
};

const deleteReview = async (req, res) => {
  const { review_id } = req.params;
  const user = req.user;
  const review = await reviewModel.getReviewById(review_id);
  if (!review.length) {
    return res.status(404).json({ message: 'Review not found' });
  }
  if (review.length && review[0].user_id !== user.id)
    return res.status(400).json({ message: 'You cannot access this' });
  const result = await reviewModel.deleteReview(review_id);
  if (!result) return res.status(400).json({ message: 'Delete review failed' });
  return res.status(200).json({ message: 'Delete review success' });
};

module.exports = {
  getReviewByProductId,
  addReview,
  editReview,
  deleteReview,
};
