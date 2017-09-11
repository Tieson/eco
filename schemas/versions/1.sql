
ALTER TABLE `schema_base` ADD `deleted` TIMESTAMP NULL DEFAULT NULL AFTER `created`;

UPDATE `version` SET version=2, updated=NOW();