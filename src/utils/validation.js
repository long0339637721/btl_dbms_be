function isString(value, minLength = 1) {
  return value && value.trim().length >= minLength;
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

module.exports = {
  isString,
  isDateString,
  isEmail,
  isPhoneNumber,
  isNumber,
};
