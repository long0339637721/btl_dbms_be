const sortObjDataByKey = require('./sort-obj-by-key');
const convertObjToQueryStr = require('./convert-obj-to-query-str');
const crypto = require('crypto');

const createSignatureFromObj = function(data, key) {
    const sortedDataByKey = sortObjDataByKey(data);
    const dataQueryStr = convertObjToQueryStr(sortedDataByKey);
    const dataToSignature = crypto.createHmac('sha256', key).update(dataQueryStr).digest('hex');
    return dataToSignature;
}

const createSignatureOfPaymentRequest = function(data, key) {
    const { amount, cancelUrl, description, orderCode, returnUrl } = data;
    const dataStr = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
    console.log(dataStr);
    const dataToSignature = crypto.createHmac('sha256', key).update(dataStr).digest('hex');
    return dataToSignature;
}

module.exports = { createSignatureFromObj, createSignatureOfPaymentRequest};