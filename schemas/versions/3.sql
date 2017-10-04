INSERT INTO `entities` (`id_cat`, `name`, `label`, `architecture`, `vhdl`, `inputs_count`, `active`) VALUES
(2, 'OR4', 'OR4', '', '', 4, 1),
(2, 'NOR3', 'NOR3', '', '', 3, 1);

UPDATE `version` SET version=3, updated=NOW();