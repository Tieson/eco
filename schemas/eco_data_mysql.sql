-- Počítač: 127.0.0.1
-- Verze serveru: 5.7.11
-- Verze PHP: 5.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8;
SET CHARACTER SET utf8;



INSERT INTO `user` (`mail`, `name`, `created`, `type_uctu`, `password`) VALUES
  ('martin.rozkovec@tul.cz', 'Martin Rozkovec', '2017-01-01 12:12:12', 'teacher', NULL),
  ('tomas.vaclavik@tul.cz', 'Tomáš Václavík', '2017-01-01 12:12:12', 'student', NULL);


INSERT INTO `entity_cat` (`id_cat`, `name`, `active`) VALUES
(1, 'Vstupy a výstupy', 1),
(2, 'Základní kombinační', 1),
(3, 'Komplexní kombinační', 1),
(4, 'Sekvenční', 1),
(5, 'Matematické', 1),
(6, 'Komplexní sekvenční obvody', 1);



INSERT INTO `entities` (`id_entity`, `id_cat`, `name`, `label`, `active`) VALUES
(45, 1, 'INPUT', 'INPUT', 1),
(46, 1, 'OUTPUT', 'OUTPUT', 1),
(47, 1, 'CLK', 'clock', 0),
(50, 1, 'GND', 'GND', 0),
(51, 1, 'VCC', 'VCC', 0),

(2, 2, 'TUL_BUF', 'Buffer', 1),
(3, 2, 'TUL_INV', 'INV', 1),
(4, 2, 'TUL_AND', 'AND', 1),
(5, 2, 'TUL_OR', 'OR', 1),
(6, 2, 'TUL_NAND', 'NAND', 1),
(7, 2, 'TUL_NOR', 'NOR', 1),
(8, 2, 'TUL_XOR', 'XOR', 1),
(9, 2, 'TUL_XNOR', 'XNOR', 1),

(10, 2, 'NAND3', 'NAND3', 1),
(11, 2, 'AND3', 'AND3', 1),
(12, 2, 'OR3', 'OR3', 1),
(49, 2, 'NOR3', 'NOR3', 1),

(13, 2, 'NAND4', 'NAND4', 1),
(14, 2, 'AND4', 'AND4', 1),
(48, 2, 'OR4', 'OR4', 1),
(15, 2, 'NOR4', 'NOR4', 1),

(16, 3, 'MUX2', 'MUX2', 1),
(17, 3, 'MUX4', 'MUX4', 1),
(18, 3, 'MUX8', 'MUX8', 1),
(19, 3, 'DEC14', 'DEC14', 1),
(20, 3, 'DEC18', 'DEC18', 1),
(21, 3, 'PRIOCOD42', 'Prioritní kodér 42', 1),
(22, 3, 'PRIOCOD83', 'Prioritní kodér 83', 1),

(23, 4, 'RS', 'RS', 1),
(24, 4, 'DL1', 'DL1', 1),
(25, 4, 'DL1AR', 'DL1AR', 1),
(26, 4, 'JKFF', 'JKFF', 1),
(27, 4, 'JKFFAR', 'JKFFAR', 1),
(28, 4, 'JKFFSR', 'JKFFSR', 1),
(29, 4, 'DFF', 'DFF', 1),
(30, 4, 'DFFAR', 'DFFAR', 1),
(31, 4, 'DFFSR', 'DFFSR', 1),

(32, 5, 'HALFADDER', 'HALFADDER', 1),
(33, 5, 'FULLADDER', 'FULLADDER', 1),
(34, 5, 'ADD4', 'ADD4', 1),
(35, 5, 'MUL8', 'MUL8', 1),
(36, 5, 'COMPARATORLEQ', 'COMPARATORLEQ', 1),
(37, 6, 'UPDOWNCOUNTER', 'UPDOWNCOUNTER', 1),
(38, 6, 'ARAM1x16', 'ARAM1x16', 1),
(39, 6, 'ARAM4x16', 'ARAM4x16', 1),
(40, 6, 'ARAM4x256', 'ARAM4x256', 1),
(41, 6, 'RAM1x16', 'RAM1x16', 1),
(42, 6, 'RAM4x16', 'RAM4x16', 1),
(43, 6, 'RAM4x256', 'RAM4x256', 1),
(44, 6, 'DPRAM4x256', 'DPRAM4x256', 0);