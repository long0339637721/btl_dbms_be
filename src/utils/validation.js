function isString(value, minLength = 1) {
  return typeof value === 'string' && value.trim().length >= minLength;
}
function isDateString(value) {
  const date = new Date(value);
  return value && date !== 'Invalid Date';
}
function isNumber(value) {
  return /^-?\d+$/.test(value);
}
function isPhoneNumber(value) {
  let phoneRegex = /^\d{10}$/;
  return phoneRegex.test(value);
}
function isEmail(value) {
  let emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  let valid = emailRegex.test(value);
  return value && valid;
}
function checkArrays(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (typeof arr1[i] !== 'number' || typeof arr2[i] !== 'string') {
      return false;
    }
  }
  return true;
}

module.exports = {
  isString,
  isDateString,
  isEmail,
  isPhoneNumber,
  isNumber,
  checkArrays,
};
