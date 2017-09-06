
-- změna cizího klíče z teacher an user
TRUNCATE TABLE `groups`; --vyprázdnění tabulky aby se mohly nastavit cizí klíče
ALTER TABLE `groups` CHANGE `teacher` `teacher_id` INT(11) NOT NULL;
ALTER TABLE `groups` DROP FOREIGN KEY fk_group_teacher;
ALTER TABLE `groups` ADD CONSTRAINT `fk_group_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

TRUNCATE TABLE `solution`; -- vymazat i řešení, na která úkoly navazují

-- změna cizího klíče uživatele
TRUNCATE TABLE `hw_assigment`; -- je potřeba pro změnu cizích klíčů to, aby klíče odpovídaly a nejjednodušeji vymazáním záznamů.
ALTER TABLE `hw_assigment` DROP FOREIGN KEY fk_hw_student_id;
ALTER TABLE `hw_assigment` ADD  CONSTRAINT `fk_hw_user_id` FOREIGN KEY (`student_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
-- ALTER TABLE `hw_assigment` CHANGE `student_id` `user_id` INT(11) NOT NULL;

-- změna cizího klíče u úkolů z teacher ana uživatele
TRUNCATE TABLE `task`;
-- ALTER TABLE `task` CHANGE `teacher_id` `user_id` INT(11) NOT NULL;
ALTER TABLE `task` DROP FOREIGN KEY `fk_task_teacher_id`;
ALTER TABLE `task` ADD CONSTRAINT `fk_task_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;


DROP TABLE teacher; -- tabulku učitelů už dál nepotřebuji
--TRUNCATE TABLE `groups`;

--změnit cizí klíč ze studenta na user
-- ALTER TABLE `group_assigment` CHANGE `student_id` `user_id` INT(11) NOT NULL;
ALTER TABLE `group_assigment` DROP FOREIGN KEY `fk_goup_assigment_student_id`;
ALTER TABLE `group_assigment` ADD CONSTRAINT `fk_goup_assigment_student_id` FOREIGN KEY (`student_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

DROP TABLE student; -- tabulku už dál nepotřebuji
DROP TABLE tag; -- tabulku už dál nepotřebuji
DROP TABLE tag_task; -- tabulku už dál nepotřebuji


--přidání reference na skupinu kdomácímu úkolu
ALTER TABLE `hw_assigment` ADD `group_id` INT NOT NULL AFTER `student_id`, ADD INDEX (`group_id`);
ALTER TABLE `hw_assigment` DROP INDEX student_id_2;
ALTER TABLE `hw_assigment` ADD CONSTRAINT `fk_hw_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;