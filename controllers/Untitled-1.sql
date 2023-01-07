SELECT *
FROM payment as p
 INNER JOIN (
  SELECT *
  from transactions
 ) as t
where p.transactionid = t.transactionid