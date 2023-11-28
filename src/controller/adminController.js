const adminModel = require('../models/adminModel');
const userModel = require('../models/userModel');
const bcrypt = require("bcryptjs");

const getAllUser = async (req, res) => {
  let User = await adminModel.getAllUser(0);
  return res.status(200).json(User);
};

const getUser = async (req, res) => {
  let User = await adminModel.getUser(req.params.id);
  return res.status(200).json(User);
};

const getUserByPhone = async (req, res) => {
  let User = await userModel.getUserByPhone(req.params.phone);
  return res.status(200).json(User);
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Invalid" });
  await adminModel.deleteUser(id);
  return res.status(200).json({ message: "Delete user successfully!" });
};

const getAllStaff = async (req, res) => {
  let User = await adminModel.getAllUser(1);
  return res.status(200).json(User);
};

const addStaff = async (req, res) => {
  const { name, email, phone, password, address } = req.body;
  const hashedPw = await bcrypt.hash(password, 12);
  let rs = await adminModel.addStaff(name, email, phone, hashedPw, address);
  if (rs === true) return res.status(200).json({ message: "Add Staff successfully!" });
  return res.status(400).json({ message: "Số điện thoại hoặc Email bị trùng hoặc không đúng!" });
};

module.exports = {
  getAllUser,
  deleteUser,
  addStaff,
  getAllStaff,
  getUser,
  getUserByPhone,
};