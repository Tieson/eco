ALTER TABLE `task` ADD `entity` VARCHAR(255) NOT NULL DEFAULT 'HomeWork' ||

ALTER TABLE `task` ADD `valid` BOOLEAN NOT NULL DEFAULT FALSE ||

UPDATE `version` SET version=7, updated=NOW()||