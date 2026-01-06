USE retail_store;

CREATE VIEW View10_CompletedOrdersSummary AS
SELECT 
    UserAccount.full_name,
    COUNT(Orders.order_id) AS CompletedOrders,
    SUM(Payment.amount) AS TotalSpent
FROM Orders
JOIN UserAccount ON Orders.customer_id = UserAccount.user_id
JOIN Payment ON Orders.order_id = Payment.order_id
WHERE Orders.status = "Completed"
GROUP BY UserAccount.full_name;

SELECT * FROM View10_CompletedOrdersSummary;