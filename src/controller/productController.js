const productModel = require('../models/productModel');
const validation = require('../utils/validation');
const fs = require('fs');

const getAllProduct = async (req, res) => {
  const rs = await productModel.getAllProduct(req.params.code);
  return res.status(200).json({ data: rs });
};

const getProductByCode = async (req, res) => {
  const rs = await productModel.getProductByCode(req.params.code);
  if (rs.length === 0)
    return res.status(404).json({ message: 'Not Found!', data: null });
  return res.status(200).json({ data: rs[0] });
};

const getProductById = async (req, res) => {
  if (!validation.isNumber(req.params.id)) {
    return res.status(422).json({ message: 'Id is not valid!', data: null });
  }
  const recordset = await productModel.getProductById(req.params.id);
  if (recordset.length === 0)
    return res.status(404).json({ message: 'Not Found!', data: null });
  return res.status(200).json({ data: recordset[0] });
};

const getProductByCategory = async (req, res) => {
  const category = req.params.category;
  const rs = await productModel.getProductByCategory(category);
  if (rs.length === 0)
    return res.status(404).json({ message: 'Not Found!', data: null });
  return res.status(200).json({ data: rs });
};

const getProductByDev = async (req, res) => {
  const dev = req.params.dev;
  const rs = await productModel.getProductByDev(dev);
  if (rs.length === 0)
    return res.status(404).json({ message: 'Not Found!', data: null });
  return res.status(200).json({ data: rs });
};

const getProductByDevAndCate = async (req, res) => {
  const dev = req.params.dev;
  const cate = req.params.cate;
  const rs = await productModel.getProductByDevAndCate(cate, dev);
  if (rs.length === 0)
    return res.status(404).json({ message: 'Not Found!', data: null });
  return res.status(200).json({ data: rs });
};

const searchItem = async (req, res) => {
  const keyWord = req.query.keyWord;
  let rs;
  if (
    ['laptop', 'tablet', 'cellphone', 'watch'].includes(keyWord.toLowerCase())
  ) {
    rs = await productModel.getProductByCategory('laptop');
  } else rs = await productModel.searchItem(keyWord);
  return res.status(200).json({ data: rs });
};

const detailProduct = async (req, res) => {
  const id = req.params.id;
  const pro = await productModel.getProductById(id);
  if (pro.length == 0)
    return res.status(404).json({ message: 'Not Found!', data: null });
  const { product, detail } = await productModel.detailProduct(id);
  if (product.html)
    product.html = fs.readFileSync('./src/public/html/' + product.html, {
      encoding: 'utf8',
    });
  return res.status(200).json({ data: product, detail });
};

const getAllCategory = async (req, res) => {
  const rs = await productModel.getAllCategory();
  return res.status(200).json({ data: rs });
};

const addCategory = async (req, res) => {
  const { title } = req.body;
  const rs = await productModel.addCategory(title);
  if (!rs) return res.status(400).json({ message: rs });
  return res.status(201).json({ message: 'Add category successful' });
};

const editCategory = async (req, res) => {
  const { id } = req.params;
  if (!validation.isNumber(id)) {
    return res.status(400).json({ message: 'Id is invalid', data: null });
  }
  const check = await productModel.getCategoryById(id);
  if (check.length === 0) {
    return res.status(404).json({ message: 'Not Found', data: null });
  }
  const { title } = req.body;
  const rs = await productModel.editCategory(id, title);
  if (!rs) return res.status(400).json({ message: rs });
  return res.status(200).json({ message: 'Edit category successful' });
};

const getAllAttribute = async (req, res) => {
  const rs = await productModel.getAllAttribute();
  return res.status(200).json({ data: rs });
};

const addAttribute = async (req, res) => {
  const { name, group } = req.body;
  if (!validation.isString(name) || !validation.isString(group)) {
    return res
      .status(422)
      .json({ message: 'Name or group is invalid', data: null });
  }
  const rs = await productModel.addAttribute(name, group);
  if (!rs) return res.status(400).json({ message: rs });
  return res.status(201).json({ data: 'Add attribute successful' });
};

const editAttribute = async (req, res) => {
  const { name, group } = req.body;
  if (!validation.isNumber(req.params.id)) {
    return res.status(400).json({ message: 'Id is invalid', data: null });
  }
  const check = await productModel.getAttributeById(req.params.id);
  if (check.length === 0) {
    return res.status(404).json({ message: 'Not Found', data: null });
  }
  if (!validation.isString(name) || !validation.isString(group)) {
    return res
      .status(422)
      .json({ message: 'Name or group is invalid', data: null });
  }
  const rs = await productModel.editAttribute(name, group, req.params.id);
  if (!rs) return res.status(400).json({ message: rs });
  return res.status(200).json({ data: 'Edit attribute successful' });
};

