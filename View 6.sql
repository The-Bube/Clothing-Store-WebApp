USE retail_store;

CREATE VIEW View6_PendingOrders AS
SELECT 
    UserAccount.full_name,
    Orders.order_id,
    Orders.status,
    Payment.amount
FROM Orders
JOIN UserAccount ON Orders.customer_id = UserAccount.user_id
JOIN Payment ON Orders.order_id = Payment.order_id
WHERE Orders.status IN ("Pending", "Processing");

SELECT * FROM View6_PendingOrders;