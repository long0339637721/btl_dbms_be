import express from "express"

const configViewEngine = (app) =>{
    app.use(express.static('./src/public')) //Cho phép sử dụng folder public
    app.set("view engine", "ejs");
    app.set("views", "./src/views")
};

export default configViewEngine;