DELIMITER //
CREATE TRIGGER update_total_amount
AFTER INSERT ON OrderItem
FOR EACH ROW
BEGIN
  DECLARE total DECIMAL(10, 2);
  
  SELECT SUM(total_price) INTO total
  FROM OrderItem
  WHERE order_id = NEW.order_id;

  UPDATE Orders
  SET total_amount = total
  WHERE order_id = NEW.order_id;
END;
//
DELIMITER ;