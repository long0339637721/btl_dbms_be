const userModel = require('../models/userModel');
const validation = require('../utils/validation');
const fs = require('fs');
const sendEmail = require('../utils/mailer');
const { hash, compare } = require('bcryptjs');
const { createJSONToken, parseJwt } = require('../utils/auth');

const signIn = async (req, res) => {
  let user;
  const { email, phone, password } = req.body;
  if (phone && validation.isPhoneNumber(phone)) {
    user = await userModel.getUserByPhone(phone);
  } else if (email && validation.isEmail(email)) {
    user = await userModel.getUserByEmail(email);
  } else {
    return res.status(422).json({
      message: 'Email or phone number is invalid',
      data: null,
    });
  }
  if (!password || !validation.isString(password, 8)) {
    return res.status(422).json({
      message: 'Password is invalid',
      data: null,
    });
  }
  if (user.length === 0 || !(await compare(password, user[0].password))) {
    return res.status(401).json({
      message: 'Email, phone number or password is incorrect',
      data: null,
    });
  }
  await userModel.setLastLogin(user[0].id);
  const token = createJSONToken(user[0]);
  return res.status(200).json({
    user: { id: user[0].id, name: user[0].name, role: user[0].role },
    token,
  });
};

const signUp = async (req, res) => {
  const { phone, email, password, name } = req.body;
  const role = req.body.role || 'customer';
  let user;
  if (
    !validation.isPhoneNumber(phone) ||
    !validation.isEmail(email) ||
    !validation.isString(name) ||
    !validation.isString(password, 8) ||
    !['admin', 'staff', 'customer'].includes(role)
  ) {
    return res.status(422).json({ message: 'Unprocessable Entity' });
  }

  user = await userModel.getUserByPhone(phone);
  if (user.length !== 0) {
    return res.status(409).json({ message: 'Phone number already exists' });
  }
  user = await userModel.getUserByEmail(email);
  if (user.length !== 0) {
    return res.status(409).json({ message: 'Email number already exists' });
  }

  const hashedPw = await hash(password, parseInt(process.env.SALT_ROUND));
  let result = await userModel.createUser(phone, hashedPw, email, name, role);
  if (!result) return res.status(400).json({ message: 'Error create user' });
  return res.status(200).json({ message: 'User has created' });
};

const getAvatar = async (req, res) => {
  let person = req.user;
  let avatar = person.avatar;
  if (!avatar) return res.status(404).json({ avatar: avatar });
  let type = avatar.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/);
  type = type[1];
  const contents = fs.readFileSync('./src/public/image/user/' + avatar, {
    encoding: 'base64',
  });
  const buffedInput = contents.toString('base64');
  return res.status(200).json({
    avatar: 'data:image/' + type + ';base64,' + buffedInput,
  });
};

const setAvatar = async (req, res) => {
  console.log(req.file);
  const authFragments = req.headers.authorization.split(' ');
  let { id } = parseJwt(authFragments[1]);
  if (req.fileValidationError)
    return res.status(400).json({ message: req.fileValidationError });
  else if (!req.file)
    return res.status(400).json({ message: 'No files selected' });
  let file = req.file.filename;
  let result = await userModel.setAvatar(file, id);
  if (result !== 'success') return res.status(400).json({ message: result });
  return res.status(200).json({
    message: result,
  });
};

const getProfile = async (req, res) => {
  let result = req.user;
  return res.status(200).json({
    data: {
      id: result.id,
      name: result.name,
      phone: result.phone,
      email: result.email,
      address: result.address,
    },
  });
};

const editProfile = async (req, res) => {
  const authFragments = req.headers.authorization.split(' ');
  let { id } = parseJwt(authFragments[1]);
  let { name, phone, email, address } = req.body;
  let errors = {};
  let User;
  let profile = (await userModel.getUserById(id))[0];
  if (!validation.isPhoneNumber(phone))
    errors.User = 'Số điện thoại không đúng!';
  else {
    User = await userModel.getUserByPhone(phone);
    if (Object.keys(User).length === 1 && phone !== profile.phone)
      return res.status(404).json({ message: 'Số điện thoại đã tồn tại!' });
  }
  if (!validation.isEmail(email)) errors.email = 'Nhập sai định dạng email!';
  else {
    User = await userModel.getUserByEmail(email);
    if (Object.keys(User).length === 1 && email !== profile.email)
      return res.status(404).json({ message: 'Email đã tồn tại!' });
  }
  if (!validation.isString(name, 8))
    errors.email = 'Tên quá ngắn, vui lòng nhập đầy đủ!';
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  let person = await userModel.editProfile(name, phone, email, address, id);
  if (person !== 'success') return res.status(400).json({ message: person });
  return res.status(200).json({
    message: person,
  });
};

const changePassword = async (req, res) => {
  const user = req.user;
  let { oldPassword, newPassword } = req.body;

  if (!(await compare(oldPassword, user.password)))
    return res.status(422).json({ message: 'Password is incorrect' });
  if (!validation.isString(newPassword, 8))
    return res.status(422).json({ message: 'New password is invalid' });

  const hashedPw = await hash(newPassword, parseInt(process.env.SALT_ROUND));
  let result = await userModel.changePassword(hashedPw, user.id);
  if (!result)
    return res.status(400).json({ message: 'Error change password' });
  return res.status(200).json({
    message: 'Password has changed',
  });
};

const forgetPassword = async (req, res) => {
  let { email, phone } = req.body;

  let users = await userModel.getUserByPhone(phone);
  if (Object.keys(users).length === 0)
    return res.status(404).json({
      message: 'Không tìm thấy người dùng',
    });
  let user = users[0];
  if (email !== user.email)
    return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  let pass = Math.floor(Math.random() * 110000000000);
  const hashedPw = await hash(
    pass.toString(),
    parseInt(process.env.SALT_ROUND),
  );
  sendEmail(
    email,
    'Reset password Easy Electronic',
    'View',
    '<h1>Pass mới của bạn là: ' + pass + '</h1>',
  );
  let rs = userModel.changePassword(hashedPw, user.id);
  return res.status(200).json({
    message: 'success',
  });
};

module.exports = {
  signIn,
  signUp,
  getProfile,
  getAvatar,
  setAvatar,
  editProfile,
  changePassword,
  forgetPassword,
};
