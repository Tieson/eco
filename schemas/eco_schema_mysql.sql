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

INSERT INTO `entities` (`id_entity`, `id_cat`, `name`, `label`, `architecture`, `vhdl`, `inputs_count`, `active`) VALUES
(2, 2, 'TUL_BUF', 'Buffer', 'RTL', 'library ieee;\nuse ieee.std_logic_1164.all;\n\nentity TUL_BUF is\n	port(\n		a : in  std_logic;\n		q : out std_logic\n	);\nend entity TUL_BUF;\n\narchitecture RTL of TUL_BUF is\nbegin\n	q <= a;\n\nend architecture RTL;', 1, 1),
(3, 2, 'TUL_INV', 'INV', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_INV is\r\n	port(\r\n		a : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_INV;\r\n\r\narchitecture RTL of TUL_INV is\r\nbegin\r\n	q <= not a;\r\n\r\nend architecture RTL;', 1, 1),
(4, 2, 'TUL_AND', 'AND', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_AND is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_AND;\r\n\r\narchitecture RTL of TUL_AND is\r\nbegin\r\n	q <= a and b;\r\n\r\nend architecture RTL;', 2, 1),
(5, 2, 'TUL_OR', 'OR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_OR is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\n\n		q : out std_logic\r\n	);\r\nend entity TUL_OR;\r\n\r\narchitecture RTL of TUL_OR is\r\nbegin\r\n	q <= a or b;\r\n\r\nend architecture RTL;', 2, 1),
(6, 2, 'TUL_NAND', 'NAND', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_NAND is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_NAND;\r\n\r\narchitecture RTL of TUL_NAND is\r\nbegin\r\n	q <= not (a and b);\r\n\r\nend architecture RTL;', 2, 1),
(7, 2, 'TUL_NOR', 'NOR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_NOR is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_NOR;\r\n\r\narchitecture RTL of TUL_NOR is\r\nbegin\r\n	q <= not (a or b);\r\n\r\nend architecture RTL;', 2, 1),
(8, 2, 'TUL_XOR', 'XOR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_XOR is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_XOR;\r\n\r\narchitecture RTL of TUL_XOR is\r\nbegin\r\n	q <= a xor b;\r\n\r\nend architecture RTL;', 2, 1),
(9, 2, 'TUL_XNOR', 'XNOR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity TUL_XNOR is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity TUL_XNOR;\r\n\r\narchitecture RTL of TUL_XNOR is\r\nbegin\r\n	q <= not (a xor b);\r\n\r\nend architecture RTL;', 2, 0),
(10, 2, 'NAND3', 'NAND3', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity NAND3 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		q : out std_logic\r\n	);\n\nend entity NAND3;\r\n\r\narchitecture RTL of NAND3 is\r\nbegin\r\n	q <= not (a and b and c);\r\n\r\nend architecture RTL;', -1, 1),
(11, 2, 'AND3', 'AND3', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity AND3 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity AND3;\r\n\r\narchitecture RTL of AND3 is\r\nbegin\r\n	q <= a and b and c;\r\n\r\nend architecture RTL;', -1, 1),
(12, 2, 'OR3', 'OR3', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity OR3 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity OR3;\r\n\r\narchitecture RTL of OR3 is\r\nbegin\r\n	q <= not (a or b or c);\r\n\r\nend architecture RTL;', -1, 1),
(13, 2, 'NAND4', 'NAND4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity NAND4 is\n\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		d : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity NAND4;\r\n\r\narchitecture RTL of NAND4 is\r\nbegin\r\n	q <= not (a and b and c and d);\r\n\r\nend architecture RTL;', -1, 1),
(14, 2, 'AND4', 'AND4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity AND4 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		d : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity AND4;\r\n\r\narchitecture RTL of AND4 is\r\nbegin\r\n	q <= a and b and c and d;\r\n\r\nend architecture RTL;', 4, 1),
(15, 2, 'NOR4', 'NOR4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity NOR4 is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		c : in  std_logic;\r\n		d : in  std_logic;\r\n		q : out std_logic\r\n	);\r\nend entity NOR4;\r\n\r\narchitecture RTL of NOR4 is\r\nbegin\r\n	q <= not (a or b or c or d);\r\n\n\nend architecture RTL;', -1, 1),
(16, 3, 'MUX2', 'MUX2', 'RTL', 'use ieee.std_logic_1164.all;\r\n\r\nentity MUX2 is\r\n	port(\r\n		a0  : in  std_logic;\r\n		a1  : in  std_logic;\r\n		sel : in  std_logic;\r\n		q   : out std_logic\r\n	);\r\nend entity MUX2;\r\n\r\narchitecture RTL of MUX2 is\r\nbegin\r\n	q <= a0 when sel = \'0\' else a1;\r\n\r\nend architecture RTL;', -1, 1),
(17, 3, 'MUX4', 'MUX4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity MUX4 is\r\n	port(\r\n		a0   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a3   : in  std_logic;\r\n		sel0 : in  std_logic;\r\n		sel1 : in  std_logic;\r\n		q    : out std_logic\r\n	);\r\nend entity MUX4;\r\n\r\narchitecture RTL of MUX4 is\r\n	signal sel : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	sel <= sel1 & sel0;\r\n\r\n	mx : process(sel, a0, a1, a2, a3)\r\n	begin\r\n		case sel is\r\n			when "00" =>\r\n				q <= a0;\r\n			when "01" =>\r\n				q <= a1;\r\n			when "10" =>\r\n				q <= a2;\r\n			when others =>\r\n				q <= a3;\r\n		end case;\r\n	end process;\r\n\r\nend architecture RTL;', -1, 1),
(18, 3, 'MUX8', 'MUX8', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity MUX8 is\r\n	port(\r\n		a0   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a3   : in  std_logic;\r\n		a4   : in  std_logic;\r\n		a5   : in  std_logic;\r\n		a6   : in  std_logic;\r\n		a7   : in  std_logic;\r\n		sel0 : in  std_logic;\r\n		sel1 : in  std_logic;\r\n		sel2 : in  std_logic;\r\n		q    : out std_logic\r\n	);\r\nend entity MUX8;\r\n\r\narchitecture RTL of MUX8 is\r\n	signal sel : std_logic_vector(2 downto 0);\r\n\r\nbegin\r\n	sel <= sel2 & sel1 & sel0;\r\n\r\n	mx : process(sel, a0, a1, a2, a3, a4, a5, a6, a7)\r\n	begin\r\n		case sel is\r\n			when "000" =>\r\n				q <= a0;\r\n			when "001" =>\r\n				q <= a1;\r\n			when "010" =>\r\n				q <= a2;\r\n			when "011" =>\r\n				q <= a3;\r\n			when "100" =>\r\n				q <= a4;\r\n			when "101" =>\r\n				q <= a5;\r\n			when "110" =>\r\n				q <= a6;\r\n			when others =>\r\n				q <= a7;\r\n		end case;\r\n	end process;\r\n\r\nend architecture RTL;', -1, 1),
(19, 3, 'DEC14', 'DEC14', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DEC14 is\r\n	port(\r\n		sel0 : in  std_logic;\r\n		sel1 : in  std_logic;\r\n		y0   : out std_logic;\r\n		y1   : out std_logic;\r\n		y2   : out std_logic;\r\n		y3   : out std_logic\r\n	);\r\nend entity DEC14;\r\n\r\narchitecture RTL of DEC14 is\r\n	signal y   : std_logic_vector(3 downto 0);\r\n	signal sel : std_logic_vector(1 downto 0);\r\nbegin\r\n	sel <= sel1 & sel0;\r\n\r\n	dec : process(sel)\r\n	begin\r\n		case sel is\r\n			when "00" =>\r\n				y <= "0001";\r\n			when "01" =>\r\n				y <= "0010";\r\n			when "10" =>\r\n				y <= "0100";\r\n			when others =>\r\n				y <= "1000";\r\n		end case;\r\n	end process;\r\n\r\n	y0 <= y(0);\r\n	y1 <= y(1);\r\n	y2 <= y(2);\r\n	y3 <= y(3);\r\n\r\nend architecture RTL;', -1, 1),
(20, 3, 'DEC18', 'DEC18', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DEC18 is\r\n	port(\r\n		sel0 : in  std_logic;\r\n		sel1 : in  std_logic;\r\n		sel2 : in  std_logic;\r\n		y0   : out std_logic;\r\n		y1   : out std_logic;\r\n		y2   : out std_logic;\r\n		y3   : out std_logic;\r\n		y4   : out std_logic;\r\n		y5   : out std_logic;\r\n		y6   : out std_logic;\r\n		y7   : out std_logic\r\n	);\r\nend entity DEC18;\r\n\r\narchitecture RTL of DEC18 is\r\n	signal y   : std_logic_vector(7 downto 0);\r\n	signal sel : std_logic_vector(2 downto 0);\r\nbegin\r\n	sel <= sel2 & sel1 & sel0;\r\n\r\n	dec : process(sel)\r\n	begin\r\n		case sel is\r\n			when "000" =>\r\n				y <= "00000001";\r\n			when "001" =>\r\n				y <= "00000010";\r\n			when "010" =>\r\n				y <= "00000100";\r\n			when "011" =>\r\n				y <= "00001000";\r\n			when "100" =>\r\n				y <= "00010000";\r\n			when "101" =>\r\n				y <= "00100000";\r\n			when "110" =>\r\n				y <= "01000000";\r\n			when others =>\r\n				y <= "10000000";\r\n		end case;\r\n	end process;\r\n\r\n	y0 <= y(0);\r\n	y1 <= y(1);\r\n	y2 <= y(2);\r\n	y3 <= y(3);\r\n	y4 <= y(4);\r\n	y5 <= y(5);\r\n	y6 <= y(6);\r\n	y7 <= y(7);\r\n\r\nend architecture RTL;', -1, 1),
(21, 3, 'PRIOCOD42', 'Prioritní kodér 42', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity PRIOCOD42 is\r\n	port(\r\n		a0 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a3 : in  std_logic;\r\n		q0 : out std_logic;\r\n		q1 : out std_logic;\r\n		v  : out std_logic\r\n	);\r\nend entity PRIOCOD42;\r\n\r\narchitecture RTL of PRIOCOD42 is\r\n	signal q : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	process(a3, a2, a1, a0)\r\n	begin\r\n		v <= \'1\';\r\n		if a0 = \'1\' then\r\n			q <= "00";\r\n		elsif a1 = \'1\' then\r\n			q <= "01";\r\n		elsif a2 = \'1\' then\r\n			q <= "10";\r\n		elsif a3 = \'1\' then\r\n			q <= "11";\r\n		else\r\n			q <= "00";\r\n			v <= \'0\';\r\n		end if;\r\n	end process;\r\n\r\n	q0 <= q(0);\r\n	q1 <= q(1);\r\n\r\nend architecture RTL;', -1, 1),
(22, 3, 'PRIOCOD83', 'Prioritní kodér 83', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity PRIOCOD83 is\r\n	port(\r\n		a0 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a3 : in  std_logic;\r\n		a4 : in  std_logic;\r\n		a5 : in  std_logic;\r\n		a6 : in  std_logic;\r\n		a7 : in  std_logic;\r\n		q0 : out std_logic;\r\n		q1 : out std_logic;\r\n		q2 : out std_logic;\r\n		v  : out std_logic\r\n	);\r\nend entity PRIOCOD83;\r\n\r\narchitecture RTL of PRIOCOD83 is\r\n	signal q : std_logic_vector(2 downto 0);\r\n\r\nbegin\r\n	process(a7, a6, a5, a4, a3, a2, a1, a0)\r\n	begin\r\n		v <= \'1\';\r\n		if a0 = \'1\' then\r\n			q <= "000";\r\n		elsif a1 = \'1\' then\r\n			q <= "001";\r\n		elsif a2 = \'1\' then\r\n			q <= "010";\r\n		elsif a3 = \'1\' then\r\n			q <= "011";\r\n		elsif a4 = \'1\' then\r\n			q <= "100";\r\n		elsif a5 = \'1\' then\r\n			q <= "101";\r\n		elsif a6 = \'1\' then\r\n			q <= "110";\r\n		elsif a7 = \'1\' then\r\n			q <= "111";\r\n		else\r\n			q <= "000";\r\n			v <= \'0\';\r\n		end if;\r\n	end process;\r\n\r\n	q0 <= q(0);\r\n	q1 <= q(1);\r\n	q2 <= q(2);\r\n\r\nend architecture RTL;', -1, 1),
(23, 4, 'RS', 'RS', 'RTL', 'use ieee.std_logic_1164.all;\r\n\r\nentity RS is\r\n	port(\r\n		r  : in  std_logic;\r\n		s  : in  std_logic;\r\n		q  : out std_logic;\r\n		qn : out std_logic\r\n	);\r\nend entity RS;\r\n\r\narchitecture RTL of RS is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(r, qn_int)\r\n	begin\r\n		q_int <= not (r or qn_int);\r\n	end process;\r\n\r\n	process(s, q_int)\r\n	begin\r\n		qn_int <= not (s or q_int);\r\n	end process;\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1, 1),
(24, 4, 'DL1', 'DL1', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DL1 is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DL1;\r\n\r\narchitecture RTL of DL1 is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(clk, d)\r\n	begin\r\n		if clk = \'1\' then\r\n			q_int <= d;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= q_int;\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1, 1),
(25, 4, 'DL1AR', 'DL1AR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DL1AR is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		ar  : in  std_logic;\r\n		as  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DL1AR;\r\n\r\narchitecture RTL of DL1AR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(clk, d, ar, as)\r\n	begin\r\n		if ar = \'1\' then\r\n			q_int <= \'0\';\r\n		elsif as = \'1\' then\r\n			q_int <= \'1\';\r\n		elsif clk = \'1\' then\r\n			q_int <= d;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= q_int;\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1, 1),
(26, 4, 'JKFF', 'JKFF', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity JKFF is\r\n	port(\r\n		j   : in  std_logic;\r\n		k   : in  std_logic;\r\n		clk : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity JKFF;\r\n\r\narchitecture RTL of JKFF is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\n	signal jk     : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	jk <= j & k;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			case jk is\r\n				when "10" =>\r\n					q_int <= \'1\';\r\n				when "01" =>\r\n					q_int <= \'0\';\r\n				when "11" =>\r\n					q_int <= not q_int;\r\n				when others =>\r\n					q_int <= q_int;\r\n			end case;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1, 1),
(27, 4, 'JKFFAR', 'JKFFAR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity JKFFAR is\r\n	port(\r\n		j   : in  std_logic;\r\n		k   : in  std_logic;\r\n		clk : in  std_logic;\r\n		as  : in  std_logic;\r\n		ar  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity JKFFAR;\r\n\r\narchitecture RTL of JKFFAR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\n	signal jk     : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	jk <= j & k;\r\n\r\n	process(as, ar, clk)\r\n	begin\r\n		if ar = \'1\' then\r\n			q_int <= \'0\';\r\n		elsif as = \'1\' then\r\n			q_int <= \'1\';\r\n		elsif rising_edge(clk) then\r\n			case jk is\r\n				when "10" =>\r\n					q_int <= \'1\';\r\n				when "01" =>\r\n					q_int <= \'0\';\r\n				when "11" =>\r\n					q_int <= not q_int;\r\n				when others =>\r\n					q_int <= q_int;\r\n			end case;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1, 1),
(28, 4, 'JKFFSR', 'JKFFSR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity JKFFSR is\r\n	port(\r\n		j   : in  std_logic;\r\n		k   : in  std_logic;\r\n		clk : in  std_logic;\r\n		ss  : in  std_logic;\r\n		sr  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity JKFFSR;\r\n\r\narchitecture RTL of JKFFSR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\n	signal jk     : std_logic_vector(1 downto 0);\r\n\r\nbegin\r\n	jk <= j & k;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if sr = \'1\' then\r\n				q_int <= \'0\';\r\n			elsif ss = \'1\' then\r\n				q_int <= \'1\';\r\n			else\r\n				case jk is\r\n					when "10" =>\r\n						q_int <= \'1\';\r\n					when "01" =>\r\n						q_int <= \'0\';\r\n					when "11" =>\r\n						q_int <= not q_int;\r\n					when others =>\r\n						q_int <= q_int;\r\n				end case;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1, 1),
(29, 4, 'DFF', 'DFF', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DFF is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DFF;\r\n\r\narchitecture RTL of DFF is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(clk)\n\n	begin\r\n		if rising_edge(clk) then\r\n			q_int <= d;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1, 1),
(30, 4, 'DFFAR', 'DFFAR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DFFAR is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		as  : in  std_logic;\n\n		ar  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DFFAR;\r\n\r\narchitecture RTL of DFFAR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(ar, as, clk)\r\n	begin\r\n		if ar = \'1\' then\r\n			q_int <= \'0\';\r\n		elsif as = \'1\' then\r\n			q_int <= \'1\';\r\n		elsif rising_edge(clk) then\r\n			q_int <= d;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1, 1),
(31, 4, 'DFFSR', 'DFFSR', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\n\r\nentity DFFSR is\r\n	port(\r\n		d   : in  std_logic;\r\n		clk : in  std_logic;\r\n		ss  : in  std_logic;\r\n		sr  : in  std_logic;\r\n		q   : out std_logic;\r\n		qn  : out std_logic\r\n	);\r\nend entity DFFSR;\r\n\r\narchitecture RTL of DFFSR is\r\n	signal q_int  : std_logic;\r\n	signal qn_int : std_logic;\r\nbegin\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if sr = \'1\' then\r\n				q_int <= \'0\';\r\n			elsif ss = \'1\' then\r\n				q_int <= \'1\';\r\n			else\r\n				q_int <= d;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	qn_int <= not (q_int);\r\n\r\n	q  <= q_int;\r\n	qn <= qn_int;\r\n\r\nend architecture;', -1, 1),
(32, 5, 'HALFADDER', 'HALFADDER', 'RTL', 'use ieee.std_logic_1164.all;\r\n\r\nentity HALFADDER is\r\n	port(\r\n		a : in  std_logic;\r\n		b : in  std_logic;\r\n		s : out std_logic;\r\n		c : out std_logic\r\n	);\r\nend entity HALFADDER;\r\n\r\narchitecture RTL of HALFADDER is\r\nbegin\r\n	s <= a xor b;\r\n	c <= a and b;\r\n\r\nend architecture RTL;', -1, 1),
(33, 5, 'FULLADDER', 'FULLADDER', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity FULLADDER is\r\n	port(\r\n		a    : in  std_logic;\r\n		b    : in  std_logic;\r\n		cin  : in  std_logic;\r\n		s    : out std_logic;\r\n		cout : out std_logic\r\n	);\r\nend entity FULLADDER;\r\n\r\narchitecture RTL of FULLADDER is\r\n	signal sum_int : unsigned(1 downto 0);\r\n	signal a_int   : unsigned(1 downto 0);\r\n	signal b_int   : unsigned(1 downto 0);\r\n	signal c_int   : unsigned(1 downto 0);\r\n\r\nbegin\r\n	a_int <= "0" & a;\r\n	b_int <= "0" & b;\r\n	c_int <= "0" & cin;\r\n\r\n	sum_int <= a_int + b_int + c_int;\r\n	s       <= sum_int(0);\r\n	cout    <= sum_int(1);\r\n\r\nend architecture RTL;', -1, 1),
(34, 5, 'ADD4', 'ADD4', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity ADD4 is\r\n	port(\r\n		a3   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a0   : in  std_logic;\r\n		b3   : in  std_logic;\r\n		b2   : in  std_logic;\r\n		b1   : in  std_logic;\r\n		b0   : in  std_logic;\r\n		cin  : in  std_logic;\r\n		invb : in  std_logic;\r\n		s3   : out std_logic;\r\n		s2   : out std_logic;\r\n		s1   : out std_logic;\r\n		s0   : out std_logic;\r\n		cout : out std_logic\r\n	);\r\nend entity ADD4;\r\n\r\narchitecture RTL of ADD4 is\r\n	signal sum_int : unsigned(4 downto 0);\r\n	signal a       : unsigned(4 downto 0);\r\n	signal b       : unsigned(4 downto 0);\r\n	signal c       : unsigned(4 downto 0);\r\n\r\nbegin\r\n	a <= "0" & a3 & a2 & a1 & a0;\r\n	b <= "0" & b3 & b2 & b1 & b0 when invb = \'0\' else "0" & not (b3) & not (b2) & not (b1) & not (b0);\r\n	c <= "0000" & cin;\r\n\r\n	sum_int <= a + b + c;\r\n\r\n	s3   <= sum_int(3);\r\n	s2   <= sum_int(2);\r\n	s1   <= sum_int(1);\r\n	s0   <= sum_int(0);\r\n	cout <= sum_int(4);\r\n\r\nend architecture RTL;', -1, 1),
(35, 5, 'MUL8', 'MUL8', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\n\nentity MUL8 is\r\n	port(\r\n		a3 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a0 : in  std_logic;\r\n		b3 : in  std_logic;\r\n		b2 : in  std_logic;\r\n		b1 : in  std_logic;\r\n		b0 : in  std_logic;\r\n		s7 : out std_logic;\r\n		s6 : out std_logic;\r\n		s5 : out std_logic;\r\n		s4 : out std_logic;\r\n		s3 : out std_logic;\r\n		s2 : out std_logic;\r\n		s1 : out std_logic;\r\n		s0 : out std_logic\r\n	);\r\nend entity MUL8;\r\n\r\narchitecture RTL of MUL8 is\r\n	signal a : signed(3 downto 0);\r\n	signal b : signed(3 downto 0);\r\n	signal s : signed(7 downto 0);\r\n\r\nbegin\r\n	a <= a3 & a2 & a1 & a0;\r\n	b <= b3 & b2 & b1 & b0;\r\n\r\n	s  <= a * b;\r\n	s7 <= s(7);\r\n	s6 <= s(6);\r\n	s5 <= s(5);\r\n	s4 <= s(4);\r\n	s3 <= s(3);\r\n	s2 <= s(2);\r\n	s1 <= s(1);\r\n	s0 <= s(0);\r\n\r\nend architecture RTL;', -1, 1),
(36, 5, 'COMPARATORLEQ', 'COMPARATORLEQ', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity COMPARATORLEQ is\r\n	port(\r\n		a3   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a0   : in  std_logic;\r\n		b3   : in  std_logic;\r\n		b2   : in  std_logic;\r\n		b1   : in  std_logic;\r\n		b0   : in  std_logic;\r\n		leq  : out std_logic;\r\n		leqn : out std_logic\r\n	);\r\nend entity COMPARATORLEQ;\r\n\r\narchitecture RTL of COMPARATORLEQ is\r\n	signal a       : signed(3 downto 0);\r\n	signal b       : signed(3 downto 0);\r\n	signal leq_int : std_logic;\n\n\r\nbegin\r\n	a <= a3 & a2 & a1 & a0;\r\n	b <= b3 & b2 & b1 & b0;\r\n\r\n	leq_int <= \'1\' when a <= b else \'0\';\r\n	leq     <= leq_int;\r\n	leqn    <= not (leq_int);\r\n\r\nend architecture RTL;', -1, 1),
(37, 6, 'UPDOWNCOUNTER', 'UPDOWNCOUNTER', 'RTL', 'use ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity UPDOWNCOUNTER is\r\n	port(\r\n		clk     : in  std_logic;\r\n		clk_en  : in  std_logic;\r\n		sreset  : in  std_logic;\r\n		spreset : in  std_logic;\r\n		a3      : in  std_logic;\r\n		a2      : in  std_logic;\r\n		a1      : in  std_logic;\r\n		a0      : in  std_logic;\r\n		down    : in  std_logic;\r\n		q3      : out std_logic;\r\n		q2      : out std_logic;\r\n		q1      : out std_logic;\r\n		q0      : out std_logic;\r\n		zero    : out std_logic;\r\n		match   : out std_logic\r\n	);\r\nend entity UPDOWNCOUNTER;\r\n\r\narchitecture RTL of UPDOWNCOUNTER is\r\n	signal cnt_reg : unsigned(3 downto 0);\r\n	signal a       : unsigned(3 downto 0);\r\n\r\nbegin\r\n	a <= a3 & a2 & a1 & a0;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if sreset = \'1\' then\r\n				cnt_reg <= (others => \'0\');\r\n			elsif spreset = \'1\' then\r\n				cnt_reg <= a3 & a2 & a1 & a0;\r\n			elsif clk_en = \'1\' then\r\n				if down = \'0\' then\r\n					cnt_reg <= cnt_reg - 1;\r\n				else\r\n					cnt_reg <= cnt_reg + 1;\r\n				end if;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	q3 <= cnt_reg(3);\r\n	q2 <= cnt_reg(2);\n\n	q1 <= cnt_reg(1);\r\n	q0 <= cnt_reg(0);\r\n\r\n	zero  <= \'1\' when cnt_reg = 0 else \'0\';\r\n	match <= \'1\' when cnt_reg = a else \'0\';\r\n\r\nend architecture RTL;', -1, 1),
(38, 6, 'ARAM1x16', 'ARAM1x16', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity ARAM1x16 is\r\n	port(\r\n		ce : in  std_logic;\r\n		we : in  std_logic;\r\n		a3 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a0 : in  std_logic;\r\n		d  : in  std_logic;\r\n		q  : out std_logic\r\n	);\r\nend entity ARAM1x16;\r\n\r\narchitecture RTL of ARAM1x16 is\r\n	type ram_type is array (15 downto 0) of std_logic;\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a3 & a2 & a1 & a0;\r\n\r\n	process(address, ce, we, d, ram_inst)\r\n	begin\r\n		if ce = \'1\' then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= d;\r\n			end if;\r\n			q <= ram_inst(to_integer(address));\r\n		else\r\n			q <= \'0\';\r\n		end if;\r\n	end process;\r\n\r\nend architecture RTL;', -1, 1),
(39, 6, 'ARAM4x16', 'ARAM4x16', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity ARAM4x16 is\r\n	port(\r\n		ce : in  std_logic;\r\n		we : in  std_logic;\r\n		a3 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a0 : in  std_logic;\r\n		d3 : in  std_logic;\n\n		d2 : in  std_logic;\r\n		d1 : in  std_logic;\r\n		d0 : in  std_logic;\r\n		q3 : out std_logic;\r\n		q2 : out std_logic;\r\n		q1 : out std_logic;\r\n		q0 : out std_logic\r\n	);\r\nend entity ARAM4x16;\r\n\r\narchitecture RTL of ARAM4x16 is\r\n	type ram_type is array (15 downto 0) of unsigned(3 downto 0);\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(3 downto 0);\r\n	signal din      : unsigned(3 downto 0);\r\n	signal dout     : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a3 & a2 & a1 & a0;\r\n	din     <= d3 & d2 & d1 & d0;\r\n\r\n	process(address, ce, we, din, ram_inst)\r\n	begin\r\n		if ce = \'1\' then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= din;\r\n			end if;\r\n			dout <= ram_inst(to_integer(address));\r\n		else\r\n			dout <= (others => \'0\');\r\n		end if;\r\n	end process;\r\n\r\n	q3 <= dout(3);\r\n	q2 <= dout(2);\r\n	q1 <= dout(1);\r\n	q0 <= dout(0);\r\n\r\nend architecture RTL;', -1, 1),
(40, 6, 'ARAM4x256', 'ARAM4x256', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity ARAM4x256 is\r\n	port(\r\n		ce : in  std_logic;\r\n		we : in  std_logic;\r\n		a7 : in  std_logic;\r\n		a6 : in  std_logic;\r\n		a5 : in  std_logic;\r\n		a4 : in  std_logic;\r\n		a3 : in  std_logic;\r\n		a2 : in  std_logic;\r\n		a1 : in  std_logic;\r\n		a0 : in  std_logic;\r\n		d3 : in  std_logic;\r\n		d2 : in  std_logic;\r\n		d1 : in  std_logic;\r\n		d0 : in  std_logic;\r\n		q3 : out std_logic;\r\n		q2 : out std_logic;\r\n		q1 : out std_logic;\r\n		q0 : out std_logic\r\n	);\r\nend entity ARAM4x256;\r\n\r\narchitecture RTL of ARAM4x256 is\r\n	type ram_type is array (255 downto 0) of unsigned(3 downto 0);\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(7 downto 0);\r\n	signal din      : unsigned(3 downto 0);\r\n	signal dout     : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a7 & a6 & a5 & a4 & a3 & a2 & a1 & a0;\r\n	din     <= d3 & d2 & d1 & d0;\r\n\r\n	process(address, ce, we, din, ram_inst)\r\n	begin\r\n		if ce = \'1\' then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= din;\r\n			end if;\r\n			dout <= ram_inst(to_integer(address));\r\n		else\r\n			dout <= (others => \'0\');\r\n		end if;\r\n	end process;\r\n\r\n	q3 <= dout(3);\r\n	q2 <= dout(2);\r\n	q1 <= dout(1);\r\n	q0 <= dout(0);\r\n\r\nend architecture RTL;', -1, 1),
(41, 6, 'RAM1x16', 'RAM1x16', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity RAM1x16 is\r\n	port(\r\n		clk : in  std_logic;\r\n		we  : in  std_logic;\r\n		a3  : in  std_logic;\r\n		a2  : in  std_logic;\r\n		a1  : in  std_logic;\r\n		a0  : in  std_logic;\r\n		d   : in  std_logic;\r\n		q   : out std_logic\r\n	);\r\nend entity RAM1x16;\r\n\r\narchitecture RTL of RAM1x16 is\r\n	type ram_type is array (15 downto 0) of std_logic;\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a3 & a2 & a1 & a0;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= d;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	q <= ram_inst(to_integer(address));\r\n\r\nend architecture RTL;', -1, 1),
(42, 6, 'RAM4x16', 'RAM4x16', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity RAM4x16 is\r\n	port(\r\n		clk : in  std_logic;\r\n		we  : in  std_logic;\r\n		a3  : in  std_logic;\r\n		a2  : in  std_logic;\r\n		a1  : in  std_logic;\r\n		a0  : in  std_logic;\r\n		d3  : in  std_logic;\r\n		d2  : in  std_logic;\r\n		d1  : in  std_logic;\r\n		d0  : in  std_logic;\r\n		q3  : out std_logic;\r\n		q2  : out std_logic;\r\n		q1  : out std_logic;\r\n		q0  : out std_logic\r\n	);\n\nend entity RAM4x16;\r\n\r\narchitecture RTL of RAM4x16 is\r\n	type ram_type is array (15 downto 0) of unsigned(3 downto 0);\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(3 downto 0);\r\n	signal din      : unsigned(3 downto 0);\r\n	signal dout     : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a3 & a2 & a1 & a0;\r\n	din     <= d3 & d2 & d1 & d0;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= din;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	dout <= ram_inst(to_integer(address));\r\n\r\n	q3 <= dout(3);\r\n	q2 <= dout(2);\r\n	q1 <= dout(1);\r\n	q0 <= dout(0);\r\n\r\nend architecture RTL;', -1, 1),
(43, 6, 'RAM4x256', 'RAM4x256', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.numeric_std.all;\r\n\r\nentity RAM4x256 is\r\n	port(\r\n		clk : in  std_logic;\r\n		we  : in  std_logic;\r\n		a7  : in  std_logic;\r\n		a6  : in  std_logic;\r\n		a5  : in  std_logic;\r\n		a4  : in  std_logic;\r\n		a3  : in  std_logic;\r\n		a2  : in  std_logic;\r\n		a1  : in  std_logic;\r\n		a0  : in  std_logic;\r\n		d3  : in  std_logic;\r\n		d2  : in  std_logic;\r\n		d1  : in  std_logic;\r\n		d0  : in  std_logic;\r\n		q3  : out std_logic;\r\n		q2  : out std_logic;\r\n		q1  : out std_logic;\r\n		q0  : out std_logic\r\n	);\r\nend entity RAM4x256;\r\n\r\narchitecture RTL of RAM4x256 is\r\n	type ram_type is array (255 downto 0) of unsigned(3 downto 0);\r\n	signal ram_inst : ram_type;\r\n	signal address  : unsigned(7 downto 0);\r\n	signal din      : unsigned(3 downto 0);\r\n	signal dout     : unsigned(3 downto 0);\r\n\r\nbegin\r\n	address <= a7 & a6 & a5 & a4 & a3 & a2 & a1 & a0;\r\n	din     <= d3 & d2 & d1 & d0;\r\n\r\n	process(clk)\r\n	begin\r\n		if rising_edge(clk) then\r\n			if we = \'1\' then\r\n				ram_inst(to_integer(address)) <= din;\r\n			end if;\r\n		end if;\r\n	end process;\r\n\r\n	dout <= ram_inst(to_integer(address));\r\n\r\n	q3 <= dout(3);\r\n	q2 <= dout(2);\r\n	q1 <= dout(1);\r\n	q0 <= dout(0);\r\n\r\nend architecture RTL;', -1, 1),
(44, 6, 'DPRAM4x256', 'DPRAM4x256', 'RTL', 'library ieee;\r\nuse ieee.std_logic_1164.all;\r\nuse ieee.std_logic_unsigned.all;\r\n\r\nentity DPRAM4x256 is\r\n	port(\r\n		aclk : in  std_logic;\r\n		awe  : in  std_logic;\r\n		bclk : in  std_logic;\r\n		bwe  : in  std_logic;\r\n		a7   : in  std_logic;\r\n		a6   : in  std_logic;\r\n		a5   : in  std_logic;\r\n		a4   : in  std_logic;\r\n		a3   : in  std_logic;\r\n		a2   : in  std_logic;\r\n		a1   : in  std_logic;\r\n		a0   : in  std_logic;\r\n		b7   : in  std_logic;\r\n		b6   : in  std_logic;\r\n		b5   : in  std_logic;\r\n		b4   : in  std_logic;\r\n		b3   : in  std_logic;\r\n		b2   : in  std_logic;\r\n		b1   : in  std_logic;\r\n		b0   : in  std_logic;\r\n		da3  : in  std_logic;\r\n		da2  : in  std_logic;\r\n		da1  : in  std_logic;\r\n		da0  : in  std_logic;\r\n		db3  : in  std_logic;\r\n		db2  : in  std_logic;\r\n		db1  : in  std_logic;\r\n		db0  : in  std_logic;\r\n		qa3  : out std_logic;\r\n		qa2  : out std_logic;\r\n		qa1  : out std_logic;\r\n		qa0  : out std_logic;\r\n		qb3  : out std_logic;\r\n		qb2  : out std_logic;\r\n		qb1  : out std_logic;\r\n		qb0  : out std_logic\r\n	);\r\nend entity DPRAM4x256;\r\n\r\narchitecture RTL of DPRAM4x256 is\r\n	type ram_type is array (255 downto 0) of std_logic_vector(3 downto 0);\r\n	shared variable ram_inst : ram_type;\r\n\r\n	signal address_a : std_logic_vector(7 downto 0);\r\n	signal address_b : std_logic_vector(7 downto 0);\r\n\r\n	signal dina : std_logic_vector(3 downto 0);\r\n	signal dinb : std_logic_vector(3 downto 0);\r\n\r\n	signal douta : std_logic_vector(3 downto 0);\r\n	signal doutb : std_logic_vector(3 downto 0);\r\n\r\nbegin\r\n	address_a <= a7 & a6 & a5 & a4 & a3 & a2 & a1 & a0;\r\n	address_b <= b7 & b6 & b5 & b4 & b3 & b2 & b1 & b0;\r\n\r\n	dina <= da3 & da2 & da1 & da0;\r\n	dinb <= db3 & db2 & db1 & db0;\r\n\r\n	process(aclk)\r\n	begin\r\n		if rising_edge(aclk) then\r\n			if awe = \'1\' then\r\n				ram_inst(CONV_INTEGER(address_a)) := dina;\r\n			end if;\r\n			douta <= ram_inst(CONV_INTEGER(address_a));\r\n		end if;\r\n	end process;\r\n\r\n	process(bclk)\r\n	begin\r\n		if rising_edge(bclk) then\r\n			if bwe = \'1\' then\r\n				ram_inst(CONV_INTEGER(address_b)) := dinb;\r\n			end if;\r\n			doutb <= ram_inst(CONV_INTEGER(address_b));\r\n		end if;\r\n	end process;\r\n\r\n	qa3 <= douta(3);\r\n	qa2 <= douta(2);\r\n	qa1 <= douta(1);\r\n	qa0 <= douta(0);\r\n\r\n	qb3 <= doutb(3);\r\n	qb2 <= doutb(2);\r\n	qb1 <= doutb(1);\r\n	qb0 <= doutb(0);\r\n\r\nend architecture RTL;', -1, 1),
(45, 1, 'INPUT', 'INPUT', '', '', -1, 1),
(46, 1, 'OUTPUT', 'OUTPUT', '', '', -1, 1),
(47, 1, 'CLK', 'clock', '', '', 0, 1);

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

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(30) COLLATE latin2_czech_cs NOT NULL,
  `day` enum('po','ut','st','ct','pa','so','ne') COLLATE latin2_czech_cs NOT NULL,
  `weeks` enum('both','odd','even') COLLATE latin2_czech_cs NOT NULL,
  `block` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `teacher` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_teacher_key` (`teacher`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `group_assigment`
--

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

CREATE TABLE IF NOT EXISTS `hw_assigment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deadline` timestamp DEFAULT NULL,
  `status` enum('open','done','failed') COLLATE latin2_czech_cs NOT NULL DEFAULT 'open',
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `student_id` (`student_id`),
  KEY `student_id_2` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `schema_base`
--

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

CREATE TABLE IF NOT EXISTS `schema_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` text COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `edited` timestamp DEFAULT NULL,
  `schema_id` int(11) DEFAULT NULL,
  `typ` enum('regular','solution') COLLATE latin2_czech_cs NOT NULL DEFAULT 'regular',
  PRIMARY KEY (`id`),
  KEY `schema_id` (`schema_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `solution`
--

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
-- Struktura tabulky `student`
--

CREATE TABLE IF NOT EXISTS `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `student_id` varchar(11) COLLATE latin2_czech_cs NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `student_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `tag`
--

CREATE TABLE IF NOT EXISTS `tag` (
  `name` varchar(120) COLLATE latin2_czech_cs NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `tag_task`
--

CREATE TABLE IF NOT EXISTS `tag_task` (
  `task_id` int(11) NOT NULL,
  `tag_id` varchar(120) COLLATE latin2_czech_cs NOT NULL,
  PRIMARY KEY (`task_id`,`tag_id`),
  KEY `fk_tag_task_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `task`
--

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
-- Struktura tabulky `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `teacher_id` varchar(10) COLLATE latin2_czech_cs NOT NULL,
  `ustav` varchar(30) COLLATE latin2_czech_cs DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_2` (`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

-- --------------------------------------------------------

--
-- Struktura tabulky `user`
--

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
  ADD CONSTRAINT `fk_data_schema_id` FOREIGN KEY (`schema_id`) REFERENCES `schema_base` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
