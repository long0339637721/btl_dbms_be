const adminModel = require('../models/adminModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const validation = require('../utils/validation');
require('dotenv').config();

const getAllCustomer = async (req, res) => {
  let customers = await adminModel.getAllUserByRole('customer');
  return res.status(200).json({ data: customers });
};

const getAllCustomerByOrder = async (req, res) => {
  const minOrderValue = req.query.minOrderValue || 0;
  const startTime = req.query.startTime || '2000-01-01';
  let endTime = req.query.endTime || new Date().toISOString().split('T')[0];
  endTime = endTime + 'T23:59:59.999Z';
  console.log(minOrderValue, startTime, endTime);
  let rs = await adminModel.getAllCustomerByOrder(
    minOrderValue,
    startTime,
    endTime,
  );
  return res.status(200).json({ data: rs });
};

const getUserById = async (req, res) => {
  let user = await adminModel.getUserById(req.params.id);
  return res.status(200).json({ data: user[0] });
};

const getUserByPhone = async (req, res) => {
  let user = await userModel.getUserByPhone(req.params.phone);
  return res.status(200).json({ data: user[0] });
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!validation.isNumber(id))
    return res.status(400).json({ message: 'Bad Request' });
  const user = await adminModel.getUserById(id);
  if (user.length === 0)
    return res.status(404).json({ message: 'User not found', data: null });
  await adminModel.deleteUser(id);
  return res
    .status(200)
    .json({ message: 'Delete user successfully', data: null });
};

const getAllStaff = async (req, res) => {
  let staffs = await adminModel.getAllUserByRole('staff');
  return res.status(200).json({ data: staffs });
};

const addStaff = async (req, res) => {
  const { name, email, phone, password, address } = req.body;
  if (
    !validation.isString(name) ||
    !validation.isEmail(email) ||
    !validation.isPhoneNumber(phone) ||
    !validation.isString(password, 8) ||
    !validation.isString(address)
  ) {
    return res
      .status(422)
      .json({ message: 'Unprocessable Entity', data: null });
  }
  const hashedPw = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUND),
  );
  let response = await adminModel.addStaff(
    name,
    email,
    phone,
    hashedPw,
    address,
  );
  if (response === true)
    return res
      .status(200)
      .json({ message: 'Add Staff successfully', data: null });

  return res.status(409).json({
    message: 'Conflict Resource: duplicate email or phone number',
    data: null,
  });
};

module.exports = {
  getAllCustomer,
  getAllCustomerByOrder,
  getAllStaff,
  getUserById,
  getUserByPhone,
  addStaff,
  deleteUser,
};
