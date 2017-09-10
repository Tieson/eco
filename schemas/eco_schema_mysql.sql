-- Počítač: 127.0.0.1
-- Verze serveru: 5.7.11
-- Verze PHP: 5.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8;
SET CHARACTER SET utf8;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databáze: `editorobvodu`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `entities`
--

DROP TABLE IF EXISTS `entities`;

CREATE TABLE IF NOT EXISTS `entities` (
  `id_entity` int(11) NOT NULL AUTO_INCREMENT,
  `id_cat` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `label` varchar(50) NOT NULL,
  `architecture` varchar(50) NOT NULL,
  `vhdl` text NOT NULL,
  `inputs_count` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_entity`),
  UNIQUE KEY `name` (`name`),
  KEY `id_cat` (`id_cat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `entities`
--


-- --------------------------------------------------------

--
-- Struktura tabulky `entity_cat`
--
DROP TABLE IF EXISTS `entity_cat`;

CREATE TABLE IF NOT EXISTS `entity_cat` (
  `id_cat` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_cat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `entity_cat`
--

INSERT INTO `entity_cat` (`id_cat`, `name`, `active`) VALUES
(1, 'Vstupy a výstupy', 1),
(2, 'Základní kombinační', 1),
(3, 'Komplexní kombinační', 1),
(4, 'Sekvenční', 1),
(5, 'Matematické', 1),
(6, 'Komplexní sekvenční obvody', 1);

-- --------------------------------------------------------

--
-- Struktura tabulky `groups`
--
DROP TABLE IF EXISTS `groups`;
CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(30) COLLATE latin2_czech_cs NOT NULL,
  `day` enum('po','ut','st','ct','pa','so','ne') COLLATE latin2_czech_cs NOT NULL,
  `weeks` enum('both','odd','even') COLLATE latin2_czech_cs NOT NULL,
  `block` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `teacher_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_teacher_key` (`teacher_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `group_assigment`
--

DROP TABLE IF EXISTS `group_assigment`;
CREATE TABLE IF NOT EXISTS `group_assigment` (
  `group_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `entered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`group_id`,`student_id`),
  KEY `group_id` (`group_id`),
  KEY `student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `hw_assigment`
--

DROP TABLE IF EXISTS `hw_assigment`;
CREATE TABLE IF NOT EXISTS `hw_assigment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deadline` timestamp NULL,
  `status` enum('open','done','failed') COLLATE latin2_czech_cs NOT NULL DEFAULT 'open',
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `student_id` (`student_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `schema_base`
--

DROP TABLE IF EXISTS `schema_base`;
CREATE TABLE IF NOT EXISTS `schema_base` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(50) COLLATE latin2_czech_cs NOT NULL,
  `architecture` varchar(50) COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `schema_data`
--

DROP TABLE IF EXISTS `schema_data`;
CREATE TABLE IF NOT EXISTS `schema_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` text COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `edited` timestamp NULL,
  `schema_id` int(11) DEFAULT NULL,
  `typ` enum('regular','solution') COLLATE latin2_czech_cs NOT NULL DEFAULT 'regular',
  PRIMARY KEY (`id`),
  KEY `schema_id` (`schema_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `solution`
--

DROP TABLE IF EXISTS `solution`;
CREATE TABLE IF NOT EXISTS `solution` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `homework_id` int(11) NOT NULL,
  `schema_id` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('done','waiting') COLLATE latin2_czech_cs NOT NULL DEFAULT 'waiting',
  `test_result` tinyint(1) DEFAULT NULL,
  `test_message` text COLLATE latin2_czech_cs,
  `vhdl` text COLLATE latin2_czech_cs NOT NULL,
  `name` varchar(50) COLLATE latin2_czech_cs NOT NULL,
  `architecture` varchar(50) COLLATE latin2_czech_cs NOT NULL,
  PRIMARY KEY (`id`),
  KEY `homework_id` (`homework_id`),
  KEY `schema_id` (`schema_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_id` int(11) NOT NULL,
  `name` varchar(150) COLLATE latin2_czech_cs NOT NULL,
  `description` text COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `task_files`
--

DROP TABLE IF EXISTS `task_files`;
CREATE TABLE IF NOT EXISTS `task_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `file` varchar(255) COLLATE latin2_czech_cs NOT NULL,
  `name` varchar(255) COLLATE latin2_czech_cs NOT NULL,
  `type` varchar(60) COLLATE latin2_czech_cs NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mail` varchar(256) COLLATE latin2_czech_cs NOT NULL,
  `name` varchar(100) COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type_uctu` enum('guest','student','teacher') COLLATE latin2_czech_cs NOT NULL DEFAULT 'guest',
  `password` varchar(256) COLLATE latin2_czech_cs DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `user`
--

INSERT INTO `user` (`id`, `mail`, `name`, `created`, `type_uctu`, `password`) VALUES
  (1, 'tjerice@seznam.cz', 'Tomáš Jeřický', '2017-04-07 08:28:35', 'student', NULL),
  (2, 'omacka@seznam.cz', 'Jan Omáčka', '2017-04-07 08:28:35', 'teacher', NULL),
  (3, 'martin.rozkovec@tul.cz', 'Martin Rozkovec', '2017-04-07 12:19:49', 'teacher', NULL),
  (4, 'tomas.vaclavik@tul.cz', 'Tomáš Václavík', '2017-04-07 12:19:49', 'student', NULL),
  (5, 'test@test.cz', 'Tester Testovač', '2017-09-04 15:58:53', 'student', NULL),
  (6, 'karel.novak@tul.cz', 'Karel Novák', '2017-09-04 15:59:14', 'student', NULL);



DROP TABLE IF EXISTS `version`;

CREATE TABLE IF NOT EXISTS `version` (
  `version` int(11) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `version` (version) VALUES (0);


--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku `groups`
--
ALTER TABLE `groups` ADD CONSTRAINT `fk_group_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Omezení pro tabulku `group_assigment`
--
ALTER TABLE `group_assigment`
  ADD CONSTRAINT `fk_goup_assigment_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_goup_assigment_student_id` FOREIGN KEY (`student_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Omezení pro tabulku `hw_assigment`
--
ALTER TABLE `hw_assigment`
  ADD CONSTRAINT `fk_hw_task_id` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`),
  ADD CONSTRAINT `fk_hw_user_id` FOREIGN KEY (`student_id`) REFERENCES `user`(`id`),
  ADD CONSTRAINT `fk_hw_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`);

--
-- Omezení pro tabulku `schema_base`
--
ALTER TABLE `schema_base`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Omezení pro tabulku `schema_data`
--
ALTER TABLE `schema_data`
  ADD CONSTRAINT `fk_data_schema_id` FOREIGN KEY (`schema_id`) REFERENCES `schema_base` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Omezení pro tabulku `solution`
--
ALTER TABLE `solution`
  ADD CONSTRAINT `fk_solution_hw_id` FOREIGN KEY (`homework_id`) REFERENCES `hw_assigment` (`id`),
  ADD CONSTRAINT `fk_solution_schema_id` FOREIGN KEY (`schema_id`) REFERENCES `schema_base` (`id`);


--
-- Omezení pro tabulku `task`
--
ALTER TABLE `task` ADD CONSTRAINT `fk_task_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Omezení pro tabulku `task_files`
--
ALTER TABLE `task_files`
  ADD CONSTRAINT `task_id_fk` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`);


UPDATE `version` SET version=1, updated=NOW();

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
