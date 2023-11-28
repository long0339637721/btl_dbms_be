const express = require("express");
const orderController = require("../controller/orderController");
const { checkAuthAdminMiddleware, checkAuthMiddleware } = require("../utils/auth");
let router = express.Router();

router.use(checkAuthMiddleware);
//Giao diện khách hàng
router.get("/getOrderByUser", orderController.getOrderByUser);
router.get("/viewDetailOrder/:orderId", orderController.viewDetailOrder);
router.post("/addOrder", orderController.addOrder);
router.get("/getAllShipping", orderController.getAllShipping);
router.get("/getShipping/:id", orderController.getShipping);
router.get("/getVoucherUser", orderController.getVoucherUser);

router.use(checkAuthAdminMiddleware);
router.get("/getOrderAdmin/:userId", orderController.getOrderAdmin);

router.get("/getOrderByStatus/:status", orderController.getOrderByStatus);
router.delete("/deleteOrder/:orderId", orderController.deleteOrder);
router.patch("/setStatus/:orderId/:status", orderController.setStatus);

module.exports = router;
