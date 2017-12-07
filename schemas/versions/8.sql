
-- CREATE TABLE `user_limits` ( `user_id` INT NOT NULL , `time` BIGINT NOT NULL) ENGINE = InnoDB ||

-- DELIMITER ||
-- DROP PROCEDURE IF EXISTS can_sim ||
-- CREATE PROCEDURE `can_sim` (IN id INT, IN cas INT, IN delTime INT,  OUT result INT)
-- BEGIN
-- 	DELETE FROM `user_limits` WHERE time < NOW() - delTime;
-- --     INSERT INTO `user_limits` (user_id, time) VALUES(id, NOW());
-- 	SELECT COUNT(*) INTO result FROM user_limits WHERE user_id=id AND time >= NOW() - cas;
-- END ||
-- DELIMITER ;

-- SET @A = 0;
-- CALL can_sim(10,600,3600,@A);
-- SELECT @A;


-- vyprázdění tabulky řešení, kvůli přidání cizího klíče
TRUNCATE TABLE `solution` ||
ALTER TABLE `solution` ADD `user_id` INT NOT NULL AFTER `schema_id`, ADD INDEX `fk_user_id` (`user_id`) ||

