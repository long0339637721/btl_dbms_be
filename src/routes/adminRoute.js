const express = require('express');
const path = require('path');
const adminController = require('../controller/adminController');
const multer = require('multer');
const appRoot = require('app-root-path');
const {
  checkAuthAdminMiddleware,
  checkAuthStaffMiddleware,
  parseJwt,
} = require('../utils/auth');

let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + '/src/public/image/admin');
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

// manager user
router.use(checkAuthStaffMiddleware);
router.get('/getAllCustomer', adminController.getAllCustomer);
router.get('/getUser/:id', adminController.getUserById);
router.get('/getUserByPhone/:phone', adminController.getUserByPhone);
router.delete('/deleteUser/:id', adminController.deleteUser);

//manager staff
router.use(checkAuthAdminMiddleware);
router.get('/getAllStaff', adminController.getAllStaff);
router.post('/addStaff', upload.any(), adminController.addStaff); // upload image

module.exports = router;
