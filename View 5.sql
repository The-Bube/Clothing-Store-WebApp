USE retail_store;

CREATE VIEW View5_AllUsers AS
SELECT full_name, "Customer" AS UserType
FROM UserAccount
WHERE role_id IN (SELECT role_id FROM Role WHERE role_name = "Customer")
UNION
SELECT full_name, "Employee" AS UserType
FROM UserAccount
WHERE role_id IN (SELECT role_id FROM Role WHERE role_name = "Employee");

SELECT * FROM View5_AllUsers;