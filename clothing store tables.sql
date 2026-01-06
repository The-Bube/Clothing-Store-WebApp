Use dbmsproject;
-- ===== PART A: Simple Database and Tables =====
CREATE DATABASE retail_store;
USE retail_store;

-- Roles like customer, employee, manager
CREATE TABLE Role (
  role_id INT PRIMARY KEY,
  role_name VARCHAR(50)
);

-- Users (customers + Employee)
CREATE TABLE UserAccount (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT,
  full_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  password_hash VARCHAR(100),
  FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

-- Categories like Mens, Womens, Accessories etc
CREATE TABLE Category (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50)
);

-- Products like T-shirt, Hoodies, Jeans etc
CREATE TABLE Product (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT,
  name VARCHAR(100),
  price DECIMAL(8,2),
  description VARCHAR(255),
  FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

-- Inventory (what is available in our inventory for sale)
CREATE TABLE Inventory (
  inventory_id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  location VARCHAR(50),
  quantity INT,
  reorder_level INT,
  FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- Orders
CREATE TABLE Orders ( 
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  order_date DATE,
  status VARCHAR(20),
  FOREIGN KEY (customer_id) REFERENCES UserAccount(user_id)
);

-- Order Items
CREATE TABLE OrderItem (
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(8,2),
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id),
  FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- Payments
CREATE TABLE Payment (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  method VARCHAR(20),
  amount DECIMAL(8,2),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
