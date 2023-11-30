const mssql = require('mssql');
const pool = require('../configs/connectDB');

const getAllProduct = async () => {
  const query = `select products.id, name, color, sale_percent, price, manufacturer, html, image 
    from products`;
  const product = await pool.request().query(query);
  return product.recordset;
};
const getProductByCategory = async (cate) => {
  try {
    const query = `select products.id, name, color, sale_percent, price, manufacturer, html, image 
      from products inner JOIN categories 
      ON products.category_id = categories.id 
      where title = @cate;`;
    const product = await pool
      .request()
      .input('cate', mssql.NVarChar, cate)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
};
const getProductByCode = async (code) => {
  try {
    const query = `select * 
      from products 
      where code = @code`;
    const product = await pool
      .request()
      .input('code', mssql.NVarChar, code)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
};
const getProductByDevAndCate = async (cate, manufacturer) => {
  try {
    const query = `select products.id, name, color, sale_percent, price, manufacturer, html 
      FROM products inner JOIN categories 
      ON products.category_id = categories.id 
      where title = @cate and manufacturer = @manufacturer;`;
    const product = await pool
      .request()
      .input('cate', mssql.NVarChar, cate)
      .input('manufacturer', mssql.NVarChar, manufacturer)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
};
const getProductByDev = async (manufacturer) => {
  try {
    const query = `select * 
      from products 
      where manufacturer = @manufacturer;`;
    const product = await pool
      .request()
      .input('manufacturer', mssql.NVarChar, manufacturer)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
};
const getProductById = async (id) => {
  try {
    const query = `select * 
      from products 
      where id = @id;`;
    const product = await pool
      .request()
      .input('id', mssql.Int, id)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
};
const searchItem = async (param) => {
  param = '%' + param + '%';
  const query = `select * 
      from products 
      where id LIKE @param or name LIKE @param or manufacturer LIKE @param or color LIKE @param`;
  const product = await pool
    .request()
    .input('param', mssql.NVarChar, param)
    .query(query);
  return product.recordset;
};
const detailProduct = async (id) => {
  try {
    const product = (await getProductById(id))[0];
    const detail = await getAttribute_ValueById(id);
    return { product, detail };
  } catch (error) {
    return error;
  }
};

const getAttribute_ValueById = async (id) => {
  try {
    const query = `select attribute_values.id, attributes.id as attribute_id, attribute_group, name, value
      from attribute_values INNER JOIN attributes
      ON attribute_id = attributes.id
      where product_id = @id;`;
    const image = await pool.request().input('id', mssql.Int, id).query(query);
    return image.recordset;
  } catch (error) {
    return error;
  }
};
const getAttribute_ValueByProductAndAttribute = async (
  product_id,
  attribute_id,
) => {
  try {
    const query = `select * from attribute_values 
      where product_id = @product_id and attribute_id = @attribute_id;`;
    const image = await pool
      .request()
      .input('product_id', mssql.Int, product_id)
      .input('attribute_id', mssql.Int, attribute_id)
      .query(query);
    return image.recordset;
  } catch (error) {
    return error;
  }
};
const deleteAttribute_ValueById = async (id) => {
  try {
    await pool
      .request()
      .query(`delete from attribute_value where product_id = @;`, [id]);
    return 'success';
  } catch (error) {
    return error;
  }
};

const getAllCategory = async () => {
  const cate = await pool.request().query(`select * from categories`);
  return cate.recordset;
};
const getCategoryById = async (id) => {
  const cate = await pool
    .request()
    .input('id', mssql.Int, id)
    .query(`select * from categories where id = @id`);
  return cate.recordset;
};
const addCategory = async (title) => {
  try {
    await pool
      .request()
      .input('title', mssql.NVarChar, title)
      .query(`insert into categories (title) VALUES ( @title)`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
const editCategory = async (id, title) => {
  try {
    await pool
      .request()
      .input('id', mssql.Int, id)
      .input('title', mssql.NVarChar, title)
      .query(`update categories SET title = @title where id = @id`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getAllAttribute = async () => {
  const attribute = await pool.request().query(`select * from attributes`);
  return attribute.recordset;
};
const getAttributeById = async (id) => {
  const cate = await pool
    .request()
    .input('id', mssql.Int, id)
    .query(`select * from attributes where id = @id`);
  return cate.recordset;
};
const addAttribute = async (name, group) => {
  try {
    await pool
      .request()
      .input('name', mssql.NVarChar, name)
      .input('group', mssql.NVarChar, group)
      .query(
        `insert into attributes (name, attribute_group) VALUES (@name,@group)`,
      );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
const editAttribute = async (name, group, id) => {
  try {
    await pool
      .request()
      .input('id', mssql.Int, id)
      .input('name', mssql.NVarChar, name)
      .input('group', mssql.NVarChar, group)
      .query(
        `update attributes SET name = @name, attribute_group = @group where id = @id`,
      );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
const deleteAttribute = async (id) => {
  try {
    await pool
      .request()
      .input('id', mssql.Int, id)
      .query(`delete from attributes where id = @id`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const addProduct = async (
  code,
  name,
  category_id,
  color,
  sale_percent,
  price,
  manufacturer,
  html,
  image,
  key,
  value,
) => {
  try {
    const transaction = new mssql.Transaction(pool);
    console.log('transaction begin');
    await transaction.begin();
    try {
      const queryAddProduct = `insert into products (code, category_id, name, color, sale_percent, price, manufacturer, html, image) 
        VALUES (@code,@category_id,@name,@color,@sale_percent,@price,@manufacturer,@html,@image)`;
      const queryAddAttribute = `insert into attribute_values (attribute_id, value, product_id) 
        VALUES (@attribute_id,@value,@product_id)`;
      console.log('transaction query 1');
      await transaction
        .request()
        .input('code', mssql.NVarChar, code)
        .input('category_id', mssql.Int, category_id)
        .input('name', mssql.NVarChar, name)
        .input('color', mssql.NVarChar, color)
        .input('sale_percent', mssql.Int, sale_percent)
        .input('price', mssql.Int, price)
        .input('manufacturer', mssql.NVarChar, manufacturer)
        .input('html', mssql.Text, html)
        .input('image', mssql.Text, image)
        .query(queryAddProduct);
      console.log('transaction query 2');
      const newProduct = await transaction
        .request()
        .input('code', mssql.NVarChar, code)
        .query(`select * from products where code = @code`);
      const productId = newProduct.recordset[0].id;
      for (let i = 0; i < key.length; i++) {
        console.log('transaction query 3', i);
        await transaction
          .request()
          .input('attribute_id', mssql.Int, key[i])
          .input('value', mssql.NVarChar, value[i])
          .input('product_id', mssql.Int, productId)
          .query(queryAddAttribute);
        console.log('transaction query 4', i);
      }
      console.log('transaction commit');
      await transaction.commit();
      return true;
    } catch (error) {
      console.log('transaction rollback');
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
const editProduct = async (
  code,
  name,
  category_id,
  color,
  sale_percent,
  price,
  manufacturer,
  html,
  image,
  key,
  value,
  id,
) => {
  try {
    const transaction = new mssql.Transaction(pool);
    console.log('Transaction begin');
    await transaction.begin();
    try {
      console.log('Transaction query 1');
      await transaction
        .request()
        .input('code', mssql.NVarChar, code)
        .input('category_id', mssql.Int, category_id)
        .input('name', mssql.NVarChar, name)
        .input('color', mssql.NVarChar, color)
        .input('sale_percent', mssql.Int, sale_percent)
        .input('price', mssql.Int, price)
        .input('manufacturer', mssql.NVarChar, manufacturer)
        .input('html', mssql.Text, html)
        .input('image', mssql.Text, image)
        .input('id', mssql.Int, id)
        .query(
          `update products 
          set code = @code, category_id = @category_id, name = @name, color = @color, 
            sale_percent = @sale_percent, price = @price, manufacturer = @manufacturer, 
            html = @html, image = @image 
          where id = @id`,
        );
      for (let i = 0; i < key.length; i++) {
        console.log('Transaction query 2', i);
        const rs = await transaction
          .request()
          .input('attribute_id', mssql.Int, key[i])
          .input('product_id', mssql.Int, id)
          .query(
            `select * from attribute_values where product_id = @product_id and attribute_id = @attribute_id`,
          );
        if (rs.recordset.length > 0) {
          console.log('Transaction query 3', i);
          await transaction
            .request()
            .input('value', mssql.NVarChar, value[i])
            .input('id', mssql.Int, rs.recordset[0].id)
            .query(
              `update attribute_values 
              set value = @value 
              where id = @id`,
            );
        } else {
          console.log('Transaction query 4', i);
          await transaction
            .request()
            .input('attribute_id', mssql.Int, key[i])
            .input('value', mssql.NVarChar, value[i])
            .input('product_id', mssql.Int, id)
            .query(
              `insert into attribute_values (attribute_id, value, product_id) 
              VALUES (@attribute_id,@value,@product_id)`,
            );
        }
      }
      console.log('Transaction commit');
      await transaction.commit();
      return true;
    } catch (error) {
      console.log('Transaction rollback');
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
const deleteProduct = async (id) => {
  try {
    await pool
      .request()
      .input('id', mssql.Int, id)
      .query(`delete from products where id = @id`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getAllProduct,
  getProductByCategory,
  getProductByDev,
  getProductByDevAndCate,
  getProductById,
  getProductByCode,
  searchItem,
  detailProduct,

  getAllCategory,
  getCategoryById,
  addCategory,
  editCategory,

  getAllAttribute,
  getAttributeById,
  addAttribute,
  editAttribute,
  deleteAttribute,

  addProduct,
  editProduct,
  deleteProduct,
};
