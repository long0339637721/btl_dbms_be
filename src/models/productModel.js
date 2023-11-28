const mssql = require("mssql");
const pool = require("../configs/connectDB");

const getAllProduct = async () => {
  const query = 
    `select products.id, name, color, sale_percent, price, manufacturer, html, image 
    from products`
  const product = await pool
    .request()
    .query(query);
  return product.recordset;
};
const getProductByCategory = async (cate) => {
  try {
    const query = 
      `select products.id, name, color, sale_percent, price, manufacturer, html, image 
      from products inner JOIN categories 
      ON products.category_id = categories.id 
      where title = @cate;`
    const product = await pool
      .request()
      .input("cate", mssql.NVarChar, cate)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
}
const getProductByCode = async (code)=>{
  try {
    const query = 
      `select * 
      from products 
      where code = @code`
    const product = await pool
      .request()
      .input("code", mssql.NVarChar, code)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
};
const getProductByDevAndCate = async (cate, manufacturer) => {
  try {
    const query = 
      `select products.id, name, color, sale_percent, price, manufacturer, html 
      FROM products inner JOIN categories 
      ON products.category_id = categories.id 
      where title = @cate and manufacturer = @manufacturer;`
    const product = await pool
      .request()
      .input("cate", mssql.NVarChar, cate)
      .input("manufacturer", mssql.NVarChar, manufacturer)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
}
const getProductByDev = async (manufacturer) => {
  try {
    const query = 
      `select * 
      from products 
      where manufacturer = @manufacturer;`
    const product = await pool
      .request()
      .input("manufacturer", mssql.NVarChar, manufacturer)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
};
const getProductById = async (id) => {
  try {
    const query = 
      `select * 
      from products 
      where id = @id;`
    const product = await pool
      .request()
      .input("id", mssql.Int, id)
      .query(query);
    return product.recordset;
  } catch (error) {
    return error;
  }
};
const addProduct = async (code, name, category_id, color, sale_percent, price, manufacturer, html, image, key, value) => {
  try {
    const transaction = new mssql.Transaction(pool);
    await transaction.begin();
    try {
      const queryAddProduct = 
        `insert into products (code, category_id, name, color, sale_percent, price, manufacturer, html, image) 
        VALUES (N@code,@category_id,N@name,N@color,@sale_percent,@price,N@manufacturer,N@html,N@image)`
      const queryAddAttribute = 
        `insert into attribute_values (attribute_id, value, product_id) 
        VALUES (@attribute_id,N@value,@product_id)`;
      await transaction
        .request()
        .input("code", mssql.NVarChar, code)
        .input("category_id", mssql.Int, category_id)
        .input("name", mssql.NVarChar, name)
        .input("color", mssql.NVarChar, color)
        .input("sale_percent", mssql.Int, sale_percent)
        .input("price", mssql.Int, price)
        .input("manufacturer", mssql.NVarChar, manufacturer)
        .input("html", mssql.NVarChar, html)
        .input("image", mssql.NVarChar, image)
        .query(queryAddProduct);
      const newProduct = await getProductByCode(code);
      const productId = newProduct[0].id;
      for (let i = 0; i < key.length; i++) {
        await transaction
          .request()
          .input("attribute_id", mssql.Int, key[i])
          .input("value", mssql.NVarChar, value[i])
          .input("product_id", mssql.Int, productId)
          .query(queryAddAttribute);
      }
      await transaction.commit();
      return "success";
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    return error;
  }
};

const getAttribute_ValueById = async (id) => {
  try {
    const query = 
      `select attribute_values.id, attributes.id as attribute_id, attribute_group, name, value 
      from attribute_values INNER JOIN attributes 
      ON attribute_id = attributes.id 
      where product_id = @id;`
    const image = await pool
      .request()
      .input("id", mssql.Int, id)
      .query(query);
    return image.recordset;
  } catch (error) {
    return error;
  }
};
const deleteAttribute_ValueById = async (id) => {
    try {
        await pool.request().query(`delete from attribute_value where product_id = @;`, [id]);
        return 'success';
    } catch (error) {
        return error;
    }
};

const detailProduct = async (id) =>{
    try {
        const product = (await getProductById(id))[0];
        const detail = await getAttribute_ValueById(id);
        return {product, detail};
    } catch (error) {
        return error;
    }
};
const editProduct = async (code, name, category_id, color, sale_percent, price, manufacturer, html, image,  key, value, id) => {
    try {
        await pool.request().query(`update product set code = @, category_id = @, name = @, color = @, sale_percent = @, price = @, manufacturer = @, html = @, image = @ where id = @`,
         [code, category_id, name, color, sale_percent, price, manufacturer, html, image, id]);        
        await deleteAttribute_ValueById(id);
         for (const i = 0; i < key.length; i++) {
            await pool.request().query(`insert into attribute_value (attribute_id, value, product_id) VALUES (@,@,@)`, [key[i], value[i], id]);
        }
        return "success";
    } catch (error) {
        return error;
    }
};
const deleteProduct = async (id) => {
    try {
        await pool.request().query(`delete from product where id = @`, [id]);
        return "success";
    } catch (error) {
        return error;
    }
};
const searchItem = async (param) => {
    param = '%' + param + '%';
    const query = 
      `select * 
      from products 
      where id LIKE @param or name LIKE @param or manufacturer LIKE @param or color LIKE @param`
    const product = await pool
      .request()
      .input("param", mssql.NVarChar, param)
      .query(query);
    return product.recordset; 
};

const getAllCategory = async () =>{
    const cate = await pool.request().query(`select * from categories`);
    return cate.recordset;
};
const addCategory = async (title) =>{
    try {
        await pool.request().query(`insert into category VALUES (NULL, @)`, [title]);
        return 'sucess';
    } catch (error) {
        return error;
    }
};
const editCategory = async (id, title) =>{
    try {
        await pool.request().query(`update category SET title = @ where id = @`, [title, id]);
        return 'success';
    } catch (error) {
        return error;
    }
};
const getAllAttribute = async () =>{
    const [attribute] = await pool.request().query(`select * from attribute`);
    return attribute;
};
const addAttribute = async (name, group) =>{
    try {
        await pool.request().query(`insert into attribute VALUES (NULL,@,@)`, [name, group]);
        return 'success';
    } catch (error) {
        return error;
    }
};
const editAttribute = async (name, group, id, old_id) =>{
    try {
        await pool.request().query(`update attribute SET \`id\` = @, \`name\` = @, \`group\` = @ where \`id\` = @`, [id, name, group, old_id]);
        return 'success';
    } catch (error) {
        return 'Id has already been exists!';
    }
};
const deleteAttribute = async (id) =>{
    try {
        await pool.request().query(`delete from attribute where id = @`, [id]);
        return 'success';
    } catch (error) {
        return error;
    }
};

module.exports = {
  getProductByCategory,
  getProductByDev,
  getAttribute_ValueById,
  getProductByDevAndCate,
  searchItem,
  addProduct,
  detailProduct,
  getProductById,
  editProduct,
  deleteProduct,
  getProductByCode,
  getAllCategory,
  addCategory,
  editCategory,
  getAllAttribute,
  addAttribute,
  editAttribute,
  deleteAttribute,
  getAllProduct,
};
