USE retail_store;

CREATE VIEW View4_FullProductInventory AS
SELECT 
    Product.product_id,
    Product.name AS ProductName,
    Product.price,
    Inventory.quantity,
    Inventory.location
FROM Product
LEFT JOIN Inventory ON Product.product_id = Inventory.product_id 
/*Using  LEFTT JOIN AND RIGHT JOIN BECAUSE MYSQL DOESN'T SUPPORT FULL JOIN*/
UNION
SELECT 
    Product.product_id,
    Product.name AS ProductName,
    Product.price,
    Inventory.quantity,
    Inventory.location
FROM Product
RIGHT JOIN Inventory ON Product.product_id = Inventory.product_id;

SELECT * FROM View4_FullProductInventory;