-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Počítač: 127.0.0.1
-- Vytvořeno: Čtv 31. srp 2017, 12:24
-- Verze serveru: 5.7.11
-- Verze PHP: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `editorobvodu`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `entities`
--

CREATE TABLE `entities` (
  `id_entity` int(11) NOT NULL,
  `id_cat` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `label` varchar(50) NOT NULL,
  `architecture` varchar(50) NOT NULL,
  `vhdl` text NOT NULL,
  `inputs_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `entities`
--

INSERT INTO `entities` (`id_entity`, `id_cat`, `name`, `label`, `architecture`, `vhdl`, `inputs_count`) VALUES
(2, 2, 'TUL_BUF', 'Buffer', 'RTL', 'library ieee;\nuse ieee.std_logic_1164.all;\n\nentity TUL_BUF is\n	port(\n		a : in  std_logic;\n		q : out std_logic\n	);\nend entity TUL_BUF;\n\narchitecture RTL of TUL_BUF is\nbegin\n	q <= a;\n\nend architecture RTL;', 1),
(3, 2, 'TUL_INV', 'INV', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_INV is\r\n	port(\r\n		a : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_INV;\r\n\r\narchitecture RTL of TUL_INV is\r\nbegin\r\n	q <= not a;\r\n\r\nend architecture RTL;', 1),
(4, 2, 'TUL_AND', 'AND', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_AND is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_AND;\r\n\r\narchitecture RTL of TUL_AND is\r\nbegin\r\n	q <= a and b;\r\n\r\nend architecture RTL;', 2),
(5, 2, 'TUL_OR', 'OR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_OR is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\n\n		q : out std_logic\r\n	);\r\nend entity TUL_OR;\r\n\r\narchitecture RTL of TUL_OR is\r\nbegin\r\n	q <= a or b;\r\n\r\nend architecture RTL;', 2),
(6, 2, 'TUL_NAND', 'NAND', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_NAND is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_NAND;\r\n\r\narchitecture RTL of TUL_NAND is\r\nbegin\r\n	q <= not (a and b);\r\n\r\nend architecture RTL;', 2),
(7, 2, 'TUL_NOR', 'NOR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_NOR is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_NOR;\r\n\r\narchitecture RTL of TUL_NOR is\r\nbegin\r\n	q <= not (a or b);\r\n\r\nend architecture RTL;', 2),
(8, 2, 'TUL_XOR', 'XOR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_XOR is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_XOR;\r\n\r\narchitecture RTL of TUL_XOR is\r\nbegin\r\n	q <= a xor b;\r\n\r\nend architecture RTL;', 2),
(9, 2, 'TUL_XNOR', 'XNOR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_XNOR is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_XNOR;\r\n\r\narchitecture RTL of TUL_XNOR is\r\nbegin\r\n	q <= not (a xor b);\r\n\r\nend architecture RTL;', 2),
(10, 2, 'NAND3', 'NAND3', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity NAND3 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		q : out std_logic\r\n	);\n\nend entity NAND3;\r\n\r\narchitecture RTL of NAND3 is\r\nbegin\r\n	q <= not (a and b and c);\r\n\r\nend architecture RTL;', -1),
(11, 2, 'AND3', 'AND3', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity AND3 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity AND3;\r\n\r\narchitecture RTL of AND3 is\r\nbegin\r\n	q <= a and b and c;\r\n\r\nend architecture RTL;', -1),
(12, 2, 'OR3', 'OR3', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity OR3 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity OR3;\r\n\r\narchitecture RTL of OR3 is\r\nbegin\r\n	q <= not (a or b or c);\r\n\r\nend architecture RTL;', -1),
(13, 2, 'NAND4', 'NAND4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity NAND4 is\n\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		d : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity NAND4;\r\n\r\narchitecture RTL of NAND4 is\r\nbegin\r\n	q <= not (a and b and c and d);\r\n\r\nend architecture RTL;', -1),
(14, 2, 'AND4', 'AND4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity AND4 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		d : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity AND4;\r\n\r\narchitecture RTL of AND4 is\r\nbegin\r\n	q <= a and b and c and d;\r\n\r\nend architecture RTL;', 4),
(15, 2, 'NOR4', 'NOR4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity NOR4 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		d : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity NOR4;\r\n\r\narchitecture RTL of NOR4 is\r\nbegin\r\n	q <= not (a or b or c or d);\r\n\n\nend architecture RTL;', -1),
(16, 3, 'MUX2', 'MUX2', 'RTL', 'use ieee.std_logic_1164.all;\r\n\r\nentity MUX2 is\r\n	port(\r\n		a0  : in  std_logic;\r\n		a1  : in  std_logic;\r\n		sel : in  std_logic;\r\n		q   : out std_logic\r\n	);\r\nend entity MUX2;\r\n\r\narchitecture RTL of MUX2 is\r\nbegin\r\n	q <= a0 when sel = \'0\' else a1;\r\n\r\nend architecture RTL;', -1),
(17, 3, 'MUX4', 'MUX4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity MUX4 is\r\n	port(\r\n		a0   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a3   : in  std_logic;\r\n		sel0 : in  std_logic;\r\n		sel1 : in  std_logic;\r\n		q    : out std_logic\r\n	);\r\nend entity MUX4;\r\n\r\narchitecture RTL of MUX4 is\r\n	signal sel : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	sel <= sel1 & sel0;\r\n\r\n	mx : process(sel, a0, a1, a2, a3)\r\n	begin\r\n		case sel is\r\n			when "00" =>\r\n				q <= a0;\r\n			when "01" =>\r\n				q <= a1;\r\n			when "10" =>\r\n				q <= a2;\r\n			when others =>\r\n				q <= a3;\r\n		end case;\r\n	end process;\r\n\r\nend architecture RTL;', -1),
(18, 3, 'MUX8', 'MUX8', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity MUX8 is\r\n	port(\r\n		a0   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a3   : in  std_logic;\r\n		a4   : in  std_logic;\r\n		a5   : in  std_logic;\r\n		a6   : in  std_logic;\r\n		a7   : in  std_logic;\r\n		sel0 : in  std_logic;\r\n		sel1 : in  std_logic;\r\n		sel2 : in  std_logic;\r\n		q    : out std_logic\r\n	);\r\nend entity MUX8;\r\n\r\narchitecture RTL of MUX8 is\r\n	signal sel : std_logic_vector(2 downto 0);\r\n\r\nbegin\r\n	sel <= sel2 & sel1 & sel0;\r\n\r\n	mx : process(sel, a0, a1, a2, a3, a4, a5, a6, a7)\r\n	begin\r\n		case sel is\r\n			when "000" =>\r\n				q <= a0;\r\n			when "001" =>\r\n				q <= a1;\r\n			when "010" =>\r\n				q <= a2;\r\n			when "011" =>\r\n				q <= a3;\r\n			when "100" =>\r\n				q <= a4;\r\n			when "101" =>\r\n				q <= a5;\r\n			when "110" =>\r\n				q <= a6;\r\n			when others =>\r\n				q <= a7;\r\n		end case;\r\n	end process;\r\n\r\nend architecture RTL;', -1),
(19, 3, 'DEC14', 'DEC14', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DEC14 is\r\n	port(\r\n		sel0 : in  std_logic;\r\n		sel1 : in  std_logic;\r\n		y0   : out std_logic;\r\n		y1   : out std_logic;\r\n		y2   : out std_logic;\r\n		y3   : out std_logic\r\n	);\r\nend entity DEC14;\r\n\r\narchitecture RTL of DEC14 is\r\n	signal y   : std_logic_vector(3 downto 0);\r\n	signal sel : std_logic_vector(1 downto 0);\r\nbegin\r\n	sel <= sel1 & sel0;\r\n\r\n	dec : process(sel)\r\n	begin\r\n		case sel is\r\n			when "00" =>\r\n				y <= "0001";\r\n			when "01" =>\r\n				y <= "0010";\r\n			when "10" =>\r\n				y <= "0100";\r\n			when others =>\r\n				y <= "1000";\r\n		end case;\r\n	end process;\r\n\r\n	y0 <= y(0);\r\n	y1 <= y(1);\r\n	y2 <= y(2);\r\n	y3 <= y(3);\r\n\r\nend architecture RTL;', -1),
(20, 3, 'DEC18', 'DEC18', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DEC18 is\r\n	port(\r\n		sel0 : in  std_logic;\r\n		sel1 : in  std_logic;\r\n		sel2 : in  std_logic;\r\n		y0   : out std_logic;\r\n		y1   : out std_logic;\r\n		y2   : out std_logic;\r\n		y3   : out std_logic;\r\n		y4   : out std_logic;\r\n		y5   : out std_logic;\r\n		y6   : out std_logic;\r\n		y7   : out std_logic\r\n	);\r\nend entity DEC18;\r\n\r\narchitecture RTL of DEC18 is\r\n	signal y   : std_logic_vector(7 downto 0);\r\n	signal sel : std_logic_vector(2 downto 0);\r\nbegin\r\n	sel <= sel2 & sel1 & sel0;\r\n\r\n	dec : process(sel)\r\n	begin\r\n		case sel is\r\n			when "000" =>\r\n				y <= "00000001";\r\n			when "001" =>\r\n				y <= "00000010";\r\n			when "010" =>\r\n				y <= "00000100";\r\n			when "011" =>\r\n				y <= "00001000";\r\n			when "100" =>\r\n				y <= "00010000";\r\n			when "101" =>\r\n				y <= "00100000";\r\n			when "110" =>\r\n				y <= "01000000";\r\n			when others =>\r\n				y <= "10000000";\r\n		end case;\r\n	end process;\r\n\r\n	y0 <= y(0);\r\n	y1 <= y(1);\r\n	y2 <= y(2);\r\n	y3 <= y(3);\r\n	y4 <= y(4);\r\n	y5 <= y(5);\r\n	y6 <= y(6);\r\n	y7 <= y(7);\r\n\r\nend architecture RTL;', -1),
(21, 3, 'PRIOCOD42', 'Prioritní kodér 42', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity PRIOCOD42 is\r\n	port(\r\n		a0 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a3 : in  std_logic;\r\n		q0 : out std_logic;\r\n		q1 : out std_logic;\r\n		v  : out std_logic\r\n	);\r\nend entity PRIOCOD42;\r\n\r\narchitecture RTL of PRIOCOD42 is\r\n	signal q : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	process(a3, a2, a1, a0)\r\n	begin\r\n		v <= \'1\';\r\n		if a0 = \'1\' then\r\n			q <= "00";\r\n		elsif a1 = \'1\' then\r\n			q <= "01";\r\n		elsif a2 = \'1\' then\r\n			q <= "10";\r\n		elsif a3 = \'1\' then\r\n			q <= "11";\r\n		else\r\n			q <= "00";\r\n			v <= \'0\';\r\n		end if;\r\n	end process;\r\n\r\n	q0 <= q(0);\r\n	q1 <= q(1);\r\n\r\nend architecture RTL;', -1),
(22, 3, 'PRIOCOD83', 'Prioritní kodér 83', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity PRIOCOD83 is\r\n	port(\r\n		a0 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a3 : in  std_logic;\r\n		a4 : in  std_logic;\r\n		a5 : in  std_logic;\r\n		a6 : in  std_logic;\r\n		a7 : in  std_logic;\r\n		q0 : out std_logic;\r\n		q1 : out std_logic;\r\n		q2 : out std_logic;\r\n		v  : out std_logic\r\n	);\r\nend entity PRIOCOD83;\r\n\r\narchitecture RTL of PRIOCOD83 is\r\n	signal q : std_logic_vector(2 downto 0);\r\n\r\nbegin\r\n	process(a7, a6, a5, a4, a3, a2, a1, a0)\r\n	begin\r\n		v <= \'1\';\r\n		if a0 = \'1\' then\r\n			q <= "000";\r\n		elsif a1 = \'1\' then\r\n			q <= "001";\r\n		elsif a2 = \'1\' then\r\n			q <= "010";\r\n		elsif a3 = \'1\' then\r\n			q <= "011";\r\n		elsif a4 = \'1\' then\r\n			q <= "100";\r\n		elsif a5 = \'1\' then\r\n			q <= "101";\r\n		elsif a6 = \'1\' then\r\n			q <= "110";\r\n		elsif a7 = \'1\' then\r\n			q <= "111";\r\n		else\r\n			q <= "000";\r\n			v <= \'0\';\r\n		end if;\r\n	end process;\r\n\r\n	q0 <= q(0);\r\n	q1 <= q(1);\r\n	q2 <= q(2);\r\n\r\nend architecture RTL;', -1),
(23, 4, 'RS', 'RS', 'RTL', 'use ieee.std_logic_1164.all;\r\n\r\nentity RS is\r\n	port(\r\n		r  : in  std_logic;\r\n		s  : in  std_logic;\r\n		q  : out std_logic;\r\n		qn : out std_logic\r\n	);\r\nend entity RS;\r\n\r\narchitecture RTL of RS is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(r, qn_int)\r\n	begin\r\n		q_int <= not (r or qn_int);\r\n	end process;\r\n\r\n	process(s, q_int)\r\n	begin\r\n		qn_int <= not (s or q_int);\r\n	end process;\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1),
(24, 4, 'DL1', 'DL1', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DL1 is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DL1;\r\n\r\narchitecture RTL of DL1 is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(clk, d)\r\n	begin\r\n		if clk = \'1\' then\r\n			q_int <= d;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= q_int;\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1),
(25, 4, 'DL1AR', 'DL1AR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DL1AR is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		ar  : in  std_logic;\r\n		as  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DL1AR;\r\n\r\narchitecture RTL of DL1AR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(clk, d, ar, as)\r\n	begin\r\n		if ar = \'1\' then\r\n			q_int <= \'0\';\r\n		elsif as = \'1\' then\r\n			q_int <= \'1\';\r\n		elsif clk = \'1\' then\r\n			q_int <= d;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= q_int;\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1),
(26, 4, 'JKFF', 'JKFF', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity JKFF is\r\n	port(\r\n		j   : in  std_logic;\r\n		k   : in  std_logic;\r\n		clk : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity JKFF;\r\n\r\narchitecture RTL of JKFF is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\n	signal jk     : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	jk <= j & k;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			case jk is\r\n				when "10" =>\r\n					q_int <= \'1\';\r\n				when "01" =>\r\n					q_int <= \'0\';\r\n				when "11" =>\r\n					q_int <= not q_int;\r\n				when others =>\r\n					q_int <= q_int;\r\n			end case;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1),
(27, 4, 'JKFFAR', 'JKFFAR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity JKFFAR is\r\n	port(\r\n		j   : in  std_logic;\r\n		k   : in  std_logic;\r\n		clk : in  std_logic;\r\n		as  : in  std_logic;\r\n		ar  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity JKFFAR;\r\n\r\narchitecture RTL of JKFFAR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\n	signal jk     : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	jk <= j & k;\r\n\r\n	process(as, ar, clk)\r\n	begin\r\n		if ar = \'1\' then\r\n			q_int <= \'0\';\r\n		elsif as = \'1\' then\r\n			q_int <= \'1\';\r\n		elsif rising_edge(clk) then\r\n			case jk is\r\n				when "10" =>\r\n					q_int <= \'1\';\r\n				when "01" =>\r\n					q_int <= \'0\';\r\n				when "11" =>\r\n					q_int <= not q_int;\r\n				when others =>\r\n					q_int <= q_int;\r\n			end case;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1),
(28, 4, 'JKFFSR', 'JKFFSR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity JKFFSR is\r\n	port(\r\n		j   : in  std_logic;\r\n		k   : in  std_logic;\r\n		clk : in  std_logic;\r\n		ss  : in  std_logic;\r\n		sr  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity JKFFSR;\r\n\r\narchitecture RTL of JKFFSR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\n	signal jk     : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	jk <= j & k;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if sr = \'1\' then\r\n				q_int <= \'0\';\r\n			elsif ss = \'1\' then\r\n				q_int <= \'1\';\r\n			else\r\n				case jk is\r\n					when "10" =>\r\n						q_int <= \'1\';\r\n					when "01" =>\r\n						q_int <= \'0\';\r\n					when "11" =>\r\n						q_int <= not q_int;\r\n					when others =>\r\n						q_int <= q_int;\r\n				end case;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1),
(29, 4, 'DFF', 'DFF', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DFF is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DFF;\r\n\r\narchitecture RTL of DFF is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(clk)\n\n	begin\r\n		if rising_edge(clk) then\r\n			q_int <= d;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1),
(30, 4, 'DFFAR', 'DFFAR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DFFAR is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		as  : in  std_logic;\n\n		ar  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DFFAR;\r\n\r\narchitecture RTL of DFFAR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(ar, as, clk)\r\n	begin\r\n		if ar = \'1\' then\r\n			q_int <= \'0\';\r\n		elsif as = \'1\' then\r\n			q_int <= \'1\';\r\n		elsif rising_edge(clk) then\r\n			q_int <= d;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1),
(31, 4, 'DFFSR', 'DFFSR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DFFSR is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		ss  : in  std_logic;\r\n		sr  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DFFSR;\r\n\r\narchitecture RTL of DFFSR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if sr = \'1\' then\r\n				q_int <= \'0\';\r\n			elsif ss = \'1\' then\r\n				q_int <= \'1\';\r\n			else\r\n				q_int <= d;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1),
(32, 5, 'HALFADDER', 'HALFADDER', 'RTL', 'use ieee.std_logic_1164.all;\r\n\r\nentity HALFADDER is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		s : out std_logic;\r\n		c : out std_logic\r\n	);\r\nend entity HALFADDER;\r\n\r\narchitecture RTL of HALFADDER is\r\nbegin\r\n	s <= a xor b;\r\n	c <= a and b;\r\n\r\nend architecture RTL;', -1),
(33, 5, 'FULLADDER', 'FULLADDER', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity FULLADDER is\r\n	port(\r\n		a    : in  std_logic;\r\n		b    : in  std_logic;\r\n		cin  : in  std_logic;\r\n		s    : out std_logic;\r\n		cout : out std_logic\r\n	);\r\nend entity FULLADDER;\r\n\r\narchitecture RTL of FULLADDER is\r\n	signal sum_int : unsigned(1 downto 0);\r\n	signal a_int   : unsigned(1 downto 0);\r\n	signal b_int   : unsigned(1 downto 0);\r\n	signal c_int   : unsigned(1 downto 0);\r\n\r\nbegin\r\n	a_int <= "0" & a;\r\n	b_int <= "0" & b;\r\n	c_int <= "0" & cin;\r\n\r\n	sum_int <= a_int + b_int + c_int;\r\n	s       <= sum_int(0);\r\n	cout    <= sum_int(1);\r\n\r\nend architecture RTL;', -1),
(34, 5, 'ADD4', 'ADD4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity ADD4 is\r\n	port(\r\n		a3   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a0   : in  std_logic;\r\n		b3   : in  std_logic;\r\n		b2   : in  std_logic;\r\n		b1   : in  std_logic;\r\n		b0   : in  std_logic;\r\n		cin  : in  std_logic;\r\n		invb : in  std_logic;\r\n		s3   : out std_logic;\r\n		s2   : out std_logic;\r\n		s1   : out std_logic;\r\n		s0   : out std_logic;\r\n		cout : out std_logic\r\n	);\r\nend entity ADD4;\r\n\r\narchitecture RTL of ADD4 is\r\n	signal sum_int : unsigned(4 downto 0);\r\n	signal a       : unsigned(4 downto 0);\r\n	signal b       : unsigned(4 downto 0);\r\n	signal c       : unsigned(4 downto 0);\r\n\r\nbegin\r\n	a <= "0" & a3 & a2 & a1 & a0;\r\n	b <= "0" & b3 & b2 & b1 & b0 when invb = \'0\' else "0" & not (b3) & not (b2) & not (b1) & not (b0);\r\n	c <= "0000" & cin;\r\n\r\n	sum_int <= a + b + c;\r\n\r\n	s3   <= sum_int(3);\r\n	s2   <= sum_int(2);\r\n	s1   <= sum_int(1);\r\n	s0   <= sum_int(0);\r\n	cout <= sum_int(4);\r\n\r\nend architecture RTL;', -1),
(35, 5, 'MUL8', 'MUL8', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\n\nentity MUL8 is\r\n	port(\r\n		a3 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a0 : in  std_logic;\r\n		b3 : in  std_logic;\r\n		b2 : in  std_logic;\r\n		b1 : in  std_logic;\r\n		b0 : in  std_logic;\r\n		s7 : out std_logic;\r\n		s6 : out std_logic;\r\n		s5 : out std_logic;\r\n		s4 : out std_logic;\r\n		s3 : out std_logic;\r\n		s2 : out std_logic;\r\n		s1 : out std_logic;\r\n		s0 : out std_logic\r\n	);\r\nend entity MUL8;\r\n\r\narchitecture RTL of MUL8 is\r\n	signal a : signed(3 downto 0);\r\n	signal b : signed(3 downto 0);\r\n	signal s : signed(7 downto 0);\r\n\r\nbegin\r\n	a <= a3 & a2 & a1 & a0;\r\n	b <= b3 & b2 & b1 & b0;\r\n\r\n	s  <= a * b;\r\n	s7 <= s(7);\r\n	s6 <= s(6);\r\n	s5 <= s(5);\r\n	s4 <= s(4);\r\n	s3 <= s(3);\r\n	s2 <= s(2);\r\n	s1 <= s(1);\r\n	s0 <= s(0);\r\n\r\nend architecture RTL;', -1),
(36, 5, 'COMPARATORLEQ', 'COMPARATORLEQ', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity COMPARATORLEQ is\r\n	port(\r\n		a3   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a0   : in  std_logic;\r\n		b3   : in  std_logic;\r\n		b2   : in  std_logic;\r\n		b1   : in  std_logic;\r\n		b0   : in  std_logic;\r\n		leq  : out std_logic;\r\n		leqn : out std_logic\r\n	);\r\nend entity COMPARATORLEQ;\r\n\r\narchitecture RTL of COMPARATORLEQ is\r\n	signal a       : signed(3 downto 0);\r\n	signal b       : signed(3 downto 0);\r\n	signal leq_int : std_logic;\n\n\r\nbegin\r\n	a <= a3 & a2 & a1 & a0;\r\n	b <= b3 & b2 & b1 & b0;\r\n\r\n	leq_int <= \'1\' when a <= b else \'0\';\r\n	leq     <= leq_int;\r\n	leqn    <= not (leq_int);\r\n\r\nend architecture RTL;', -1),
(37, 6, 'UPDOWNCOUNTER', 'UPDOWNCOUNTER', 'RTL', 'use ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity UPDOWNCOUNTER is\r\n	port(\r\n		clk     : in  std_logic;\r\n		clk_en  : in  std_logic;\r\n		sreset  : in  std_logic;\r\n		spreset : in  std_logic;\r\n		a3      : in  std_logic;\r\n		a2      : in  std_logic;\r\n		a1      : in  std_logic;\r\n		a0      : in  std_logic;\r\n		down    : in  std_logic;\r\n		q3      : out std_logic;\r\n		q2      : out std_logic;\r\n		q1      : out std_logic;\r\n		q0      : out std_logic;\r\n		zero    : out std_logic;\r\n		match   : out std_logic\r\n	);\r\nend entity UPDOWNCOUNTER;\r\n\r\narchitecture RTL of UPDOWNCOUNTER is\r\n	signal cnt_reg : unsigned(3 downto 0);\r\n	signal a       : unsigned(3 downto 0);\r\n\r\nbegin\r\n	a <= a3 & a2 & a1 & a0;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if sreset = \'1\' then\r\n				cnt_reg <= (others => \'0\');\r\n			elsif spreset = \'1\' then\r\n				cnt_reg <= a3 & a2 & a1 & a0;\r\n			elsif clk_en = \'1\' then\r\n				if down = \'0\' then\r\n					cnt_reg <= cnt_reg - 1;\r\n				else\r\n					cnt_reg <= cnt_reg + 1;\r\n				end if;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	q3 <= cnt_reg(3);\r\n	q2 <= cnt_reg(2);\n\n	q1 <= cnt_reg(1);\r\n	q0 <= cnt_reg(0);\r\n\r\n	zero  <= \'1\' when cnt_reg = 0 else \'0\';\r\n	match <= \'1\' when cnt_reg = a else \'0\';\r\n\r\nend architecture RTL;', -1),
(38, 6, 'ARAM1x16', 'ARAM1x16', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity ARAM1x16 is\r\n	port(\r\n		ce : in  std_logic;\r\n		we : in  std_logic;\r\n		a3 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a0 : in  std_logic;\r\n		d  : in  std_logic;\r\n		q  : out std_logic\r\n	);\r\nend entity ARAM1x16;\r\n\r\narchitecture RTL of ARAM1x16 is\r\n	type ram_type is array (15 downto 0) of std_logic;\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a3 & a2 & a1 & a0;\r\n\r\n	process(address, ce, we, d, ram_inst)\r\n	begin\r\n		if ce = \'1\' then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= d;\r\n			end if;\r\n			q <= ram_inst(to_integer(address));\r\n		else\r\n			q <= \'0\';\r\n		end if;\r\n	end process;\r\n\r\nend architecture RTL;', -1),
(39, 6, 'ARAM4x16', 'ARAM4x16', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity ARAM4x16 is\r\n	port(\r\n		ce : in  std_logic;\r\n		we : in  std_logic;\r\n		a3 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a0 : in  std_logic;\r\n		d3 : in  std_logic;\n\n		d2 : in  std_logic;\r\n		d1 : in  std_logic;\r\n		d0 : in  std_logic;\r\n		q3 : out std_logic;\r\n		q2 : out std_logic;\r\n		q1 : out std_logic;\r\n		q0 : out std_logic\r\n	);\r\nend entity ARAM4x16;\r\n\r\narchitecture RTL of ARAM4x16 is\r\n	type ram_type is array (15 downto 0) of unsigned(3 downto 0);\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(3 downto 0);\r\n	signal din      : unsigned(3 downto 0);\r\n	signal dout     : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a3 & a2 & a1 & a0;\r\n	din     <= d3 & d2 & d1 & d0;\r\n\r\n	process(address, ce, we, din, ram_inst)\r\n	begin\r\n		if ce = \'1\' then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= din;\r\n			end if;\r\n			dout <= ram_inst(to_integer(address));\r\n		else\r\n			dout <= (others => \'0\');\r\n		end if;\r\n	end process;\r\n\r\n	q3 <= dout(3);\r\n	q2 <= dout(2);\r\n	q1 <= dout(1);\r\n	q0 <= dout(0);\r\n\r\nend architecture RTL;', -1),
(40, 6, 'ARAM4x256', 'ARAM4x256', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity ARAM4x256 is\r\n	port(\r\n		ce : in  std_logic;\r\n		we : in  std_logic;\r\n		a7 : in  std_logic;\r\n		a6 : in  std_logic;\r\n		a5 : in  std_logic;\r\n		a4 : in  std_logic;\r\n		a3 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a0 : in  std_logic;\r\n		d3 : in  std_logic;\r\n		d2 : in  std_logic;\r\n		d1 : in  std_logic;\r\n		d0 : in  std_logic;\r\n		q3 : out std_logic;\r\n		q2 : out std_logic;\r\n		q1 : out std_logic;\r\n		q0 : out std_logic\r\n	);\r\nend entity ARAM4x256;\r\n\r\narchitecture RTL of ARAM4x256 is\r\n	type ram_type is array (255 downto 0) of unsigned(3 downto 0);\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(7 downto 0);\r\n	signal din      : unsigned(3 downto 0);\r\n	signal dout     : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a7 & a6 & a5 & a4 & a3 & a2 & a1 & a0;\r\n	din     <= d3 & d2 & d1 & d0;\r\n\r\n	process(address, ce, we, din, ram_inst)\r\n	begin\r\n		if ce = \'1\' then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= din;\r\n			end if;\r\n			dout <= ram_inst(to_integer(address));\r\n		else\r\n			dout <= (others => \'0\');\r\n		end if;\r\n	end process;\r\n\r\n	q3 <= dout(3);\r\n	q2 <= dout(2);\r\n	q1 <= dout(1);\r\n	q0 <= dout(0);\r\n\r\nend architecture RTL;', -1),
(41, 6, 'RAM1x16', 'RAM1x16', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity RAM1x16 is\r\n	port(\r\n		clk : in  std_logic;\r\n		we  : in  std_logic;\r\n		a3  : in  std_logic;\r\n		a2  : in  std_logic;\r\n		a1  : in  std_logic;\r\n		a0  : in  std_logic;\r\n		d   : in  std_logic;\r\n		q   : out std_logic\r\n	);\r\nend entity RAM1x16;\r\n\r\narchitecture RTL of RAM1x16 is\r\n	type ram_type is array (15 downto 0) of std_logic;\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a3 & a2 & a1 & a0;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= d;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	q <= ram_inst(to_integer(address));\r\n\r\nend architecture RTL;', -1),
(42, 6, 'RAM4x16', 'RAM4x16', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity RAM4x16 is\r\n	port(\r\n		clk : in  std_logic;\r\n		we  : in  std_logic;\r\n		a3  : in  std_logic;\r\n		a2  : in  std_logic;\r\n		a1  : in  std_logic;\r\n		a0  : in  std_logic;\r\n		d3  : in  std_logic;\r\n		d2  : in  std_logic;\r\n		d1  : in  std_logic;\r\n		d0  : in  std_logic;\r\n		q3  : out std_logic;\r\n		q2  : out std_logic;\r\n		q1  : out std_logic;\r\n		q0  : out std_logic\r\n	);\n\nend entity RAM4x16;\r\n\r\narchitecture RTL of RAM4x16 is\r\n	type ram_type is array (15 downto 0) of unsigned(3 downto 0);\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(3 downto 0);\r\n	signal din      : unsigned(3 downto 0);\r\n	signal dout     : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a3 & a2 & a1 & a0;\r\n	din     <= d3 & d2 & d1 & d0;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= din;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	dout <= ram_inst(to_integer(address));\r\n\r\n	q3 <= dout(3);\r\n	q2 <= dout(2);\r\n	q1 <= dout(1);\r\n	q0 <= dout(0);\r\n\r\nend architecture RTL;', -1),
(43, 6, 'RAM4x256', 'RAM4x256', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity RAM4x256 is\r\n	port(\r\n		clk : in  std_logic;\r\n		we  : in  std_logic;\r\n		a7  : in  std_logic;\r\n		a6  : in  std_logic;\r\n		a5  : in  std_logic;\r\n		a4  : in  std_logic;\r\n		a3  : in  std_logic;\r\n		a2  : in  std_logic;\r\n		a1  : in  std_logic;\r\n		a0  : in  std_logic;\r\n		d3  : in  std_logic;\r\n		d2  : in  std_logic;\r\n		d1  : in  std_logic;\r\n		d0  : in  std_logic;\r\n		q3  : out std_logic;\r\n		q2  : out std_logic;\r\n		q1  : out std_logic;\r\n		q0  : out std_logic\r\n	);\r\nend entity RAM4x256;\r\n\r\narchitecture RTL of RAM4x256 is\r\n	type ram_type is array (255 downto 0) of unsigned(3 downto 0);\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(7 downto 0);\r\n	signal din      : unsigned(3 downto 0);\r\n	signal dout     : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a7 & a6 & a5 & a4 & a3 & a2 & a1 & a0;\r\n	din     <= d3 & d2 & d1 & d0;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= din;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	dout <= ram_inst(to_integer(address));\r\n\r\n	q3 <= dout(3);\r\n	q2 <= dout(2);\r\n	q1 <= dout(1);\r\n	q0 <= dout(0);\r\n\r\nend architecture RTL;', -1),
(44, 6, 'DPRAM4x256', 'DPRAM4x256', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.std_logic_unsigned.all;\r\n\r\nentity DPRAM4x256 is\r\n	port(\r\n		aclk : in  std_logic;\r\n		awe  : in  std_logic;\r\n		bclk : in  std_logic;\r\n		bwe  : in  std_logic;\r\n		a7   : in  std_logic;\r\n		a6   : in  std_logic;\r\n		a5   : in  std_logic;\r\n		a4   : in  std_logic;\r\n		a3   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a0   : in  std_logic;\r\n		b7   : in  std_logic;\r\n		b6   : in  std_logic;\r\n		b5   : in  std_logic;\r\n		b4   : in  std_logic;\r\n		b3   : in  std_logic;\r\n		b2   : in  std_logic;\r\n		b1   : in  std_logic;\r\n		b0   : in  std_logic;\r\n		da3  : in  std_logic;\r\n		da2  : in  std_logic;\r\n		da1  : in  std_logic;\r\n		da0  : in  std_logic;\r\n		db3  : in  std_logic;\r\n		db2  : in  std_logic;\r\n		db1  : in  std_logic;\r\n		db0  : in  std_logic;\r\n		qa3  : out std_logic;\r\n		qa2  : out std_logic;\r\n		qa1  : out std_logic;\r\n		qa0  : out std_logic;\r\n		qb3  : out std_logic;\r\n		qb2  : out std_logic;\r\n		qb1  : out std_logic;\r\n		qb0  : out std_logic\r\n	);\r\nend entity DPRAM4x256;\r\n\r\narchitecture RTL of DPRAM4x256 is\r\n	type ram_type is array (255 downto 0) of std_logic_vector(3 downto 0);\r\n	shared variable ram_inst : ram_type;\r\n\r\n	signal address_a : std_logic_vector(7 downto 0);\r\n	signal address_b : std_logic_vector(7 downto 0);\r\n\r\n	signal dina : std_logic_vector(3 downto 0);\r\n	signal dinb : std_logic_vector(3 downto 0);\r\n\r\n	signal douta : std_logic_vector(3 downto 0);\r\n	signal doutb : std_logic_vector(3 downto 0);\r\n\r\nbegin\r\n	address_a <= a7 & a6 & a5 & a4 & a3 & a2 & a1 & a0;\r\n	address_b <= b7 & b6 & b5 & b4 & b3 & b2 & b1 & b0;\r\n\r\n	dina <= da3 & da2 & da1 & da0;\r\n	dinb <= db3 & db2 & db1 & db0;\r\n\r\n	process(aclk)\r\n	begin\r\n		if rising_edge(aclk) then\r\n			if awe = \'1\' then\r\n				ram_inst(CONV_INTEGER(address_a)) := dina;\r\n			end if;\r\n			douta <= ram_inst(CONV_INTEGER(address_a));\r\n		end if;\r\n	end process;\r\n\r\n	process(bclk)\r\n	begin\r\n		if rising_edge(bclk) then\r\n			if bwe = \'1\' then\r\n				ram_inst(CONV_INTEGER(address_b)) := dinb;\r\n			end if;\r\n			doutb <= ram_inst(CONV_INTEGER(address_b));\r\n		end if;\r\n	end process;\r\n\r\n	qa3 <= douta(3);\r\n	qa2 <= douta(2);\r\n	qa1 <= douta(1);\r\n	qa0 <= douta(0);\r\n\r\n	qb3 <= doutb(3);\r\n	qb2 <= doutb(2);\r\n	qb1 <= doutb(1);\r\n	qb0 <= doutb(0);\r\n\r\nend architecture RTL;', -1),
(45, 1, 'INPUT', 'INPUT', '', '', -1),
(46, 1, 'OUTPUT', 'OUTPUT', '', '', -1),
(47, 1, 'CLK', 'clock', '', '', 0);

-- --------------------------------------------------------

--
-- Struktura tabulky `entity_cat`
--

CREATE TABLE `entity_cat` (
  `id_cat` int(11) NOT NULL,
  `name` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `entity_cat`
--

INSERT INTO `entity_cat` (`id_cat`, `name`) VALUES
(1, 'Vstupy a výstupy'),
(2, 'Základní kombinační'),
(3, 'Komplexní kombinační'),
(4, 'Sekvenční'),
(5, 'Matematické'),
(6, 'Komplexní sekvenční obvody');

-- --------------------------------------------------------

--
-- Struktura tabulky `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `subject` varchar(30) COLLATE latin2_czech_cs NOT NULL,
  `day` enum('po','ut','st','ct','pa','so','ne') COLLATE latin2_czech_cs NOT NULL,
  `weeks` enum('both','odd','even') COLLATE latin2_czech_cs NOT NULL,
  `block` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `teacher` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `groups`
--

INSERT INTO `groups` (`id`, `subject`, `day`, `weeks`, `block`, `created`, `teacher`) VALUES
(13, 'noobs', 'po', 'both', 1, '2017-08-24 19:56:25', 9),
(16, 'CIT', 'st', 'both', 3, '2017-08-24 20:09:21', 9),
(41, 'AAA', 'po', 'both', 1, '2017-08-25 16:25:52', 9),
(42, 'khk', 'po', 'both', 1, '2017-08-31 08:46:20', 9),
(43, '', 'po', 'both', 1, '2017-08-31 08:46:21', 9);

-- --------------------------------------------------------

--
-- Struktura tabulky `group_assigment`
--

CREATE TABLE `group_assigment` (
  `group_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `entered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `group_assigment`
--

INSERT INTO `group_assigment` (`group_id`, `student_id`, `entered`, `approved`) VALUES
(13, 8, '2017-08-31 00:16:00', 0),
(13, 9, '2017-08-31 00:09:45', 0),
(16, 9, '2017-08-31 00:43:26', 0),
(41, 8, '2017-08-31 00:43:47', 0),
(41, 9, '2017-08-31 00:43:46', 0);

-- --------------------------------------------------------

--
-- Struktura tabulky `hw_assigment`
--

CREATE TABLE `hw_assigment` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deadline` timestamp DEFAULT NULL,
  `status` enum('open','done','failed') COLLATE latin2_czech_cs NOT NULL DEFAULT 'open'
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `hw_assigment`
--

INSERT INTO `hw_assigment` (`id`, `task_id`, `student_id`, `created`, `deadline`, `status`) VALUES
(1, 1, 8, '2017-04-07 14:53:04', '2017-04-21 00:00:00', 'open'),
(2, 1, 9, '2017-04-07 14:53:35', '2017-04-21 00:00:00', 'open');

-- --------------------------------------------------------

--
-- Struktura tabulky `schema_base`
--

CREATE TABLE `schema_base` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(50) COLLATE latin2_czech_cs NOT NULL,
  `architecture` varchar(50) COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `schema_base`
--

INSERT INTO `schema_base` (`id`, `user_id`, `name`, `architecture`, `created`) VALUES
(28, 1, 'schema_01', 'architecture_ABC', '2017-03-25 01:57:29'),
(30, 1, 'schema_02_s', 'arch_1', '2017-03-31 17:45:59'),
(35, 2, 'S_42', 'A_42', '2017-04-21 20:30:14');

-- --------------------------------------------------------

--
-- Struktura tabulky `schema_data`
--

CREATE TABLE `schema_data` (
  `id` int(11) NOT NULL,
  `data` text COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `edited` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `schema_id` int(11) DEFAULT NULL,
  `typ` enum('regular','solution') COLLATE latin2_czech_cs NOT NULL DEFAULT 'regular'
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `schema_data`
--

INSERT INTO `schema_data` (`id`, `data`, `created`, `edited`, `schema_id`, `typ`) VALUES
(4, '{"cells":[{"type":"mylib.TUL_INV","size":{"width":50,"height":70},"position":{"x":462,"y":315},"angle":0,"id":"63f5dd0d-5ebf-4616-b5a3-70f324f4925b","z":1,"attrs":{}},{"type":"mylib.TUL_NAND","size":{"width":50,"height":70},"position":{"x":462,"y":231},"angle":0,"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","z":2,"attrs":{}},{"type":"mylib.TUL_NAND","size":{"width":50,"height":70},"position":{"x":462,"y":147},"angle":0,"id":"3b05f709-78f2-49fe-8daa-3a948ab846cc","z":3,"attrs":{}},{"type":"mylib.TUL_NAND","size":{"width":50,"height":70},"position":{"x":630,"y":217},"angle":0,"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","z":4,"attrs":{}},{"type":"mylib.TUL_NAND","size":{"width":50,"height":70},"position":{"x":770,"y":301},"angle":0,"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","z":5,"attrs":{}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":112,"y":154},"angle":0,"id":"1db7a20d-94cf-4cc9-9197-8e2032073768","z":6,"attrs":{}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":112,"y":217},"angle":0,"id":"1e5cdf1b-28eb-4f23-8261-bc0ff87985eb","z":7,"attrs":{".label":{"text":"X1"}}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":112,"y":287},"angle":0,"id":"6a5740a5-7a6a-422d-87d2-02e335953f80","z":8,"attrs":{".label":{"text":"X2"}}},{"type":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":924,"y":168},"angle":0,"id":"70d4e7ae-140f-4069-bd89-f0803f7734c1","z":9,"attrs":{}},{"type":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":924,"y":217},"angle":0,"id":"315d5dad-930b-4f70-8c16-498980ec0abf","z":10,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"3b05f709-78f2-49fe-8daa-3a948ab846cc","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","selector":"g:nth-child(1) > rect:nth-child(3)","port":"a"},"id":"6d57f672-281a-4990-a7ac-fabccbbd6a7f","z":11,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"3b05f709-78f2-49fe-8daa-3a948ab846cc","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"70d4e7ae-140f-4069-bd89-f0803f7734c1","selector":"g:nth-child(1) > rect:nth-child(4)","port":"a"},"id":"8c9a8d85-d0da-4e9d-8009-3f327d5d2166","z":12,"signal":1,"vertices":[],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","selector":"g:nth-child(1) > rect:nth-child(3)","port":"a"},"id":"7b3997b6-1530-49c6-a0df-bee62e8b05d9","z":13,"signal":-1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"315d5dad-930b-4f70-8c16-498980ec0abf","selector":"g:nth-child(1) > rect:nth-child(4)","port":"a"},"id":"817914f9-b8b1-48a1-a2c4-c7baca6c8e46","z":14,"signal":1,"vertices":[],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"63f5dd0d-5ebf-4616-b5a3-70f324f4925b","selector":"g:nth-child(1) > rect:nth-child(6)","port":"q"},"target":{"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","selector":"g:nth-child(1) > rect:nth-child(4)","port":"b"},"id":"2d0d0ae0-d69e-4433-99f5-bfafa3e2d947","z":15,"signal":-1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","selector":"g:nth-child(1) > rect:nth-child(4)","port":"b"},"id":"668b11b2-401f-465f-8d68-f71d713c5117","z":16,"signal":1,"vertices":[],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1db7a20d-94cf-4cc9-9197-8e2032073768","selector":"g:nth-child(1) > rect:nth-child(4)","port":"q"},"target":{"id":"3b05f709-78f2-49fe-8daa-3a948ab846cc","selector":"g:nth-child(1) > rect:nth-child(3)","port":"a"},"id":"002d5453-e0ec-4c9e-bfbd-307280bb8c46","z":18,"signal":1,"vertices":[{"x":378,"y":168}],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1e5cdf1b-28eb-4f23-8261-bc0ff87985eb","selector":"g:nth-child(1) > rect:nth-child(4)","port":"q"},"target":{"id":"3b05f709-78f2-49fe-8daa-3a948ab846cc","selector":"g:nth-child(1) > rect:nth-child(4)","port":"b"},"id":"bc870c61-7048-4d57-a500-97a2b4358c8a","z":19,"signal":-1,"vertices":[],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1e5cdf1b-28eb-4f23-8261-bc0ff87985eb","selector":"g:nth-child(1) > rect:nth-child(4)","port":"q"},"target":{"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","selector":"g:nth-child(1) > rect:nth-child(3)","port":"a"},"id":"30dee446-f599-4e87-aa03-7b28c94de39d","z":20,"signal":-1,"vertices":[],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"6a5740a5-7a6a-422d-87d2-02e335953f80","selector":"g:nth-child(1) > rect:nth-child(4)","port":"q"},"target":{"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","selector":"g:nth-child(1) > rect:nth-child(4)","port":"b"},"id":"4796b84d-9d0e-4e3b-bc3e-fcb67d2284a3","z":21,"signal":1,"vertices":[],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"6a5740a5-7a6a-422d-87d2-02e335953f80","selector":"g:nth-child(1) > rect:nth-child(4)","port":"q"},"target":{"id":"63f5dd0d-5ebf-4616-b5a3-70f324f4925b","selector":"g:nth-child(1) > rect:nth-child(3)","port":"a"},"id":"8e114c90-ae4a-47ae-be9e-063d40550c98","z":22,"signal":1,"vertices":[],"attrs":{}}]}', '2017-04-10 06:53:52', '2017-04-20 02:38:33', 30, 'solution'),
(6, '{"cells":[{"type":"mylib.TUL_INV","size":{"width":50,"height":70},"position":{"x":455,"y":490},"angle":0,"id":"63f5dd0d-5ebf-4616-b5a3-70f324f4925b","z":1,"attrs":{}},{"type":"mylib.TUL_NAND","size":{"width":50,"height":70},"position":{"x":462,"y":294},"angle":0,"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","z":2,"attrs":{}},{"type":"mylib.TUL_NAND","size":{"width":50,"height":70},"position":{"x":441,"y":119},"angle":0,"id":"3b05f709-78f2-49fe-8daa-3a948ab846cc","z":3,"attrs":{}},{"type":"mylib.TUL_NAND","size":{"width":50,"height":70},"position":{"x":581,"y":210},"angle":0,"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","z":4,"attrs":{}},{"type":"mylib.TUL_NAND","size":{"width":50,"height":70},"position":{"x":721,"y":392},"angle":0,"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","z":5,"attrs":{}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":182,"y":287},"angle":0,"id":"1db7a20d-94cf-4cc9-9197-8e2032073768","z":6,"attrs":{}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":175,"y":336},"angle":0,"id":"1e5cdf1b-28eb-4f23-8261-bc0ff87985eb","z":7,"attrs":{".label":{"text":"X1"}}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":252,"y":406},"angle":0,"id":"6a5740a5-7a6a-422d-87d2-02e335953f80","z":8,"attrs":{".label":{"text":"X2"}}},{"type":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":889,"y":343},"angle":0,"id":"70d4e7ae-140f-4069-bd89-f0803f7734c1","z":9,"attrs":{}},{"type":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":952,"y":427},"angle":0,"id":"315d5dad-930b-4f70-8c16-498980ec0abf","z":10,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"3b05f709-78f2-49fe-8daa-3a948ab846cc","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","selector":"g:nth-child(1) > rect:nth-child(3)","port":"a"},"id":"6d57f672-281a-4990-a7ac-fabccbbd6a7f","z":11,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"3b05f709-78f2-49fe-8daa-3a948ab846cc","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"70d4e7ae-140f-4069-bd89-f0803f7734c1","selector":"g:nth-child(1) > rect:nth-child(4)","port":"a"},"id":"8c9a8d85-d0da-4e9d-8009-3f327d5d2166","z":12,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","selector":"g:nth-child(1) > rect:nth-child(3)","port":"a"},"id":"7b3997b6-1530-49c6-a0df-bee62e8b05d9","z":13,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"315d5dad-930b-4f70-8c16-498980ec0abf","selector":"g:nth-child(1) > rect:nth-child(4)","port":"a"},"id":"817914f9-b8b1-48a1-a2c4-c7baca6c8e46","z":14,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"63f5dd0d-5ebf-4616-b5a3-70f324f4925b","selector":"g:nth-child(1) > rect:nth-child(6)","port":"q"},"target":{"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","selector":"g:nth-child(1) > rect:nth-child(4)","port":"b"},"id":"2d0d0ae0-d69e-4433-99f5-bfafa3e2d947","z":15,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","selector":"g:nth-child(1) > rect:nth-child(4)","port":"b"},"id":"668b11b2-401f-465f-8d68-f71d713c5117","z":16,"signal":1,"attrs":{}},{"type":"mylib.RST","size":{"width":80,"height":120},"position":{"x":25,"y":25},"angle":0,"id":"94f4a0ee-16ab-4119-803d-bf79d3d92ad6","z":23,"attrs":{}},{"type":"mylib.RST","size":{"width":80,"height":120},"position":{"x":25,"y":25},"angle":0,"id":"9468ff95-eaa7-4901-abdb-9aaa0a94b55a","z":24,"attrs":{}},{"type":"mylib.MUX2","size":{"width":50,"height":70},"position":{"x":84,"y":497},"angle":0,"id":"c85e8df1-7e39-471b-b39e-f9cea53ff04c","z":25,"attrs":{}},{"type":"mylib.DEC18","size":{"width":100,"height":180},"position":{"x":1099,"y":140},"angle":0,"id":"dd7664e5-4796-438e-b174-cb8c2cc0d664","z":26,"attrs":{}},{"type":"mylib.ARAM4x16","size":{"width":100,"height":180},"position":{"x":952,"y":546},"angle":0,"id":"5af03d42-3be8-466b-b686-0f1299271308","z":27,"attrs":{}},{"type":"mylib.FULLADDER","size":{"width":80,"height":120},"position":{"x":1316,"y":476},"angle":0,"id":"87304f73-cae8-47d3-a928-67c008e7853a","z":28,"attrs":{}},{"type":"mylib.TUL_AND","size":{"width":50,"height":70},"position":{"x":238,"y":658},"angle":0,"id":"167c2818-09ae-431a-a778-2788d8f98d24","z":29,"attrs":{}},{"type":"mylib.TUL_AND","size":{"width":50,"height":70},"position":{"x":252,"y":777},"angle":0,"id":"50eab587-88ed-4fc1-ab17-cd9d80d39b3b","z":30,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"6a5740a5-7a6a-422d-87d2-02e335953f80","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"63f5dd0d-5ebf-4616-b5a3-70f324f4925b","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"e31eb708-9890-4c04-9449-a2d73b50d253","z":31,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1e5cdf1b-28eb-4f23-8261-bc0ff87985eb","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"30aeef7b-401c-4257-903e-00bd46d4984e","z":32,"signal":false,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1db7a20d-94cf-4cc9-9197-8e2032073768","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"22457d46-dc8b-4e05-92d8-8dfe602bf773","z":33,"signal":true,"attrs":{}}]}', '2017-04-02 18:26:20', '2017-05-28 09:50:43', 30, 'regular'),
(7, '{"cells":[{"type":"mylib.OUTPUT","exportType":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":966,"y":140},"angle":0,"id":"e9b3b21b-7079-4dbc-afe5-2d6c83851492","z":4,"attrs":{"custom":{"type":"OUTPUT","name":"Z","number":0,"uniqueName":"OUTPUT"}}},{"type":"mylib.OUTPUT","exportType":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":966,"y":294},"angle":0,"id":"71eb10fe-47c3-4e4b-8a07-cbff0aed82bb","z":5,"attrs":{".label":{"text":"Z1"},"custom":{"type":"OUTPUT","name":"Z","number":1,"uniqueName":"OUTPUT"}}},{"type":"mylib.INPUT","exportType":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":70,"y":238},"angle":0,"id":"0d3104cd-3296-41ea-849f-9d1b3a80b763","z":18,"attrs":{"custom":{"type":"INPUT","name":"X","number":0,"uniqueName":"INPUT"}}},{"type":"mylib.INPUT","exportType":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":42,"y":119},"angle":0,"id":"ed15ff79-aed7-4ab3-978f-389f2c6f07c1","z":20,"attrs":{".label":{"text":"X1"},"custom":{"type":"INPUT","name":"X","number":1,"uniqueName":"INPUT"}}},{"type":"mylib.INPUT","exportType":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":42,"y":350},"angle":0,"id":"cf0f2c0a-ecdc-4eb7-bcea-efc69476a73e","z":21,"attrs":{".label":{"text":"X2"},"custom":{"type":"INPUT","name":"X","number":2,"uniqueName":"INPUT"}}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"exportType":"mylib.Gate","position":{"x":637,"y":112},"angle":0,"id":"6a17d03c-ddc4-4e38-a6b1-e7b2734af4f9","z":22,"attrs":{"custom":{"type":"TUL_NAND","number":0,"uniqueName":"TUL_NAND_0","label":"NAND"}}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"exportType":"mylib.Gate","position":{"x":637,"y":273},"angle":0,"id":"2cf9e4d5-c2cb-4da4-8654-32fe4d4e13f8","z":23,"attrs":{"custom":{"type":"TUL_NAND","number":1,"uniqueName":"TUL_NAND_1","label":"NAND"}}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"exportType":"mylib.Gate","position":{"x":420,"y":119},"angle":0,"id":"822bb0c1-baa8-445c-8829-d1f396e1131c","z":28,"attrs":{"custom":{"type":"TUL_NAND","number":2,"uniqueName":"TUL_NAND_2","label":"NAND"}}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"822bb0c1-baa8-445c-8829-d1f396e1131c","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"6a17d03c-ddc4-4e38-a6b1-e7b2734af4f9","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"9619713b-6987-4c4f-b653-9235a0d8dd1b","z":29,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"ed15ff79-aed7-4ab3-978f-389f2c6f07c1","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"822bb0c1-baa8-445c-8829-d1f396e1131c","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"9e0287e0-6502-4acb-830f-3bb83e504749","z":30,"signal":true,"attrs":{}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"exportType":"mylib.Gate","position":{"x":406,"y":308},"angle":0,"id":"df033b02-bdef-4610-9376-f4da53dccd14","z":31,"attrs":{"custom":{"type":"TUL_NAND","number":3,"uniqueName":"TUL_NAND_3","label":"NAND"}}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"df033b02-bdef-4610-9376-f4da53dccd14","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"2cf9e4d5-c2cb-4da4-8654-32fe4d4e13f8","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"f5b883c5-05fa-4f81-8bf9-c7b183f416fe","z":32,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"cf0f2c0a-ecdc-4eb7-bcea-efc69476a73e","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"df033b02-bdef-4610-9376-f4da53dccd14","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"ab77e10e-e9f7-427d-be8f-f4942ac6b837","z":33,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"0d3104cd-3296-41ea-849f-9d1b3a80b763","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"df033b02-bdef-4610-9376-f4da53dccd14","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"af4fd70f-bc90-4443-9fd6-2fe6b20638f9","z":34,"signal":true,"vertices":[{"x":203,"y":266}],"attrs":{}},{"type":"mylib.TUL_INV","size":{"width":50,"height":70},"inPorts":["a"],"outPorts":["q"],"exportType":"mylib.Gate","position":{"x":245,"y":168},"angle":0,"id":"09316f32-29d4-4809-b1a2-af18f253aded","z":35,"attrs":{"custom":{"type":"TUL_INV","number":0,"uniqueName":"TUL_INV_0","label":"INV"}}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"0d3104cd-3296-41ea-849f-9d1b3a80b763","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"09316f32-29d4-4809-b1a2-af18f253aded","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"6e21224d-763c-4e42-81e8-bd55c9d5fbb0","z":36,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"09316f32-29d4-4809-b1a2-af18f253aded","selector":"g:nth-child(1) > circle:nth-child(6)","port":"q"},"target":{"id":"822bb0c1-baa8-445c-8829-d1f396e1131c","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"a573dcea-18aa-4e92-9fe0-56de5cf993c9","z":37,"signal":0,"attrs":{}},{"type":"mylib.TUL_BUF","size":{"width":50,"height":70},"inPorts":["a"],"outPorts":["q"],"exportType":"mylib.Gate","position":{"x":805,"y":119},"angle":0,"id":"464f47db-e1c8-438b-ac2c-0b9707144cff","z":39,"attrs":{"custom":{"type":"TUL_BUF","number":0,"uniqueName":"TUL_BUF_0","label":"Buffer"}}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"464f47db-e1c8-438b-ac2c-0b9707144cff","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"e9b3b21b-7079-4dbc-afe5-2d6c83851492","selector":"g:nth-child(1) > circle:nth-child(4)","port":"a"},"id":"725c18bb-dd72-4c28-891a-9f6902b6cdcc","z":40,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"6a17d03c-ddc4-4e38-a6b1-e7b2734af4f9","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"464f47db-e1c8-438b-ac2c-0b9707144cff","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"b9552b95-50b0-44a8-bbf4-f3d20a77a0b9","z":41,"signal":0,"attrs":{}},{"type":"mylib.TUL_BUF","size":{"width":50,"height":70},"inPorts":["a"],"outPorts":["q"],"exportType":"mylib.Gate","position":{"x":819,"y":280},"angle":0,"id":"c6ddebc3-37b4-4c3a-88da-3c4e6d5465c5","z":42,"attrs":{"custom":{"type":"TUL_BUF","number":1,"uniqueName":"TUL_BUF_1","label":"Buffer"}}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"c6ddebc3-37b4-4c3a-88da-3c4e6d5465c5","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"71eb10fe-47c3-4e4b-8a07-cbff0aed82bb","selector":"g:nth-child(1) > circle:nth-child(4)","port":"a"},"id":"9b55dd85-16dc-454a-8fb5-b5fdc5e3941a","z":43,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"2cf9e4d5-c2cb-4da4-8654-32fe4d4e13f8","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"c6ddebc3-37b4-4c3a-88da-3c4e6d5465c5","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"13dcacf3-746e-4d75-a40a-ba4a15da647a","z":44,"signal":1,"vertices":[{"x":756,"y":357}],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"2cf9e4d5-c2cb-4da4-8654-32fe4d4e13f8","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"6a17d03c-ddc4-4e38-a6b1-e7b2734af4f9","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"8e03cd4b-b359-4e0d-9d7f-eb8d253ecade","z":45,"signal":1,"vertices":[{"x":616,"y":238}],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"6a17d03c-ddc4-4e38-a6b1-e7b2734af4f9","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"2cf9e4d5-c2cb-4da4-8654-32fe4d4e13f8","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"ce98bae2-0e80-4e03-a418-9afbd6e0aa31","z":46,"signal":0,"vertices":[{"x":672,"y":217}],"attrs":{}}]}', '2017-04-02 16:27:03', '2017-08-30 09:16:49', 28, 'regular'),
(8, '{"cells":[{"type":"mylib.TUL_INV","size":{"width":50,"height":70},"inPorts":["a"],"outPorts":["q"],"position":{"x":483,"y":693},"angle":0,"id":"63f5dd0d-5ebf-4616-b5a3-70f324f4925b","z":1,"attrs":{}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"position":{"x":462,"y":294},"angle":0,"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","z":2,"attrs":{}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"position":{"x":224,"y":952},"angle":0,"id":"3b05f709-78f2-49fe-8daa-3a948ab846cc","z":3,"attrs":{}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"position":{"x":581,"y":210},"angle":0,"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","z":4,"attrs":{}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"position":{"x":721,"y":392},"angle":0,"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","z":5,"attrs":{}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":259,"y":546},"angle":0,"id":"1db7a20d-94cf-4cc9-9197-8e2032073768","z":6,"attrs":{}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":217,"y":721},"angle":0,"id":"1e5cdf1b-28eb-4f23-8261-bc0ff87985eb","z":7,"attrs":{".label":{"text":"X1"}}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":259,"y":301},"angle":0,"id":"6a5740a5-7a6a-422d-87d2-02e335953f80","z":8,"attrs":{".label":{"text":"X2"}}},{"type":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":889,"y":343},"angle":0,"id":"70d4e7ae-140f-4069-bd89-f0803f7734c1","z":9,"attrs":{}},{"type":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":952,"y":427},"angle":0,"id":"315d5dad-930b-4f70-8c16-498980ec0abf","z":10,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","selector":"g:nth-child(1) > rect:nth-child(3)","port":"a"},"id":"7b3997b6-1530-49c6-a0df-bee62e8b05d9","z":13,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1afa60e1-ff9b-4e74-a80e-3a1e17c79200","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"315d5dad-930b-4f70-8c16-498980ec0abf","selector":"g:nth-child(1) > rect:nth-child(4)","port":"a"},"id":"817914f9-b8b1-48a1-a2c4-c7baca6c8e46","z":14,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"63f5dd0d-5ebf-4616-b5a3-70f324f4925b","selector":"g:nth-child(1) > rect:nth-child(6)","port":"q"},"target":{"id":"9468ff95-eaa7-4901-abdb-9aaa0a94b55a","selector":"g:nth-child(1) > circle:nth-child(5)","port":"t"},"id":"2d0d0ae0-d69e-4433-99f5-bfafa3e2d947","z":15,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","selector":"g:nth-child(1) > rect:nth-child(7)","port":"q"},"target":{"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","selector":"g:nth-child(1) > rect:nth-child(4)","port":"b"},"id":"668b11b2-401f-465f-8d68-f71d713c5117","z":16,"signal":0,"attrs":{}},{"type":"mylib.RST","state":0,"size":{"width":80,"height":120},"inPorts":["r","s","t"],"outPorts":["q","qn"],"position":{"x":35,"y":238},"angle":0,"id":"94f4a0ee-16ab-4119-803d-bf79d3d92ad6","z":23,"attrs":{}},{"type":"mylib.RST","state":0,"size":{"width":80,"height":120},"inPorts":["r","s","t"],"outPorts":["q","qn"],"position":{"x":805,"y":567},"angle":0,"id":"9468ff95-eaa7-4901-abdb-9aaa0a94b55a","z":24,"attrs":{}},{"type":"mylib.MUX2","size":{"width":50,"height":70},"inPorts":["a0","a1","sel"],"outPorts":["q"],"position":{"x":84,"y":497},"angle":0,"id":"c85e8df1-7e39-471b-b39e-f9cea53ff04c","z":25,"attrs":{}},{"type":"mylib.DEC18","size":{"width":100,"height":180},"inPorts":["sel0","sel1","sel2"],"outPorts":["y0","y1","y2","y3","y4","y5","y6","y7"],"position":{"x":1099,"y":140},"angle":0,"id":"dd7664e5-4796-438e-b174-cb8c2cc0d664","z":26,"attrs":{}},{"type":"mylib.ARAM4x16","size":{"width":100,"height":180},"position":{"x":840,"y":791},"angle":0,"id":"5af03d42-3be8-466b-b686-0f1299271308","z":27,"attrs":{}},{"type":"mylib.FULLADDER","size":{"width":80,"height":120},"inPorts":["a","b","cin"],"outPorts":["s","cout"],"position":{"x":1316,"y":581},"angle":0,"id":"87304f73-cae8-47d3-a928-67c008e7853a","z":28,"attrs":{}},{"type":"mylib.TUL_AND","size":{"width":50,"height":70},"inPorts":["a","b"],"outPorts":["q"],"position":{"x":406,"y":518},"angle":0,"id":"167c2818-09ae-431a-a778-2788d8f98d24","z":29,"attrs":{}},{"type":"mylib.TUL_AND","size":{"width":50,"height":70},"inPorts":["a","b"],"outPorts":["q"],"position":{"x":399,"y":623},"angle":0,"id":"50eab587-88ed-4fc1-ab17-cd9d80d39b3b","z":30,"attrs":{}},{"type":"mylib.JKFFAR","size":{"width":80,"height":120},"inPorts":["j","k","clk","as","ar"],"outPorts":["q","qn"],"position":{"x":1197,"y":889},"angle":0,"id":"37546664-0d55-4b54-b26d-7ebe94799c01","z":41,"attrs":{}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":147,"y":637},"angle":0,"id":"0e46f9d5-6ab0-48f6-aae0-54f801c1d190","z":47,"attrs":{}},{"type":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":371,"y":917},"angle":0,"id":"c720ba34-e654-4bbe-b8d3-5be0de530049","z":49,"attrs":{}},{"type":"mylib.ADD4","size":{"width":100,"height":180},"inPorts":["a0","a1","a2","a3","b0","b1","b2","b3","cin","invb"],"outPorts":["s3","s2","s1","s0","cout"],"position":{"x":77,"y":707},"angle":0,"id":"a7480e8a-0628-4c71-8dd4-3fc43b6525bc","z":51,"attrs":{}},{"type":"mylib.MUL8","size":{"width":100,"height":180},"inPorts":["a0","a1","a2","a3","b0","b1","b2","b3","cin","invb"],"outPorts":["s7","s6","s5","s4","s3","s2","s1","s0"],"position":{"x":602,"y":791},"angle":0,"id":"9cd489c4-3fcf-40b0-884f-856875d4101c","z":69,"attrs":{}},{"type":"mylib.MUL8","size":{"width":100,"height":180},"inPorts":["a0","a1","a2","a3","b0","b1","b2","b3","cin","invb"],"outPorts":["s7","s6","s5","s4","s3","s2","s1","s0"],"position":{"x":25,"y":425},"angle":0,"id":"fce2097a-9b4b-4cb8-8c9e-9e40f1a221d0","z":86,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9cd489c4-3fcf-40b0-884f-856875d4101c","selector":"g:nth-child(1) > circle:nth-child(11)","port":"s7"},"target":{"id":"5af03d42-3be8-466b-b686-0f1299271308","selector":"g:nth-child(1) > circle:nth-child(4)","port":"we"},"id":"bff5296f-206d-4a7e-b3db-4b6a6ba77dec","z":87,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9cd489c4-3fcf-40b0-884f-856875d4101c","selector":"g:nth-child(1) > circle:nth-child(12)","port":"s6"},"target":{"id":"5af03d42-3be8-466b-b686-0f1299271308","selector":"g:nth-child(1) > circle:nth-child(5)","port":"a3"},"id":"074e2275-1b9c-4fcb-bba8-ee9748631ecd","z":88,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9cd489c4-3fcf-40b0-884f-856875d4101c","selector":"g:nth-child(1) > circle:nth-child(13)","port":"s5"},"target":{"id":"5af03d42-3be8-466b-b686-0f1299271308","selector":"g:nth-child(1) > circle:nth-child(6)","port":"a2"},"id":"9de597e2-90bd-4172-ae74-169544c12146","z":89,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9cd489c4-3fcf-40b0-884f-856875d4101c","selector":"g:nth-child(1) > circle:nth-child(14)","port":"s4"},"target":{"id":"5af03d42-3be8-466b-b686-0f1299271308","selector":"g:nth-child(1) > circle:nth-child(7)","port":"a1"},"id":"a24d7a01-374d-417f-9fbe-d1f789e36dc8","z":90,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9cd489c4-3fcf-40b0-884f-856875d4101c","selector":"g:nth-child(1) > circle:nth-child(15)","port":"s3"},"target":{"id":"5af03d42-3be8-466b-b686-0f1299271308","selector":"g:nth-child(1) > circle:nth-child(8)","port":"a0"},"id":"be67ed7d-82ea-43bd-9cea-46a5edabc968","z":91,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9cd489c4-3fcf-40b0-884f-856875d4101c","selector":"g:nth-child(1) > circle:nth-child(16)","port":"s2"},"target":{"id":"5af03d42-3be8-466b-b686-0f1299271308","selector":"g:nth-child(1) > circle:nth-child(9)","port":"d3"},"id":"8dfeeede-1e52-4d2b-8432-abb090a2355f","z":92,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9cd489c4-3fcf-40b0-884f-856875d4101c","selector":"g:nth-child(1) > circle:nth-child(17)","port":"s1"},"target":{"id":"5af03d42-3be8-466b-b686-0f1299271308","selector":"g:nth-child(1) > circle:nth-child(10)","port":"d2"},"id":"39b04d50-b7b2-4752-a145-47be74e33ebd","z":93,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9cd489c4-3fcf-40b0-884f-856875d4101c","selector":"g:nth-child(1) > circle:nth-child(18)","port":"s0"},"target":{"id":"5af03d42-3be8-466b-b686-0f1299271308","selector":"g:nth-child(1) > circle:nth-child(11)","port":"d1"},"id":"8a70b9e8-faa2-44a3-b448-62b3991f5bd0","z":94,"signal":0,"attrs":{}},{"type":"mylib.MUL8","size":{"width":100,"height":180},"inPorts":["a0","a1","a2","a3","b0","b1","b2","b3","cin","invb"],"outPorts":["s7","s6","s5","s4","s3","s2","s1","s0"],"position":{"x":25,"y":425},"angle":0,"id":"03de1a3d-5cc2-476e-a52b-33ea90ba3f61","z":100,"attrs":{}},{"type":"mylib.RST","state":0,"size":{"width":80,"height":120},"inPorts":["r","s","t"],"outPorts":["q","qn"],"position":{"x":182,"y":168},"angle":0,"id":"b268e884-f25a-4a86-9024-b97599ee0f2f","z":101,"attrs":{}},{"type":"mylib.RST","state":0,"size":{"width":80,"height":120},"inPorts":["r","s","t"],"outPorts":["q","qn"],"position":{"x":581,"y":553},"angle":0,"id":"55f97004-18b1-448b-b7bb-ea192602924a","z":102,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1e5cdf1b-28eb-4f23-8261-bc0ff87985eb","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"63f5dd0d-5ebf-4616-b5a3-70f324f4925b","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"a19e3785-9120-4516-b1c9-ca641a3384c2","z":103,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"6a5740a5-7a6a-422d-87d2-02e335953f80","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"d79d462e-242a-4792-b3f5-269e13998255","z":104,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"6a5740a5-7a6a-422d-87d2-02e335953f80","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"07d42134-5d72-460b-89aa-e89ca5fe0b6f","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"e29f678f-5f53-4716-b046-46b57966ac64","z":105,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1e5cdf1b-28eb-4f23-8261-bc0ff87985eb","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"55f97004-18b1-448b-b7bb-ea192602924a","selector":"g:nth-child(1) > circle:nth-child(5)","port":"t"},"id":"e9ef6ea3-1331-4d75-85c7-fd5c4c7aa48f","z":108,"signal":true,"vertices":[{"x":455,"y":609}],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"1db7a20d-94cf-4cc9-9197-8e2032073768","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"167c2818-09ae-431a-a778-2788d8f98d24","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"5d64381c-4947-49b4-b838-4bbead450abf","z":114,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"0e46f9d5-6ab0-48f6-aae0-54f801c1d190","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"50eab587-88ed-4fc1-ab17-cd9d80d39b3b","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"dcd64bc6-ced2-4347-a8db-3abfb44cc62a","z":120,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"167c2818-09ae-431a-a778-2788d8f98d24","selector":"g:nth-child(1) > circle:nth-child(5)","port":"q"},"target":{"id":"55f97004-18b1-448b-b7bb-ea192602924a","selector":"g:nth-child(1) > circle:nth-child(3)","port":"r"},"id":"0ba14cda-fedd-4e59-b99a-3806fbe8f4af","z":121,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"50eab587-88ed-4fc1-ab17-cd9d80d39b3b","selector":"g:nth-child(1) > circle:nth-child(5)","port":"q"},"target":{"id":"55f97004-18b1-448b-b7bb-ea192602924a","selector":"g:nth-child(1) > circle:nth-child(4)","port":"s"},"id":"0dd85d27-8dce-45f6-990b-2d30fec31d80","z":122,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"55f97004-18b1-448b-b7bb-ea192602924a","selector":"g:nth-child(1) > circle:nth-child(6)","port":"q"},"target":{"id":"9468ff95-eaa7-4901-abdb-9aaa0a94b55a","selector":"g:nth-child(1) > circle:nth-child(3)","port":"r"},"id":"785490af-cbd8-4bf5-8327-4f0e901460bb","z":123,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"55f97004-18b1-448b-b7bb-ea192602924a","selector":"g:nth-child(1) > circle:nth-child(7)","port":"qn"},"target":{"id":"9468ff95-eaa7-4901-abdb-9aaa0a94b55a","selector":"g:nth-child(1) > circle:nth-child(4)","port":"s"},"id":"82e543a4-638a-4c99-a97e-3983b77df5eb","z":124,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9468ff95-eaa7-4901-abdb-9aaa0a94b55a","selector":"g:nth-child(1) > circle:nth-child(6)","port":"q"},"target":{"id":"87304f73-cae8-47d3-a928-67c008e7853a","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"e7756569-2164-4d66-9228-e64c46d17dea","z":125,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9468ff95-eaa7-4901-abdb-9aaa0a94b55a","selector":"g:nth-child(1) > circle:nth-child(7)","port":"qn"},"target":{"id":"87304f73-cae8-47d3-a928-67c008e7853a","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"5d022d3e-6da8-4911-b145-a81f467e84ad","z":126,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9468ff95-eaa7-4901-abdb-9aaa0a94b55a","selector":"g:nth-child(1) > circle:nth-child(7)","port":"qn"},"target":{"id":"167c2818-09ae-431a-a778-2788d8f98d24","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"2d111936-0b14-4a87-9d05-6f793ef9d3d0","z":127,"signal":1,"vertices":[{"x":987,"y":637},{"x":616,"y":497}],"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"9468ff95-eaa7-4901-abdb-9aaa0a94b55a","selector":"g:nth-child(1) > circle:nth-child(6)","port":"q"},"target":{"id":"50eab587-88ed-4fc1-ab17-cd9d80d39b3b","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"01a34a93-7a78-465f-90ca-b35d1d3f0d4f","z":128,"signal":0,"vertices":[{"x":826,"y":777}],"attrs":{}},{"type":"mylib.RST","state":0,"size":{"width":80,"height":120},"inPorts":["r","s","t"],"outPorts":["q","qn"],"position":{"x":399,"y":63},"angle":0,"id":"7263db99-4173-407a-baaf-165d6fef4b9d","z":129,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"7263db99-4173-407a-baaf-165d6fef4b9d","selector":"g:nth-child(1) > circle:nth-child(6)","port":"q"},"target":{"id":"617c3d8b-bbde-4a8a-9ac3-60c0b30d3dcf","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"9638890f-142c-429a-80e9-b7f886a06518","z":130,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"7263db99-4173-407a-baaf-165d6fef4b9d","selector":"g:nth-child(1) > circle:nth-child(7)","port":"qn"},"target":{"id":"70d4e7ae-140f-4069-bd89-f0803f7734c1","selector":"g:nth-child(1) > circle:nth-child(4)","port":"a"},"id":"d02b9862-bcb3-4ec5-8911-637b6f11ba2f","z":131,"signal":0,"attrs":{}}]}', '2017-05-28 17:25:10', '2017-06-13 09:09:48', 30, 'regular'),
(9, '{"cells":[{"type":"mylib.OUTPUT","exportType":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":931,"y":77},"angle":0,"id":"dcb0d235-1be8-4ae7-9d2c-ba115178223e","z":133,"attrs":{"custom":{"type":"OUTPUT","name":"Z","number":0,"uniqueName":"Z0","label":"OUTPUT"}}},{"type":"mylib.OUTPUT","exportType":"mylib.OUTPUT","size":{"width":50,"height":28},"position":{"x":959,"y":245},"angle":0,"id":"46916c5b-40f5-4675-9617-4b3bb0b3388f","z":134,"attrs":{".label":{"text":"Z1"},"custom":{"type":"OUTPUT","name":"Z","number":1,"uniqueName":"Z1","label":"OUTPUT"}}},{"type":"mylib.INPUT","exportType":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":70,"y":119},"angle":0,"id":"e5029a38-062f-4706-bfcf-3b5dbe966602","z":135,"attrs":{"custom":{"type":"INPUT","name":"X","number":0,"uniqueName":"X0","label":"INPUT"}}},{"type":"mylib.INPUT","exportType":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":77,"y":301},"angle":0,"id":"e364e5c9-5e06-4e4f-88c6-285fcab1e8ff","z":136,"attrs":{".label":{"text":"X1"},"custom":{"type":"INPUT","name":"X","number":1,"uniqueName":"X1","label":"INPUT"}}},{"type":"mylib.INPUT","exportType":"mylib.INPUT","size":{"width":50,"height":28},"position":{"x":119,"y":217},"angle":0,"id":"e9af088b-dae1-4d1d-a86e-32db24f73fbb","z":137,"attrs":{".label":{"text":"X2"},"custom":{"type":"INPUT","name":"X","number":2,"uniqueName":"X2","label":"INPUT"}}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"exportType":"mylib.Gate","position":{"x":693,"y":105},"angle":0,"id":"4a6618b6-3d75-404f-9072-076370c4b116","z":138,"attrs":{"custom":{"type":"TUL_NAND","number":0,"uniqueName":"TUL_NAND_0","label":"NAND"}}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"exportType":"mylib.Gate","position":{"x":725,"y":268},"angle":0,"id":"3bba9e0e-21b3-446b-b80b-743c223b9061","z":139,"attrs":{"custom":{"type":"TUL_NAND","number":1,"uniqueName":"TUL_NAND_1","label":"NAND"}}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"exportType":"mylib.Gate","position":{"x":455,"y":98},"angle":0,"id":"159f8a63-dd1c-46fa-a0dd-c007e8a418c6","z":140,"attrs":{"custom":{"type":"TUL_NAND","number":2,"uniqueName":"TUL_NAND_2","label":"NAND"}}},{"type":"mylib.TUL_NAND","inPorts":["a","b"],"outPorts":["q"],"size":{"width":50,"height":70},"exportType":"mylib.Gate","position":{"x":455,"y":280},"angle":0,"id":"f148d74f-c1c1-466f-afb3-6a51334541b0","z":141,"attrs":{"custom":{"type":"TUL_NAND","number":3,"uniqueName":"TUL_NAND_3","label":"NAND"}}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"3bba9e0e-21b3-446b-b80b-743c223b9061","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"46916c5b-40f5-4675-9617-4b3bb0b3388f","selector":"g:nth-child(1) > circle:nth-child(4)","port":"a"},"id":"928f8935-f612-4b96-ac73-e1b0c42f1a56","z":144,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"e9af088b-dae1-4d1d-a86e-32db24f73fbb","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"159f8a63-dd1c-46fa-a0dd-c007e8a418c6","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"03f5bd87-b9b4-4908-be80-2c9bf129eb52","z":148,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"e9af088b-dae1-4d1d-a86e-32db24f73fbb","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"f148d74f-c1c1-466f-afb3-6a51334541b0","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"90da8351-fa12-46c8-8265-59077c152655","z":149,"signal":true,"attrs":{}},{"type":"mylib.TUL_AND","size":{"width":50,"height":70},"inPorts":["a","b"],"outPorts":["q"],"exportType":"mylib.Gate","position":{"x":240,"y":92},"angle":0,"id":"493b1c53-3492-4c41-85ae-41cfd68c4ae6","z":150,"attrs":{"custom":{"type":"TUL_AND","number":2,"uniqueName":"TUL_AND_2","label":"AND"}}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"e5029a38-062f-4706-bfcf-3b5dbe966602","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"493b1c53-3492-4c41-85ae-41cfd68c4ae6","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"4c789209-6f02-42a3-a260-72b35f0bb7b5","z":151,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"493b1c53-3492-4c41-85ae-41cfd68c4ae6","selector":"g:nth-child(1) > circle:nth-child(5)","port":"q"},"target":{"id":"159f8a63-dd1c-46fa-a0dd-c007e8a418c6","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"dbdd9e26-790e-48ae-9464-716a0943abd6","z":152,"signal":1,"attrs":{}},{"type":"mylib.TUL_AND","size":{"width":50,"height":70},"inPorts":["a","b"],"outPorts":["q"],"exportType":"mylib.Gate","position":{"x":252,"y":294},"angle":0,"id":"c0f9ff97-35be-4d47-92eb-ee2a1fb51bd3","z":153,"attrs":{"custom":{"type":"TUL_AND","number":3,"uniqueName":"TUL_AND_3","label":"AND"}}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"e364e5c9-5e06-4e4f-88c6-285fcab1e8ff","selector":"g:nth-child(1) > circle:nth-child(4)","port":"q"},"target":{"id":"c0f9ff97-35be-4d47-92eb-ee2a1fb51bd3","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"15fbc580-627b-450a-bd3e-a100cd373140","z":154,"signal":true,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"c0f9ff97-35be-4d47-92eb-ee2a1fb51bd3","selector":"g:nth-child(1) > circle:nth-child(5)","port":"q"},"target":{"id":"f148d74f-c1c1-466f-afb3-6a51334541b0","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"37014867-a085-46fd-80cc-0e9b726dafb1","z":155,"signal":1,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"159f8a63-dd1c-46fa-a0dd-c007e8a418c6","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"4a6618b6-3d75-404f-9072-076370c4b116","selector":"g:nth-child(1) > circle:nth-child(3)","port":"a"},"id":"7da7fa91-0051-4cb2-989b-865e87e9f003","z":161,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"f148d74f-c1c1-466f-afb3-6a51334541b0","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"3bba9e0e-21b3-446b-b80b-743c223b9061","selector":"g:nth-child(1) > circle:nth-child(4)","port":"b"},"id":"0be3d871-7c52-4af6-9c3e-74c30189180b","z":162,"signal":0,"attrs":{}},{"type":"mylib.Vodic","router":{"name":"orthogonal"},"connector":{"name":"rounded","args":{"radius":10}},"source":{"id":"4a6618b6-3d75-404f-9072-076370c4b116","selector":"g:nth-child(1) > circle:nth-child(7)","port":"q"},"target":{"id":"dcb0d235-1be8-4ae7-9d2c-ba115178223e","selector":"g:nth-child(1) > circle:nth-child(4)","port":"a"},"id":"437e3ce1-afe9-42b1-a6f5-211bbb8c43cc","z":164,"signal":1,"attrs":{}}]}', '2017-08-25 14:06:03', '2017-08-30 12:13:16', 30, 'regular');

-- --------------------------------------------------------

--
-- Struktura tabulky `solution`
--

CREATE TABLE `solution` (
  `id` int(11) NOT NULL,
  `homework_id` int(11) NOT NULL,
  `schema_id` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('done','waiting') COLLATE latin2_czech_cs NOT NULL DEFAULT 'waiting',
  `test_result` tinyint(1) DEFAULT NULL,
  `test_message` text COLLATE latin2_czech_cs,
  `vhdl` text COLLATE latin2_czech_cs NOT NULL,
  `name` varchar(50) COLLATE latin2_czech_cs NOT NULL,
  `architecture` varchar(50) COLLATE latin2_czech_cs NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `solution`
--

INSERT INTO `solution` (`id`, `homework_id`, `schema_id`, `created`, `status`, `test_result`, `test_message`, `vhdl`, `name`, `architecture`) VALUES
(14, 2, 28, '2017-08-30 15:20:31', 'waiting', NULL, NULL, 'library IEEE;\r\nuse IEEE.std_logic_1164.all;\r\n\r\nentity schema_01 is\r\n	port (\r\n		X0 : in std_logic; --[70;238]\r\n		X1 : in std_logic; --[42;119]\r\n		X2 : in std_logic; --[42;350]\r\n		Z0 : out std_logic; --[966;140]\r\n		Z1 : out std_logic --[966;294]\r\n	);\r\nend entity schema_01;\r\n\r\narchitecture architecture_ABC of schema_01 is\r\n	signal q_TUL_NAND_0 : std_logic;\r\n	signal q_TUL_NAND_1 : std_logic;\r\n	signal q_TUL_NAND_2 : std_logic;\r\n	signal q_TUL_NAND_3 : std_logic;\r\n	signal q_TUL_INV_0 : std_logic;\r\n\r\nbegin\r\n	NAND_0 : entity work.TUL_NAND --[637;112]\r\n	port map(a => q_TUL_NAND_2, b => q_TUL_NAND_1, q => q_TUL_NAND_0);\r\n\r\n	NAND_1 : entity work.TUL_NAND --[637;273]\r\n	port map(b => q_TUL_NAND_3, a => q_TUL_NAND_0, q => q_TUL_NAND_1);\r\n\r\n	NAND_2 : entity work.TUL_NAND --[420;119]\r\n	port map(a => X1, b => q_TUL_INV_0, q => q_TUL_NAND_2);\r\n\r\n	NAND_3 : entity work.TUL_NAND --[406;308]\r\n	port map(b => X2, a => X0, q => q_TUL_NAND_3);\r\n\r\n	INV_0 : entity work.TUL_INV --[245;168]\r\n	port map(a => X0, q => q_TUL_INV_0);\r\n\r\n	Buffer_0 : entity work.TUL_BUF --[805;119]\r\n	port map(a => q_TUL_NAND_0, q => Z0);\r\n\r\n	Buffer_1 : entity work.TUL_BUF --[819;280]\r\n	port map(a => q_TUL_NAND_1, q => Z1);\r\n\r\nend architecture architecture_ABC;\r\n\r\n', '', ''),
(15, 2, 30, '2017-08-30 15:20:33', 'done', 1, 'V pořádku', 'library IEEE;\r\nuse IEEE.std_logic_1164.all;\r\n\r\nentity schema_02_s is\r\n	port (\r\n		X0 : in std_logic; --[70;119]\r\n		X1 : in std_logic; --[77;301]\r\n		X2 : in std_logic; --[119;217]\r\n		Z0 : out std_logic; --[931;77]\r\n		Z1 : out std_logic --[959;245]\r\n	);\r\nend entity schema_02_s;\r\n\r\narchitecture arch_1 of schema_02_s is\r\n	signal q_TUL_NAND_2 : std_logic;\r\n	signal q_TUL_NAND_3 : std_logic;\r\n	signal q_TUL_AND_2 : std_logic;\r\n	signal q_TUL_AND_3 : std_logic;\r\n\r\nbegin\r\n	NAND_0 : entity work.TUL_NAND --[693;105]\r\n	port map(a => q_TUL_NAND_2, q => Z0);\r\n\r\n	NAND_1 : entity work.TUL_NAND --[725;268]\r\n	port map(b => q_TUL_NAND_3, q => Z1);\r\n\r\n	NAND_2 : entity work.TUL_NAND --[455;98]\r\n	port map(b => X2, a => q_TUL_AND_2, q => q_TUL_NAND_2);\r\n\r\n	NAND_3 : entity work.TUL_NAND --[455;280]\r\n	port map(a => X2, b => q_TUL_AND_3, q => q_TUL_NAND_3);\r\n\r\n	AND_2 : entity work.TUL_AND --[240;92]\r\n	port map(b => X0, q => q_TUL_AND_2);\r\n\r\n	AND_3 : entity work.TUL_AND --[252;294]\r\n	port map(a => X1, q => q_TUL_AND_3);\r\n\r\nend architecture arch_1;\r\n\r\n', '', ''),
(16, 2, 28, '2017-08-31 08:40:48', 'waiting', NULL, NULL, 'library IEEE;\r\nuse IEEE.std_logic_1164.all;\r\n\r\nentity schema_01 is\r\n	port (\r\n		X0 : in std_logic; --[70;238]\r\n		X1 : in std_logic; --[42;119]\r\n		X2 : in std_logic; --[42;350]\r\n		Z0 : out std_logic; --[966;140]\r\n		Z1 : out std_logic --[966;294]\r\n	);\r\nend entity schema_01;\r\n\r\narchitecture architecture_ABC of schema_01 is\r\n	signal q_TUL_NAND_0 : std_logic;\r\n	signal q_TUL_NAND_1 : std_logic;\r\n	signal q_TUL_NAND_2 : std_logic;\r\n	signal q_TUL_NAND_3 : std_logic;\r\n	signal q_TUL_INV_0 : std_logic;\r\n\r\nbegin\r\n	NAND_0 : entity work.TUL_NAND --[637;112]\r\n	port map(a => q_TUL_NAND_2, b => q_TUL_NAND_1, q => q_TUL_NAND_0);\r\n\r\n	NAND_1 : entity work.TUL_NAND --[637;273]\r\n	port map(b => q_TUL_NAND_3, a => q_TUL_NAND_0, q => q_TUL_NAND_1);\r\n\r\n	NAND_2 : entity work.TUL_NAND --[420;119]\r\n	port map(a => X1, b => q_TUL_INV_0, q => q_TUL_NAND_2);\r\n\r\n	NAND_3 : entity work.TUL_NAND --[406;308]\r\n	port map(b => X2, a => X0, q => q_TUL_NAND_3);\r\n\r\n	INV_0 : entity work.TUL_INV --[245;168]\r\n	port map(a => X0, q => q_TUL_INV_0);\r\n\r\n	Buffer_0 : entity work.TUL_BUF --[805;119]\r\n	port map(a => q_TUL_NAND_0, q => Z0);\r\n\r\n	Buffer_1 : entity work.TUL_BUF --[819;280]\r\n	port map(a => q_TUL_NAND_1, q => Z1);\r\n\r\nend architecture architecture_ABC;\r\n\r\n', '', '');

-- --------------------------------------------------------

--
-- Struktura tabulky `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `student_id` varchar(11) COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `student`
--

INSERT INTO `student` (`id`, `user_id`, `student_id`, `created`) VALUES
(8, 4, 'M14000184', '2017-04-07 14:22:59'),
(9, 1, 'M10000208', '2017-04-07 14:22:59');

-- --------------------------------------------------------

--
-- Struktura tabulky `tag`
--

CREATE TABLE `tag` (
  `name` varchar(120) COLLATE latin2_czech_cs NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `tag_task`
--

CREATE TABLE `tag_task` (
  `task_id` int(11) NOT NULL,
  `tag_id` varchar(120) COLLATE latin2_czech_cs NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `name` varchar(150) COLLATE latin2_czech_cs NOT NULL,
  `description` text COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `task`
--

INSERT INTO `task` (`id`, `teacher_id`, `name`, `description`, `created`) VALUES
(1, 9, 'zadání 123', 'jak mám popsat co se má dělat?', '2017-04-07 14:52:35'),
(2, 9, 'Testovací zadání', 'Popis testovacího zadání', '2017-08-01 14:20:38'),
(21, 9, 'zadání 1', 'asfs saf as ', '2017-08-25 13:20:37'),
(22, 9, 'Píďalka', 'popis zadání iut ku', '2017-08-25 13:59:41'),
(24, 10, 'Zadání další', 'a sfd asdf sadf sadf', '2017-08-25 14:38:11');

-- --------------------------------------------------------

--
-- Struktura tabulky `task_files`
--

CREATE TABLE `task_files` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `file` varchar(255) COLLATE latin2_czech_cs NOT NULL,
  `name` varchar(255) COLLATE latin2_czech_cs NOT NULL,
  `type` varchar(60) COLLATE latin2_czech_cs NOT NULL DEFAULT 'normal'
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `task_files`
--

INSERT INTO `task_files` (`id`, `task_id`, `file`, `name`, `type`) VALUES
(8, 1, '../soubory/task_1/normal/schema.png', 'adsf', 'normal'),
(10, 2, '../soubory/task_2/normal/33444.jpg', 'test', 'normal'),
(14, 1, '../soubory/task_1/normal/bp-ukazka.png', 'název', 'normal'),
(15, 22, '../soubory/task_22/etalon/SOG.jpg', 'název', 'etalon'),
(16, 22, '../soubory/task_22/test/WP_20170624_18_03_08_Pro_LI.jpg', 'sadf', 'test');

-- --------------------------------------------------------

--
-- Struktura tabulky `teacher`
--

CREATE TABLE `teacher` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `teacher_id` varchar(10) COLLATE latin2_czech_cs NOT NULL,
  `ustav` varchar(30) COLLATE latin2_czech_cs DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `teacher`
--

INSERT INTO `teacher` (`id`, `user_id`, `teacher_id`, `ustav`, `created`) VALUES
(9, 3, 'M1000042U', NULL, '2017-04-07 14:21:42'),
(10, 2, '', 'Nevim', '2017-08-25 14:37:26');

-- --------------------------------------------------------

--
-- Struktura tabulky `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `mail` varchar(256) COLLATE latin2_czech_cs NOT NULL,
  `name` varchar(100) COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type_uctu` enum('guest','student','teacher') COLLATE latin2_czech_cs NOT NULL DEFAULT 'guest',
  `password` varchar(256) COLLATE latin2_czech_cs DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

--
-- Vypisuji data pro tabulku `user`
--

INSERT INTO `user` (`id`, `mail`, `name`, `created`, `type_uctu`, `password`) VALUES
(1, 'tjerice@seznam.cz', 'Tomáš Václavík', '2017-04-07 08:28:35', 'guest', NULL),
(2, 'omacka@seznam.cz', 'Jan Omáčka', '2017-04-07 08:28:35', 'guest', NULL),
(3, 'martin.rozkovec@tul.cz', 'Martin', '2017-04-07 12:19:49', 'teacher', NULL),
(4, 'tomas.vaclavik@tul.cz', 'Tomáš', '2017-04-07 12:19:49', 'student', NULL);

--
-- Klíče pro exportované tabulky
--

--
-- Klíče pro tabulku `entities`
--
ALTER TABLE `entities`
  ADD PRIMARY KEY (`id_entity`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `id_cat` (`id_cat`);

--
-- Klíče pro tabulku `entity_cat`
--
ALTER TABLE `entity_cat`
  ADD PRIMARY KEY (`id_cat`);

--
-- Klíče pro tabulku `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_teacher_key` (`teacher`) USING BTREE;

--
-- Klíče pro tabulku `group_assigment`
--
ALTER TABLE `group_assigment`
  ADD PRIMARY KEY (`group_id`,`student_id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Klíče pro tabulku `hw_assigment`
--
ALTER TABLE `hw_assigment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `student_id_2` (`student_id`);

--
-- Klíče pro tabulku `schema_base`
--
ALTER TABLE `schema_base`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Klíče pro tabulku `schema_data`
--
ALTER TABLE `schema_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schema_id` (`schema_id`);

--
-- Klíče pro tabulku `solution`
--
ALTER TABLE `solution`
  ADD PRIMARY KEY (`id`),
  ADD KEY `homework_id` (`homework_id`),
  ADD KEY `schema_id` (`schema_id`);

--
-- Klíče pro tabulku `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `student_id` (`user_id`);

--
-- Klíče pro tabulku `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`name`);

--
-- Klíče pro tabulku `tag_task`
--
ALTER TABLE `tag_task`
  ADD PRIMARY KEY (`task_id`,`tag_id`),
  ADD KEY `fk_tag_task_tag` (`tag_id`);

--
-- Klíče pro tabulku `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Klíče pro tabulku `task_files`
--
ALTER TABLE `task_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

--
-- Klíče pro tabulku `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id_2` (`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Klíče pro tabulku `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `entities`
--
ALTER TABLE `entities`
  MODIFY `id_entity` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT pro tabulku `entity_cat`
--
ALTER TABLE `entity_cat`
  MODIFY `id_cat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT pro tabulku `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
--
-- AUTO_INCREMENT pro tabulku `hw_assigment`
--
ALTER TABLE `hw_assigment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pro tabulku `schema_base`
--
ALTER TABLE `schema_base`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT pro tabulku `schema_data`
--
ALTER TABLE `schema_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT pro tabulku `solution`
--
ALTER TABLE `solution`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT pro tabulku `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT pro tabulku `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT pro tabulku `task_files`
--
ALTER TABLE `task_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT pro tabulku `teacher`
--
ALTER TABLE `teacher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT pro tabulku `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `fk_group_teacher` FOREIGN KEY (`teacher`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Omezení pro tabulku `group_assigment`
--
ALTER TABLE `group_assigment`
  ADD CONSTRAINT `fk_goup_assigment_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_goup_assigment_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Omezení pro tabulku `hw_assigment`
--
ALTER TABLE `hw_assigment`
  ADD CONSTRAINT `fk_hw_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  ADD CONSTRAINT `fk_hw_task_id` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`);

--
-- Omezení pro tabulku `schema_base`
--
ALTER TABLE `schema_base`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Omezení pro tabulku `schema_data`
--
ALTER TABLE `schema_data`
  ADD CONSTRAINT `fk_data_schema_id` FOREIGN KEY (`schema_id`) REFERENCES `schema_base` (`id`);

--
-- Omezení pro tabulku `solution`
--
ALTER TABLE `solution`
  ADD CONSTRAINT `fk_solution_hw_id` FOREIGN KEY (`homework_id`) REFERENCES `hw_assigment` (`id`),
  ADD CONSTRAINT `fk_solution_schema_id` FOREIGN KEY (`schema_id`) REFERENCES `schema_base` (`id`);

--
-- Omezení pro tabulku `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `fk_student_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Omezení pro tabulku `tag_task`
--
ALTER TABLE `tag_task`
  ADD CONSTRAINT `fk_tag_task_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`name`),
  ADD CONSTRAINT `fk_tag_task_task` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`);

--
-- Omezení pro tabulku `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `fk_task_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`);

--
-- Omezení pro tabulku `task_files`
--
ALTER TABLE `task_files`
  ADD CONSTRAINT `task_id_fk` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`);

--
-- Omezení pro tabulku `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `fk_teacher_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
