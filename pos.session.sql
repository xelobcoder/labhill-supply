SELECT * FROM product
AS p 
INNER JOIN
(SELECT quantity,totalcost,cartid,transactionid,productid FROM cart) as c
ON p.productid = c.productid
WHERE c.transactionid = 1674117058616

