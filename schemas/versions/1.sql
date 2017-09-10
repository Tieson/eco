
-- DROP TABLE IF EXISTS `version`;
--
-- CREATE TABLE IF NOT EXISTS `version` (
--   `version` int(11) NOT NULL,
--   `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`version`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- INSERT INTO `version` (version) VALUES (0);

-- TRUNCATE TABLE `groups`;
-- ALTER TABLE `groups` CHANGE `teacher` `teacher_id` INT(11) NOT NULL;
-- ALTER TABLE `groups` DROP FOREIGN KEY fk_group_teacher;
-- ALTER TABLE `groups` ADD CONSTRAINT `fk_group_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- TRUNCATE TABLE `solution`;

-- TRUNCATE TABLE `hw_assigment`;
-- ALTER TABLE `hw_assigment` DROP FOREIGN KEY fk_hw_student_id;
-- ALTER TABLE `hw_assigment` ADD  CONSTRAINT `fk_hw_user_id` FOREIGN KEY (`student_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;


-- TRUNCATE TABLE `task`;

-- ALTER TABLE `task` DROP FOREIGN KEY `fk_task_teacher_id`;
-- ALTER TABLE `task` ADD CONSTRAINT `fk_task_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- DROP TABLE teacher;

-- ALTER TABLE `group_assigment` DROP FOREIGN KEY `fk_goup_assigment_student_id`;
-- ALTER TABLE `group_assigment` ADD CONSTRAINT `fk_goup_assigment_student_id` FOREIGN KEY (`student_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- DROP TABLE IF EXISTS student;
-- DROP TABLE IF EXISTS tag;
-- DROP TABLE IF EXISTS tag_task;


-- ALTER TABLE `hw_assigment` ADD `group_id` INT NOT NULL AFTER `student_id`, ADD INDEX (`group_id`);
-- ALTER TABLE `hw_assigment` DROP INDEX student_id_2;
-- ALTER TABLE `hw_assigment` ADD CONSTRAINT `fk_hw_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

UPDATE `version` SET version=1, updated=NOW();