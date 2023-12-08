const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const axios = require('axios');
const {
  createSignatureFromObj,
  createSignatureOfPaymentRequest,
} = require('../utils/create-signature');
const validation = require('../utils/validation');

async function payos(req) {
  const { description, returnUrl, cancelUrl, price, detail } = req;

  const body = {
    orderCode: Number(String(new Date().getTime()).slice(-6)),
    amount: price * 1,
    description: description,
    items: detail.map((ele) => ({
      name: ele.name,
      quantity: ele.count,
      price: ele.price,
    })),
    cancelUrl,
    returnUrl,
  };

  const bodyToSignature = createSignatureOfPaymentRequest(
    body,
    process.env.PAYOS_CHECKSUM_KEY,
  );
  body['signature'] = bodyToSignature;

  const config = {
    headers: {
      'x-client-id': process.env.PAYOS_CLIENT_ID,
      'x-api-key': process.env.PAYOS_API_KEY,
    },
  };

  const url = process.env.PAYOS_CREATE_PAYMENT_LINK_URL;
  try {
    const paymentLinkRes = await axios
      .post(url, body, config)
      .then((resp) => resp.data);
    if (paymentLinkRes?.code == '00') {
      const paymentLinkResSignature = createSignatureFromObj(
        paymentLinkRes.data,
        process.env.PAYOS_CHECKSUM_KEY,
      );
      if (paymentLinkResSignature !== paymentLinkRes.signature) {
        return {
          error: -1,
          message: 'fail',
          data: null,
        };
      }
      // const orderData = {
      //   orderCode: body.orderCode,
      //   items: JSON.stringify(body.items),
      //   amount: body.amount,
      //   description,
      //   paymentLinkId: paymentLinkRes.data.paymentLinkId,
      // };

      // await orderModel.create(orderData);
      // return {
      //   orderCode: body.orderCode,
      //   error: 0,
      //   message: paymentLinkRes.desc,
      //   data: {
      //     bin: paymentLinkRes.data.bin,
      //     checkoutUrl: paymentLinkRes.data.checkoutUrl,
      //     accountNumber: paymentLinkRes.data.accountNumber,
      //     accountName: paymentLinkRes.data.accountName,
      //     amount: paymentLinkRes.data.amount,
      //     description: paymentLinkRes.data.description,
      //     orderCode: paymentLinkRes.data.orderCode,
      //     qrCode: paymentLinkRes.data.qrCode,
      //   },
      // };
    }

    return {
      error: -1,
      message: paymentLinkRes.desc,
      data: null,
    };
  } catch (error) {
    console.log(error);
    return {
      error: -1,
      message: 'fail',
      data: null,
    };
  }
}

let getAllShipping = async (req, res) => {
  let rs = await orderModel.getAllShipping();
  return res.status(200).json({ data: rs });
};

let getShipping = async (req, res) => {
  const id = req.params.id;
  if (!validation.isNumber(id))
    return res.status(400).json({ message: 'Bad Request' });
  let rs = await orderModel.getShipping(id);
  return res.status(200).json({ data: rs });
};

let getVoucherUser = async (req, res) => {
  let rs = await orderModel.getVoucherUser(req.user.id);
  return res.status(200).json({ data: rs });
};

let getOrderByUser = async (req, res) => {
  const user = req.user;
  const order = await orderModel.getOrderByUser(user.id);
  for (let i = 0; i < order.length; i++) {
    const orderDetail = await orderModel.viewDetailOrder(order[i].id);
    order[i].order_detail = orderDetail;
  }
  return res.status(200).json({ data: order });
};

let viewDetailOrder = async (req, res) => {
  const { orderId } = req.params;
  if (!validation.isNumber(orderId))
    return res.status(400).json({ message: 'Bad Request' });
  const order = await orderModel.getOrderInfo(orderId);
  if (order.length === 0)
    return res.status(404).json({ message: 'Order not found' });
  const orderDetail = await orderModel.viewDetailOrder(orderId);
  order[0].order_detail = orderDetail;
  return res.status(200).json({ data: order[0] });
};

