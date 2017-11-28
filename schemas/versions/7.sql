ALTER TABLE `task` ADD `entity` VARCHAR(255) NOT NULL DEFAULT 'HomeWork' AFTER `entity`||

UPDATE `version` SET version=7, updated=NOW()||