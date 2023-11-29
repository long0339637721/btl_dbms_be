const express = require('express');
const orderController = require('../controller/orderController');
const {
  checkAuthStaffMiddleware,
  checkAuthMiddleware,
} = require('../utils/auth');
let router = express.Router();

// User create order
router.use(checkAuthMiddleware);
router.get('/getOrderByUser', orderController.getOrderByUser);
router.get('/viewDetailOrder/:orderId', orderController.viewDetailOrder);
router.post('/addOrder', orderController.addOrder);
router.get('/getAllShipping', orderController.getAllShipping);
router.get('/getShipping/:id', orderController.getShipping);
router.get('/getVoucherUser', orderController.getVoucherUser);

// Staff manage order
router.use(checkAuthStaffMiddleware);
router.get('/getOrderAdmin/:userId', orderController.getOrderAdmin);
router.get('/getOrderByStatus/:status', orderController.getOrderByStatus);
router.delete('/deleteOrder/:orderId', orderController.deleteOrder);
router.patch('/setStatus/:orderId/:status', orderController.setStatus);

module.exports = router;
