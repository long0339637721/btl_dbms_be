create database store;

use store;

CREATE TABLE categories (
  id int PRIMARY KEY IDENTITY(1,1),
  title nvarchar(100) not null,
);

create table products (
  id int PRIMARY KEY IDENTITY(1,1),
  code nvarchar(20) not null UNIQUE,
  name nvarchar(100) not null,
  color nvarchar(30) not null,
  sale_percent int not null default 0,
  price int not null,
  manufacturer nvarchar(100) not null,
  html text,
  image text,
  category_id int not null,
  foreign key (category_id) references categories(id) ON DELETE CASCADE ON UPDATE CASCADE,
);

CREATE TABLE users (
  id int PRIMARY KEY IDENTITY(1,1),
  name nvarchar(100) NOT NULL,
  email nvarchar(50) NOT NULL UNIQUE,
  phone nvarchar(50) NOT NULL UNIQUE,
  password nvarchar(250) NOT NULL,
  avatar nvarchar(50),
  passwordChangedAt datetime not null,
  registryAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login datetime,
  address nvarchar(100),
  isAdmin int NOT NULL DEFAULT 0
);

CREATE TABLE staffs (
  id int PRIMARY KEY IDENTITY(1,1),
  avatar nvarchar(50) NOT NULL,
  password nvarchar(100) NOT NULL,
  name nvarchar(100) NOT NULL,
  email nvarchar(100) NOT NULL UNIQUE,
  registryAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login datetime NOT NULL,
  phone nvarchar(100) NOT NULL UNIQUE
);

CREATE TABLE vouchers (
  id nvarchar(50) PRIMARY KEY,
  name nvarchar(100) NOT NULL,
  sale_percent int NOT NULL,
  max_price int,
  min_price_apply int,
  count int,
  expired date
);

CREATE TABLE own_voucher (
  voucher_id nvarchar(50) NOT NULL,
  user_id int NOT NULL,
  PRIMARY KEY (voucher_id, user_id),
  foreign key (voucher_id) references vouchers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  foreign key (user_id) references users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE shipping_methods (
  id int PRIMARY KEY IDENTITY(1,1),
  name nvarchar(100) NOT NULL,
  price int NOT NULL
);

CREATE TABLE payment (
  id int IDENTITY(1,1) PRIMARY KEY,
  name nvarchar(100) NOT NULL
);

CREATE TABLE orders (
  id int PRIMARY KEY IDENTITY(1,1),
  user_id int NOT NULL,
  voucher_id nvarchar(50),
  payment_id int NOT NULL,
  shipping_id int NOT NULL,
  time_order datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  time_get datetime,
  status nvarchar(50) NOT NULL,
  notice nvarchar(250) NOT NULL,
  foreign key (voucher_id) references vouchers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  foreign key (user_id) references users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  foreign key (payment_id) references payment(id) ON DELETE CASCADE ON UPDATE CASCADE,
  foreign key (shipping_id) references shipping_methods(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
    order_details (
        id int PRIMARY KEY IDENTITY(1, 1),
        order_id int NOT NULL,
        product_id int NOT NULL,
        count int NOT NULL,
        foreign key (product_id) references products(id) ON DELETE CASCADE ON UPDATE CASCADE,
        foreign key (order_id) references orders(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

<<<<<<< HEAD
CREATE TABLE
    review (
        id int PRIMARY KEY IDENTITY(1, 1),
        product_id int NOT NULL,
        user_id int NOT NULL,
        rating int NOT NULL,
        image varchar(100) NOT NULL,
        content varchar(500) NOT NULL,
        dateReview datetime NOT NULL,
        foreign key (user_id) references users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        foreign key (product_id) references products(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

create table
    attribute (
        id int PRIMARY KEY IDENTITY(1, 1),
        name varchar(50) NOT NULL,
        attribute_group varchar(50),
    );

create table
    attribute_value (
        id int not null IDENTITY(1, 1),
        attribute_id int NOT NULL,
        value varchar(200) NOT NULL,
        product_id int not null,
        primary key(id),
        foreign key (product_id) references products(id) ON DELETE CASCADE ON UPDATE CASCADE,
        foreign key (attribute_id) references attribute(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
=======
CREATE TABLE review (
  id int PRIMARY KEY IDENTITY(1,1),
  product_id int NOT NULL,
  user_id int NOT NULL,
  rating int NOT NULL,
  image nvarchar(100) NOT NULL,
  content nvarchar(500) NOT NULL,
  dateReview datetime NOT NULL,
  foreign key (user_id) references users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  foreign key (product_id) references products(id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table attribute (
  id int PRIMARY KEY IDENTITY(1,1),
  name nvarchar(50) NOT NULL,
  attribute_group nvarchar(50),
);

create table attribute_value (
  id int not null IDENTITY(1,1),
  attribute_id int NOT NULL,
  value nvarchar(200) NOT NULL,
  product_id int not null,
  primary key(id),
  foreign key (product_id) references products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  foreign key (attribute_id) references attribute(id) ON DELETE CASCADE ON UPDATE CASCADE
);
>>>>>>> 097fef7548d8485588727f733c7c64d9434dc93a