let addOrder = async (req, res) => {
  const user = req.user;
  const voucher_id = req.body.voucher_id ?? null;
  const payment_id = req.body.payment_id;
  const shipping_id = req.body.shipping_id;
  const notice = req.body.notice ?? '';
  const order_detail = req.body.order_detail;
  if (
    !validation.isNumberOrNull(voucher_id) ||
    !validation.isNumber(payment_id) ||
    !validation.isNumber(shipping_id) ||
    !validation.isString(notice, 0) ||
    !validation.hasRequiredProperties(order_detail)
  ) {
    return res.status(422).json({ message: 'Invalid data' });
  }
  let listProduct = order_detail.map(async (element) => {
    const product = await productModel.getProductById(element.product_id);
    if (product.length === 0) {
      res.status(404).json({ message: 'Product not found' });
    }
    return product[0];
  });
  listProduct = await Promise.all(listProduct);
  const voucherInfo = voucher_id
    ? await orderModel.getVoucherValue(voucher_id)
    : [{ sale_percent: 0 }];
  if (voucherInfo.length === 0) {
    return res.status(404).json({ message: 'Voucher not found' });
  }
  const sum_price = order_detail.reduce((sum, element) => {
    const product = listProduct.find(
      (product) => product.id === element.product_id,
    );
    return sum + product.price * element.count;
  }, 0);
  if (sum_price < voucherInfo[0].min_price_apply) {
    return res.status(422).json({ message: 'Voucher is invalid' });
  }
  let voucherReduce = sum_price * (voucherInfo[0].sale_percent / 100);
  voucherReduce =
    voucherReduce > voucherInfo[0].max_price
      ? voucherInfo[0].max_price
      : voucherReduce;
  const pay_price = sum_price - voucherReduce;
  const rs = await orderModel.addOrder(
    user.id,
    voucher_id,
    payment_id,
    shipping_id,
    notice,
    order_detail,
  );
  console.log(rs);

  // const payosReq = {
  //   description: req.body.notice || '',
  //   returnUrl: req.body.returnUrl ?? '',
  //   cancelUrl: req.body.cancelUrl ?? '',
  //   price: pay_price,
  //   detail: req.body.order_detail,
  // };
  // const data = await payos(payosReq);

  if (rs)
    return res.status(200).json({
      message: 'Add order successful',
      data: {
        pay_price,
      },
    });
  return res.status(400).json({ message: 'Add order failure' });
};

let getOrderAdmin = async (req, res) => {
  const { userId } = req.params;
  const orderStatus = req.query.status ?? 'Confirm';
  if (!validation.isNumber(userId))
    return res.status(400).json({ message: 'Bad Request' });
  const order = await orderModel.getOrderByUser(userId, orderStatus);
  for (let i = 0; i < order.length; i++) {
    const orderDetail = await orderModel.viewDetailOrder(order[i].id);
    order[i].order_detail = orderDetail;
  }
  return res.status(200).json({ data: order });
};

let getOrderByStatus = async (req, res) => {
  const { status } = req.params;
  if (
    !(status === 'Confirm' || status === 'Delivery' || status === 'Sucessfully')
  )
    return res.status(422).json({ message: 'Status is invalid' });
  const rs = await orderModel.getOrderByStatus(status);
  return res.status(200).json({ data: rs });
};

let setStatus = async (req, res) => {
  const { orderId, status } = req.params;
  if (!validation.isNumber(orderId))
    return res.status(400).json({ message: 'Bad Request' });
  if (
    !(status === 'Confirm' || status === 'Delivery' || status === 'Sucessfully')
  )
    return res.status(422).json({ message: 'Status is invalid' });
  const check = await orderModel.viewDetailOrder(orderId);
  if (check.length === 0)
    return res.status(404).json({ message: 'Order not found' });
  const rs = await orderModel.setStatus(orderId, status);
  if (!rs) return res.status(400).json({ message: 'Update Status Failed' });
  return res.status(200).json({ message: 'Update Status Successful' });
};

let deleteOrder = async (req, res) => {
  if (!validation.isNumber(req.params.orderId))
    return res.status(400).json({ message: 'Bad Request' });
  const check = await orderModel.getOrderInfo(req.params.orderId);
  if (check.length === 0)
    return res.status(404).json({ message: 'Order not found' });
  const orderData = await orderModel.deleteOrder(req.params.orderId);
  if (!orderData)
    return res.status(400).json({ message: 'Delete Order Failed' });
  return res.status(200).json({ message: 'Delete Order Successful' });
};

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
