const express = require('express');
const path = require('path');
const reviewController = require('../controller/reviewController');
const multer = require('multer');
const appRoot = require('app-root-path');
const { checkAuthMiddleware, parseJwt } = require('../utils/auth');

let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + '/src/public/image/review');
  },
  filename: function (req, file, cb) {
    const authFragments = req.headers.authorization.split(' ');
    let { id } = parseJwt(authFragments[1]);
    cb(
      null,
      req.product_id +
        '-' +
        id +
        '-' +
        Date.now() +
        path.extname(file.originalname),
    );
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
  }
  cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });

// public
router.get('/:product_id', reviewController.getReviewByProductId);

// manager
router.use(checkAuthMiddleware);
router.post('', upload.single('image'), reviewController.addReview); // upload image
router.patch('', upload.single('image'), reviewController.editReview); // upload image
router.delete('/:review_id', reviewController.deleteReview);

module.exports = router;
