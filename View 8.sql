USE retail_store;

CREATE VIEW View8_OrderItemCount AS
SELECT 
    Orders.order_id,
    UserAccount.full_name,
    SUM(OrderItem.quantity) AS TotalItems,
    SUM(OrderItem.price * OrderItem.quantity) AS TotalCost
FROM Orders
JOIN UserAccount ON Orders.customer_id = UserAccount.user_id
JOIN OrderItem ON Orders.order_id = OrderItem.order_id
GROUP BY Orders.order_id, UserAccount.full_name;

SELECT * FROM View8_OrderItemCount;