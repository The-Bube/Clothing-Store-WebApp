USE retail_store;

CREATE VIEW View7_InventoryValueByLocation AS
SELECT 
    Inventory.location,
    SUM(Product.price * Inventory.quantity) AS TotalValue
FROM Inventory
JOIN Product ON Inventory.product_id = Product.product_id
GROUP BY Inventory.location;

SELECT * FROM View7_InventoryValueByLocation;