

select * from users

-- SELECT * FROM order_details

-- SELECT * FROM orders



SELECT id, name, email, phone
        FROM users 
        WHERE id IN (
SELECT O.user_id
FROM order_details AS OD, products AS P, orders AS O 
WHERE OD.product_id = P.id 
AND OD.order_id = O.id 
AND O.time_order >= '2000-01-01' AND O.time_order <= '2023-12-07T23:59:59.999Z'
GROUP BY O.user_id 
HAVING SUM(P.price*OD.count) >= 10000)

SELECT O.user_id
FROM order_details AS OD, products AS P, orders AS O 
WHERE OD.product_id = P.id 
AND OD.order_id = O.id 
AND O.time_order >= '2023-01-01' AND O.time_order <= '2023-12-07T23:59:59.999Z'
GROUP BY O.user_id 
HAVING SUM(P.price*OD.count) >= '1000'

-- SELECT * FROM order_details

-- SELECT * FROM orders



SELECT id, name, email, phone
        FROM users 
        WHERE id IN (
SELECT O.user_id
FROM order_details AS OD, products AS P, orders AS O 
WHERE OD.product_id = P.id 
AND OD.order_id = O.id 
AND O.time_order >= '2000-01-01' AND O.time_order <= '2023-12-08T23:59:59.999Z'
GROUP BY O.user_id 
HAVING SUM(P.price*OD.count) >= 100000000)

-- SELECT O.user_id
-- FROM order_details AS OD, products AS P, orders AS O 
-- WHERE OD.product_id = P.id 
-- AND OD.order_id = O.id 
-- AND O.time_order >= '2023-01-01' AND O.time_order <= '2023-12-07T23:59:59.999Z'
-- GROUP BY O.user_id 
-- HAVING SUM(P.price*OD.count) >= '1000'