const deleteAttribute = async (req, res) => {
  if (!validation.isNumber(req.params.id)) {
    return res.status(400).json({ message: 'Id is invalid', data: null });
  }
  const check = await productModel.getAttributeById(req.params.id);
  if (check.length === 0) {
    return res.status(404).json({ message: 'Not Found', data: null });
  }
  const rs = await productModel.deleteAttribute(req.params.id);
  if (!rs) return res.status(400).json({ message: rs });
  return res.status(200).json({ data: 'Delete attribute successful' });
};

const addProduct = async (req, res) => {
  const {
    code,
    name,
    color,
    sale_percent,
    price,
    manufacturer,
    image,
    category_id,
  } = req.body;
  const key = req.body.key ? req.body.key : [];
  const value = req.body.value ? req.body.value : [];
  if (
    !validation.isString(code) ||
    !validation.isString(name) ||
    !validation.isString(color) ||
    !validation.isNumber(sale_percent) ||
    !validation.isNumber(price) ||
    !validation.isString(manufacturer, 0) ||
    !validation.isString(image, 0) ||
    !validation.isNumber(category_id) ||
    !validation.checkArrays(key, value)
  ) {
    return res.status(422).json({ message: 'Data is invalid!', data: null });
  }
  if (req.fileValidationError)
    return res.status(400).json({ message: req.fileValidationError });
  const check = await productModel.getProductByCode(code);
  if (check.length === 1)
    return res.status(409).json({ message: 'Code is exist!', data: null });
  if ((await productModel.getCategoryById(category_id)).length === 0) {
    return res
      .status(404)
      .json({ message: 'Category is not exist', data: null });
  }
  const rs = await productModel.addProduct(
    code,
    name,
    category_id,
    color,
    sale_percent,
    price,
    manufacturer,
    req.file ? req.file.filename ?? '' : '',
    image,
    key,
    value,
  );
  if (!rs) return res.status(400).json({ message: rs, data: null });
  return res
    .status(201)
    .json({ message: 'Add product successful', data: null });
};

const editProduct = async (req, res) => {
  const id = req.params.id;
  const product = await productModel.getProductById(id);
  if (product.length === 0)
    return res.status(404).json({ message: 'Not Found', data: null });

  const code = req.body.code ? req.body.code : product[0].code;
  const name = req.body.name ? req.body.name : product[0].name;
  const category_id = req.body.category_id
    ? req.body.category_id
    : product[0].category_id;
  const color = req.body.color ? req.body.color : product[0].color;
  const sale_percent = req.body.sale_percent
    ? req.body.sale_percent
    : product[0].sale_percent;
  const price = req.body.price ? req.body.price : product[0].price;
  const manufacturer = req.body.manufacturer
    ? req.body.manufacturer
    : product[0].manufacturer;
  const image = req.body.image ? req.body.image : product[0].image;
  const key = req.body.key ? req.body.key : [];
  const value = req.body.value ? req.body.value : [];

  if (req.fileValidationError)
    return res
      .status(400)
      .json({ message: req.fileValidationError, data: null });
  const rs = await productModel.editProduct(
    code,
    name,
    category_id,
    color,
    sale_percent,
    price,
    manufacturer,
    req.file ? req.file.filename ?? '' : '',
    image,
    key,
    value,
    id,
  );
  if (!rs) return res.status(400).json({ message: rs, data: null });
  return res
    .status(200)
    .json({ message: 'Edit product successful', data: null });
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  if (!validation.isNumber(id)) {
    return res.status(400).json({ message: 'Id is invalid', data: null });
  }
  const product = await productModel.getProductById(id);
  if (product.length === 0)
    return res.status(404).json({ message: 'Not Found', data: null });
  const rs = await productModel.deleteProduct(id);
  if (!rs) return res.status(400).json({ message: rs });
  return res.status(200).json({ message: 'Delete product successful' });
};

module.exports = {
  getAllProduct,
  getProductByCode,
  getProductById,
  getProductByCategory,
  getProductByDev,
  getProductByDevAndCate,
  searchItem,
  detailProduct,

  getAllCategory,
  addCategory,
  editCategory,

  getAllAttribute,
  addAttribute,
  editAttribute,
  deleteAttribute,

  addProduct,
  editProduct,
  deleteProduct,
};
