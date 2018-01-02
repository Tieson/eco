DROP TRIGGER IF EXISTS `update_hw_on_done`||
CREATE TRIGGER `update_hw_on_done`
AFTER UPDATE ON `solution`
FOR EACH ROW
  BEGIN
    DECLARE spravnychReseni INTEGER;
    SET @spravnychReseni := (SELECT COUNT(*) FROM solution  WHERE homework_id = NEW.homework_id AND status = 'done' AND test_result = 1);

    IF ((NEW.status = 'done' AND NEW.test_result = 1) OR @spravnychReseni > 0)
    THEN
      UPDATE hw_assigment
      SET status = 'done'
      WHERE id = NEW.homework_id;
    ELSE
      UPDATE hw_assigment
      SET status = 'failed'
      WHERE id = NEW.homework_id;
    END IF;
  END||

UPDATE `version` SET version=1, updated=NOW()||