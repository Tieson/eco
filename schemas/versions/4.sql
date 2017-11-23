ALTER TABLE `solution` CHANGE `status` `status` ENUM('done','waiting','processing') CHARACTER SET latin2 COLLATE latin2_czech_cs NOT NULL DEFAULT 'waiting'||
ALTER TABLE `solution` CHANGE `schema_id` `schema_id` INT(11) NULL||

UPDATE `version` SET version=4, updated=NOW()||