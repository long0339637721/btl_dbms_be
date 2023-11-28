const productModel = require('../models/productModel');
const validation = require("../utils/validation");
const fs = require('fs');

const getAllProduct = async (req, res) => {
    const rs = await productModel.getAllProduct(req.params.code);
    return res.status(200).json({ data: rs });
};

const getProductByCode = async (req, res) => {
    const rs = await productModel.getProductByCode(req.params.code);
    if (rs.length === 0) return res.status(404).json({ message: 'Not Found!', data: null });
    return res.status(200).json({ data: rs[0] });
};

const getProductById = async (req, res) => {
    if (!validation.isNumber(req.params.id)) {
        return res.status(422).json({ message: 'Id is not valid!', data: null })
    };
    const recordset = await productModel.getProductById(req.params.id);
    if (recordset.length === 0) return res.status(404).json({ message: 'Not Found!', data: null });
    return res.status(200).json({ data: recordset[0] });
};

const getProductByCategory = async (req, res) => {
    const category = req.params.category;
    const rs = await productModel.getProductByCategory(category);
    if (rs.length === 0) return res.status(404).json({ message: 'Not Found!', data: null });
    return res.status(200).json({ data: rs });
};

const getProductByDev = async (req, res) => {
    const dev = req.params.dev;
    const rs = await productModel.getProductByDev(dev);
    if (rs.length === 0) return res.status(404).json({ message: 'Not Found!', data: null });
    return res.status(200).json({ data: rs });
};

const getProductByDevAndCate = async (req, res) => {
    const dev = req.params.dev;
    const cate = req.params.cate;
    const rs = await productModel.getProductByDevAndCate(cate, dev);
    if (rs.length === 0) return res.status(404).json({ message: 'Not Found!', data: null });
    return res.status(200).json({ data: rs });
};

const addProduct = async (req, res) => {
    const { code, name, category_id, color, sale_percent, price, manufacturer, image, key, value } = req.body;
    if (!code || !name || !category_id || !color || !sale_percent || !price || !manufacturer || !image || !req.file)
        return res.status(400).json({ message: "Vui lòng nhập đủ các trường", data: null});
    if (key === undefined || value === undefined) {
        key = value = [];
    }
    if (req.fileValidationError)
        return res.status(400).json({ message: req.fileValidationError });
    const check = await productModel.getProductByCode(code);
    if (check.length === 1)
        return res.status(400).json({ message: "Product has existing code!" });
    const rs = await productModel.addProduct(code, name, category_id, color, sale_percent, price, manufacturer, req.file.filename, image, key, value);
    if (rs !== 'success') return res.status(400).json({ message: rs, data: null });
    return res.status(200).json({ message: rs, data: null });
};

const editProduct = async (req, res) => {
    const id = req.params.id;
    const pro = await productModel.getProductById(id);
    if (pro.length === 0) return res.status(404).json({ message: 'Not Found!', data: null });
    const { code, name, category_id, color, sale_percent, price, manufacturer, image, key, value } = req.body;
    if (req.fileValidationError)
        return res.status(400).json({ message: req.fileValidationError, data: null });
    const rs = await productModel.editProduct(code, name, category_id, color, sale_percent, price, manufacturer, req.file.filename, image, key, value, id);
    if (rs !== 'success') return res.status(400).json({ message: rs, data: null });
    return res.status(200).json({ message: rs, data: null });
};

const detailProduct = async (req, res) => {
    const id = req.params.id;
    const pro = await productModel.getProductById(id);
    if (pro.length == 0)
        return res.status(404).json({ message: "Not Found!", data: null });
    const { product, detail } = await productModel.detailProduct(id);
    if (product.html)
        product.html = fs.readFileSync('./src/public/html/' + product.html, { encoding: 'utf8' });
    return res.status(200).json({ data: product, detail });
};

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const pro = await productModel.getProductById(id);
    if (pro.length == 0) return res.status(404).json({ message: "Not Found!" });
    const rs = await productModel.deleteProduct(id);
    if (rs !== 'success') return res.status(400).json({ message: rs });
    return res.status(200).json({ message: rs });
};

const searchItem = async (req, res) => {
    const param = req.params.param;
    let rs;
    if (["laptop", "tablet", "cellphone", "watch"].includes(param.toLowerCase())){
        rs = await productModel.getProductByCategory('laptop')
    }
    else rs = await productModel.searchItem(param);
    return res.status(200).json({ data: rs });
};

const getAllCategory = async (req, res) => {
    const rs = await productModel.getAllCategory();
    return res.status(200).json({ data: rs });
};

const addCategory = async (req, res) => {
    const { id, title } = req.body;
    const rs = await productModel.addCategory(title);
    if (rs !== 'success') return res.status(400).json({ message: rs });
    return res.status(200).json({ data: rs });
};

const editCategory = async (req, res) => {
    const { id, title } = req.params;
    const rs = await productModel.editCategory(id, title);
    if (rs !== 'success') return res.status(400).json({ message: rs });
    return res.status(200).json({ data: rs });
};

const getAllAttribute = async (req, res) => {
    const rs = await productModel.getAllAttribute();
    return res.status(200).json({ data: rs });
};

const addAttribute = async (req, res) => {
    const { name, group } = req.body;
    const rs = await productModel.addAttribute(name, group);
    if (rs !== 'success') return res.status(400).json({ message: rs });
    return res.status(200).json({ data: rs });
};

const editAttribute = async (req, res) => {
    const { id, name, group } = req.body;
    const rs = await productModel.editAttribute(name, group, id, req.params.id);
    if (rs !== 'success') return res.status(400).json({ message: rs });
    return res.status(200).json({ data: rs });
};

const deleteAttribute = async (req, res) => {
    const rs = await productModel.deleteAttribute(req.params.id);
    if (rs !== 'success') return res.status(400).json({ message: rs });
    return res.status(200).json({ data: rs });
};

module.exports = {
    getProductByCategory,
    addProduct,
    getProductByDev,
    getProductByDevAndCate,
    searchItem,
    editProduct,
    detailProduct,
    deleteProduct,
    getProductByCode,
    getProductById,
    getAllCategory,
    addCategory,
    editCategory,
    getAllAttribute,
    addAttribute,
    editAttribute,
    deleteAttribute,
    getAllProduct,
};
