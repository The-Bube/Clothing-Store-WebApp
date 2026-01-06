USE retail_store;

--  INSERT DATA INTO ROLE 
INSERT INTO Role (role_id, role_name)
VALUES
(1, 'Customer'),
(2, 'Admin');

--  INSERT DATA INTO USERACCOUNT 
INSERT INTO UserAccount (role_id, full_name, email, phone, password_hash)
VALUES
(1, 'Sarah Thompson', 'sarah.thompson@email.com', '416-555-1001', 'hash1'),
(1, 'James Parker', 'james.parker@email.com', '416-555-1002', 'hash2'),
(1, 'Emily Davis', 'emily.davis@email.com', '416-555-1003', 'hash3'),
(1, 'Michael Brown', 'michael.brown@email.com', '416-555-1004', 'hash4'),
(2, 'Linda Nguyen', 'linda.nguyen@email.com', '416-555-1005', 'hash5'),
(2, 'Daniel White', 'daniel.white@email.com', '416-555-1006', 'hash6');

--  INSERT DATA INTO CATEGORY 
INSERT INTO Category (name)
VALUES
('Men'),
('Women'),
('Unisex'),
('Accessories');

--  INSERT DATA INTO PRODUCT 
INSERT INTO Product (category_id, name, price, description)
VALUES
(1, 'Denim Jacket', 79.99, 'Classic blue denim jacket.'),
(1, 'Graphic Tee', 24.99, 'Cotton T-shirt with printed design.'),
(1, 'Slim Fit Jeans', 59.99, 'Stylish slim fit jeans.'),
(2, 'Summer Dress', 69.99, 'Light and breezy dress.'),
(1, 'Hoodie', 49.99, 'Comfortable fleece hoodie.'),
(1, 'Winter Coat', 129.99, 'Insulated winter coat.');

--  INSERT DATA INTO INVENTORY 
INSERT INTO Inventory (product_id, location, quantity, reorder_level)
VALUES
(1, 'Warehouse A', 25, 5),
(2, 'Warehouse B', 50, 10),
(3, 'Warehouse A', 30, 5),
(4, 'Warehouse B', 20, 5),
(5, 'Warehouse A', 40, 8),
(6, 'Warehouse C', 10, 3);

--  INSERT DATA INTO ORDERS 
INSERT INTO Orders (customer_id, order_date, status)
VALUES
(1, '2024-09-18', 'Completed'),
(2, '2024-09-20', 'Processing'),
(3, '2024-09-22', 'Shipped'),
(4, '2024-09-25', 'Completed'),
(5, '2024-09-27', 'Processing'),
(6, '2024-09-30', 'Completed');

--  INSERT DATA INTO ORDERITEM 
INSERT INTO OrderItem (order_id, product_id, quantity, price)
VALUES
(1, 1, 1, 79.99),
(1, 2, 2, 49.98),
(1, 3, 1, 59.99),
(1, 4, 1, 49.99),
(1, 5, 1, 129.99),
(1, 6, 1, 69.99),
(2, 3, 1, 59.99),
(3, 4, 1, 79.99),
(4, 6, 1, 129.99),
(5, 5, 1, 49.99),
(6, 2, 1, 24.99);

--  INSERT DATA INTO PAYMENT 
INSERT INTO Payment (order_id, method, amount)
VALUES
(1, 'Credit Card', 149.97),
(2, 'PayPal', 59.99),
(3, 'Credit Card', 79.99),
(4, 'Debit', 129.99),
(5, 'Credit Card', 49.99),
(6, 'Cash', 24.99);
