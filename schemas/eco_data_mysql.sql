-- Počítač: 127.0.0.1
-- Verze serveru: 5.7.11
-- Verze PHP: 5.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8;
SET CHARACTER SET utf8;



INSERT INTO `entities` (`id_entity`, `id_cat`, `name`, `label`, `architecture`, `inputs_count`, `active`) VALUES
(2, 2, 'TUL_BUF', 'Buffer', 'RTL', 1, 1),
(3, 2, 'TUL_INV', 'INV', 'RTL', 1, 1),
(4, 2, 'TUL_AND', 'AND', 'RTL', 2, 1),
(5, 2, 'TUL_OR', 'OR', 'RTL', 2, 1),
(6, 2, 'TUL_NAND', 'NAND', 'RTL', 2, 1),
(7, 2, 'TUL_NOR', 'NOR', 'RTL', 2, 1),
(8, 2, 'TUL_XOR', 'XOR', 'RTL', 2, 1),
(9, 2, 'TUL_XNOR', 'XNOR', 'RTL', 2, 0),
(10, 2, 'NAND3', 'NAND3', 'RTL', -1, 1),
(11, 2, 'AND3', 'AND3', 'RTL', -1, 1),
(12, 2, 'OR3', 'OR3', 'RTL', -1, 1),
(13, 2, 'NAND4', 'NAND4', 'RTL', -1, 1),
(14, 2, 'AND4', 'AND4', 'RTL',4, 1),
(15, 2, 'NOR4', 'NOR4', 'RTL', -1, 1),
(16, 3, 'MUX2', 'MUX2', 'RTL', -1, 1),
(17, 3, 'MUX4', 'MUX4', 'RTL', -1, 1),
(18, 3, 'MUX8', 'MUX8', 'RTL', -1, 1),
(19, 3, 'DEC14', 'DEC14', 'RTL', -1, 1),
(20, 3, 'DEC18', 'DEC18', 'RTL', -1, 1),
(21, 3, 'PRIOCOD42', 'Prioritní kodér 42', 'RTL', -1, 1),
(22, 3, 'PRIOCOD83', 'Prioritní kodér 83', 'RTL', -1, 1),
(23, 4, 'RS', 'RS', 'RTL', -1, 1),
(24, 4, 'DL1', 'DL1', 'RTL', -1, 1),
(25, 4, 'DL1AR', 'DL1AR', 'RTL', -1, 1),
(26, 4, 'JKFF', 'JKFF', 'RTL', -1, 1),
(27, 4, 'JKFFAR', 'JKFFAR', 'RTL', -1, 1),
(28, 4, 'JKFFSR', 'JKFFSR', 'RTL', -1, 1),
(29, 4, 'DFF', 'DFF', 'RTL', -1, 1),
(30, 4, 'DFFAR', 'DFFAR', 'RTL', -1, 1),
(31, 4, 'DFFSR', 'DFFSR', 'RTL', -1, 1),
(32, 5, 'HALFADDER', 'HALFADDER', 'RTL', -1, 1),
(33, 5, 'FULLADDER', 'FULLADDER', 'RTL', -1, 1),
(34, 5, 'ADD4', 'ADD4', 'RTL', -1, 1),
(35, 5, 'MUL8', 'MUL8', 'RTL', -1, 1),
(36, 5, 'COMPARATORLEQ', 'COMPARATORLEQ', 'RTL', -1, 1),
(37, 6, 'UPDOWNCOUNTER', 'UPDOWNCOUNTER', 'RTL', -1, 1),
(38, 6, 'ARAM1x16', 'ARAM1x16', 'RTL', -1, 1),
(39, 6, 'ARAM4x16', 'ARAM4x16', 'RTL', -1, 1),
(40, 6, 'ARAM4x256', 'ARAM4x256', 'RTL', -1, 1),
(41, 6, 'RAM1x16', 'RAM1x16', 'RTL', -1, 1),
(42, 6, 'RAM4x16', 'RAM4x16', 'RTL', -1, 1),
(43, 6, 'RAM4x256', 'RAM4x256', 'RTL', -1, 1),
(44, 6, 'DPRAM4x256', 'DPRAM4x256', 'RTL', -1, 1),
(45, 1, 'INPUT', 'INPUT', '', -1, 1),
(46, 1, 'OUTPUT', 'OUTPUT', '', -1, 1),
(47, 1, 'CLK', 'clock', '', 0, 1);