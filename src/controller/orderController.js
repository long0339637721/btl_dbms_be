const orderModel = require('../models/orderModel');
const { parseJwt } = require("../utils/auth");
const axios = require("axios");
const {
  createSignatureFromObj,
  createSignatureOfPaymentRequest,
} = require("../utils/create-signature");

async function payos(req) {
  const { description, returnUrl, cancelUrl, price, detail } = req.body;

  const body = {
    orderCode: Number(String(new Date().getTime()).slice(-6)),
    amount: price * 1,
    description: description,
    items: detail.map((ele) => ({
      name: ele.name,
      quantity: ele.count,
      price: ele.price
    })),
    cancelUrl,
    returnUrl,
  };

  const bodyToSignature = createSignatureOfPaymentRequest(
    body,
    process.env.PAYOS_CHECKSUM_KEY
  );
  body["signature"] = bodyToSignature;

  const config = {
    headers: {
      "x-client-id": process.env.PAYOS_CLIENT_ID,
      "x-api-key": process.env.PAYOS_API_KEY,
    },
  };

  const url = process.env.PAYOS_CREATE_PAYMENT_LINK_URL;
  try {
    const paymentLinkRes = await axios
      .post(url, body, config)
      .then((resp) => resp.data);
    if (paymentLinkRes?.code == "00") {
      const paymentLinkResSignature = createSignatureFromObj(
        paymentLinkRes.data,
        process.env.PAYOS_CHECKSUM_KEY
      );
      if (paymentLinkResSignature !== paymentLinkRes.signature) {
        return ({
          error: -1,
          message: "fail",
          data: null,
        });
      }
      const orderData = {
        orderCode: body.orderCode,
        items: JSON.stringify(body.items),
        amount: body.amount,
        description,
        paymentLinkId: paymentLinkRes.data.paymentLinkId,
      };

      await OrderModel.create(orderData);
      return ({
        orderCode: body.orderCode,
        error: 0,
        message: paymentLinkRes.desc,
        data: {
          bin: paymentLinkRes.data.bin,
          checkoutUrl: paymentLinkRes.data.checkoutUrl,
          accountNumber: paymentLinkRes.data.accountNumber,
          accountName: paymentLinkRes.data.accountName,
          amount: paymentLinkRes.data.amount,
          description: paymentLinkRes.data.description,
          orderCode: paymentLinkRes.data.orderCode,
          qrCode: paymentLinkRes.data.qrCode,
        },
      });
    }

    return ({
      error: -1,
      message: paymentLinkRes.desc,
      data: null,
    });
  } catch (error) {
    console.log(error);
    return ({
      error: -1,
      message: "fail",
      data: null,
    });
  }
};

let getAllShipping = async (req, res) => {
  let rs = await orderModel.getAllShipping();
  return res.status(200).json(rs);
};
let getShipping = async (req, res) => {
  let rs = await orderModel.getShipping(req.params.id);
  return res.status(200).json(rs);
};
let getVoucherUser = async (req, res) => {
  const authFragments = req.headers.authorization.split(" ");
  let { id } = parseJwt(authFragments[1]);
  let rs = await orderModel.getVoucherUser(id);
  return res.status(200).json(rs);
};
let getOrderByUser = async (req, res) =>{
  const authFragments = req.headers.authorization.split(" ");
  let { id } = parseJwt(authFragments[1]);
  const order = await orderModel.getOrderByUser(id);
  return res.status(200).json(order);
};

let viewDetailOrder = async (req, res) => {
  let { orderId } = req.params;
  const order = await orderModel.viewDetailOrder(orderId);
  return res.status(200).json(order);
};

let addOrder = async (req, res) =>{
  // console.log(req.body)
  const authFragments = req.headers.authorization.split(" ");
  let { id } = parseJwt(authFragments[1]);
  let {voucher_id, payment_id, shipping_id, notice, sum_price, order_detail} = req.body;
  const payosReq = {
    description: req.body.notice || "",
    returnUrl: req.body.returnUrl,
    cancelUrl: req.body.cancelUrl,
    price: req.body.price,
    detail: req.body.order_detail
  }
  const data = payos(payosReq)
  const rs = await orderModel.addOrder(data.orderId, id, voucher_id, payment_id, shipping_id, notice, sum_price, order_detail);
  if (rs) return res.status(200).json(data);
  return res.status(400).json("Failure");
};

let getOrderAdmin = async (req, res) => {
  let { userId } = req.params;
  const order = await orderModel.getOrderByUser(userId);
  return res.status(200).json(order);
};
let getOrderByStatus = async (req, res) =>{
  const {status} = req.params;
  if (!(status === 'Confirm' || status === 'Delivery' || status === 'Sucessfully'))
    return res.status(400).json("Invalid status");
  const rs = await orderModel.getOrderByStatus(status);
  return res.status(200).json(rs);
};

let setStatus = async (req, res) =>{
  const {orderId, status} = req.params;
  if (!(status === 'Confirm' || status === 'Delivery' || status === 'Sucessfully'))
    return res.status(400).json("Invalid status");
  const rs = await orderModel.setStatus(orderId, status);
  if (!rs) return res.status(400).json("Invalid Update Status");
  return res.status(200).json("Update Status Successful");
};

let deleteOrder = async (req, res) => {
  const rs = await orderModel.deleteOrder(req.params.orderId);
  if (!rs) return res.status(400).json("Delete Order Failed");
  return res.status(200).json("Delete Order Successful");};


module.exports = {
  getOrderByUser,
  addOrder,
  deleteOrder,
  getOrderByStatus,
  setStatus,
  viewDetailOrder,
  getAllShipping,
  getShipping,
  getVoucherUser,
  getOrderAdmin,
};