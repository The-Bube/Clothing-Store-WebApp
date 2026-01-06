USE retail_store;

CREATE VIEW View2_HighSpenders AS
SELECT 
    UserAccount.full_name,
    SUM(Payment.amount) AS TotalSpent
FROM UserAccount
JOIN Orders ON UserAccount.user_id = Orders.customer_id
JOIN Payment ON Orders.order_id = Payment.order_id
WHERE Payment.amount > ANY (
    SELECT Payment.amount
    FROM Payment
    JOIN Orders ON Payment.order_id = Orders.order_id
    JOIN UserAccount ON Orders.customer_id = UserAccount.user_id
    WHERE UserAccount.role_id IN (
        SELECT role_id FROM Role WHERE role_name = "Manager"
    )
)
GROUP BY UserAccount.full_name;

SELECT * FROM View2_HighSpenders;