USE retail_store;

CREATE VIEW View9_LowStockProducts AS
SELECT 
    Product.product_id,
    Product.name AS ProductName,
    Inventory.quantity,
    Inventory.reorder_level,
    Inventory.location
FROM Product
JOIN Inventory ON Product.product_id = Inventory.product_id
WHERE Inventory.quantity < Inventory.reorder_level;

SELECT * FROM View9_LowStockProducts;