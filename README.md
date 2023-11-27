# KiotBK BE

## Description

Use mssql and nodejs

## How to install

### Create database and insert data to database by SSMS

    - Create database: phone_store.sql
    - Insert data: init_data.sql

### Create file .env that contains:

    - DB_HOST = localhost
    - DB_USER = (your username)
    - DB_PASSWORD = (your password)
    - DB_DATABASE = store
    - APP_PORT = (port to run BE)

### Install node modules

    - npm i

## How to run

- npm start
- Open: http://localhost:${port}/

# Note

- src/config: chứa các file cấu hình sever
- src/routes: định nghĩa các route
- src/models: chứa các model tương ứng với các bảng trong DB
- src/controllers: xử lý logic và truy vấn DB
- src/views: giao diện hiển thị cho người dùng
