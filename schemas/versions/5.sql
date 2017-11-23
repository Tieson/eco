

DROP TABLE IF EXISTS `autotest_status`||
CREATE TABLE `autotest_status` ( `status` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `start` ENUM('idle','running') NOT NULL DEFAULT 'idle' ) ENGINE=InnoDB DEFAULT CHARSET=utf8||
ALTER TABLE `autotest_status` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`)||
ALTER TABLE `autotest_status` CHANGE `start` `start` BIGINT NOT NULL||
ALTER TABLE `autotest_status` CHANGE `status` `status` ENUM('running','idle','done') CHARACTER SET latin2 COLLATE latin2_czech_cs NOT NULL DEFAULT 'idle'||

UPDATE `version` SET version=5, updated=NOW()||