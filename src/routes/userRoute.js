const express = require('express');
const path = require('path');
const userController = require('../controller/userController');
const multer = require('multer');
const appRoot = require('app-root-path');
const { checkAuthMiddleware, parseJwt } = require('../utils/auth');

let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + '/src/public/image/user');
  },
  filename: function (req, file, cb) {
    const authFragments = req.headers.authorization.split(' ');
    let { id } = parseJwt(authFragments[1]);
    cb(null, id + path.extname(file.originalname));
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

// Auth
router.post('/signIn', userController.signIn);
router.post('/signUp', userController.signUp);
router.post('/forgetPassword', userController.forgetPassword);

// Manager profile
router.use(checkAuthMiddleware);
router.get('/getAvatar', userController.getAvatar);
router.patch('/setAvatar', upload.single('image'), userController.setAvatar);
router.get('/getProfile', userController.getProfile);
router.patch('/editProfile', userController.editProfile);
router.patch('/changePassword', userController.changePassword);

module.exports = router;
