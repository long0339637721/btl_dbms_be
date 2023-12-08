CREATE TRIGGER insert_into_orders
AFTER
INSERT ON your_source_table FOR EACH ROW BEGIN
INSERT INTO orders (column1, column2, column3)
VALUES (NEW.column1, NEW.column2, NEW.column3);
END;