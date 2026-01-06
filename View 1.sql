USE dbmsproject;
USE retail_store;

CREATE VIEW View1_OrderSummary AS
SELECT 
    UserAccount.full_name AS CustomerName,
    Orders.order_id,
    Orders.status AS OrderStatus,
    Product.name AS ProductName,
    OrderItem.quantity,
    (OrderItem.quantity * OrderItem.price) AS Subtotal
FROM UserAccount
JOIN Orders ON UserAccount.user_id = Orders.customer_id
JOIN OrderItem ON Orders.order_id = OrderItem.order_id
JOIN Product ON OrderItem.product_id = Product.product_id;


SELECT * FROM View1_OrderSummary;
