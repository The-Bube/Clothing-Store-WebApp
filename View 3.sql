USE retail_store;

CREATE VIEW View3_AboveAverageOrders AS
SELECT 
    Orders.order_id,
    Payment.amount,
    CASE 
        WHEN Payment.amount > (
            SELECT AVG(P2.amount)
            FROM Payment AS P2
            JOIN Orders AS O2 ON P2.order_id = O2.order_id
            WHERE O2.customer_id = Orders.customer_id
        ) THEN "Above Average"
        ELSE "Below Average"
    END AS Comparison
FROM Orders
JOIN Payment ON Orders.order_id = Payment.order_id;

SELECT * FROM View3_AboveAverageOrders;