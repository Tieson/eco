------------------------------------------------------------------
-- BASIC GATES ---------------------------------------------------
------------------------------------------------------------------
-- BUF, INV, AND, NAND, OR, NOR, XOR, XNOR -----------------------
------------------------------------------------------------------

------------------------------------------------------------------
-- BUF gate ------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity BUF is
	port(
		a : in  std_logic;
		q : out std_logic
	);
end entity BUF;

architecture RTL of BUF is
begin
	q <= a;

end architecture RTL;

------------------------------------------------------------------
-- INV gate ------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;

entity INV is
	port(
		a : in  std_logic;
		q : out std_logic
	);
end entity INV;

architecture RTL of INV is
begin
	q <= not a;

end architecture RTL;

------------------------------------------------------------------
-- AND gate ------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity AND is
	port(
		a : in  std_logic;
		b : in  std_logic;
		q : out std_logic
	);
end entity AND;

architecture RTL of AND is
begin
	q <= a and b;

end architecture RTL;

------------------------------------------------------------------
-- OR gate -------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity OR is
	port(
		a : in  std_logic;
		b : in  std_logic;
		q : out std_logic
	);
end entity OR;

architecture RTL of OR is
begin
	q <= a or b;

end architecture RTL;

------------------------------------------------------------------
-- NAND gate -----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity NAND is
	port(
		a : in  std_logic;
		b : in  std_logic;
		q : out std_logic
	);
end entity NAND;

architecture RTL of NAND is
begin
	q <= not (a and b);

end architecture RTL;

------------------------------------------------------------------
-- NOR gate ------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity NOR is
	port(
		a : in  std_logic;
		b : in  std_logic;
		q : out std_logic
	);
end entity NOR;

architecture RTL of NOR is
begin
	q <= not (a or b);

end architecture RTL;

------------------------------------------------------------------
-- XOR gate ------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity XOR is
	port(
		a : in  std_logic;
		b : in  std_logic;
		q : out std_logic
	);
end entity XOR;

architecture RTL of XOR is
begin
	q <= a xor b;

end architecture RTL;

------------------------------------------------------------------
-- XNOR gate -----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity XNOR is
	port(
		a : in  std_logic;
		b : in  std_logic;
		q : out std_logic
	);
end entity XNOR;

architecture RTL of XNOR is
begin
	q <= not (a xor b);

end architecture RTL;

------------------------------------------------------------------
-- NAND3 gate ----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity NAND3 is
	port(
		a : in  std_logic;
		b : in  std_logic;
		c : in  std_logic;
		q : out std_logic
	);
end entity NAND3;

architecture RTL of NAND3 is
begin
	q <= not (a and b and c);

end architecture RTL;

------------------------------------------------------------------
-- AND3 gate -----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity AND3 is
	port(
		a : in  std_logic;
		b : in  std_logic;
		c : in  std_logic;
		q : out std_logic
	);
end entity AND3;

architecture RTL of AND3 is
begin
	q <= a and b and c;

end architecture RTL;

------------------------------------------------------------------
-- NOR3 gate -----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity OR3 is
	port(
		a : in  std_logic;
		b : in  std_logic;
		c : in  std_logic;
		q : out std_logic
	);
end entity OR3;

architecture RTL of OR3 is
begin
	q <= not (a or b or c);

end architecture RTL;

------------------------------------------------------------------
-- NAND4 gate ----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity NAND4 is
	port(
		a : in  std_logic;
		b : in  std_logic;
		c : in  std_logic;
		d : in  std_logic;
		q : out std_logic
	);
end entity NAND4;

architecture RTL of NAND4 is
begin
	q <= not (a and b and c and d);

end architecture RTL;

------------------------------------------------------------------
-- AND4 gate -----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity AND4 is
	port(
		a : in  std_logic;
		b : in  std_logic;
		c : in  std_logic;
		d : in  std_logic;
		q : out std_logic
	);
end entity AND4;

architecture RTL of AND4 is
begin
	q <= a and b and c and d;

end architecture RTL;

------------------------------------------------------------------
-- NOR4 gate ----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity NOR4 is
	port(
		a : in  std_logic;
		b : in  std_logic;
		c : in  std_logic;
		d : in  std_logic;
		q : out std_logic
	);
end entity NOR4;

architecture RTL of NOR4 is
begin
	q <= not (a or b or c or d);

end architecture RTL;

------------------------------------------------------------------
-- COMPLEX GATES -------------------------------------------------
------------------------------------------------------------------
-- MUX2, MUX4, DEC 1:4, DEC 1:8, PRIORITY CODER 8:3,4:2 ----------
------------------------------------------------------------------

------------------------------------------------------------------
-- MUX2 ----------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity MUX2 is
	port(
		a0  : in  std_logic;
		a1  : in  std_logic;
		sel : in  std_logic;
		q   : out std_logic
	);
end entity MUX2;

architecture RTL of MUX2 is
begin
	q <= a0 when sel = '0' else a1;

end architecture RTL;

------------------------------------------------------------------
-- MUX4 ----------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity MUX4 is
	port(
		a0   : in  std_logic;
		a1   : in  std_logic;
		a2   : in  std_logic;
		a3   : in  std_logic;
		sel0 : in  std_logic;
		sel1 : in  std_logic;
		q    : out std_logic
	);
end entity MUX4;

architecture RTL of MUX4 is
	signal sel : std_logic_vector(1 downto 0);

begin
	sel <= sel1 & sel0;

	mx : process(sel, a0, a1, a2, a3)
	begin
		case sel is
			when "00" =>
				q <= a0;
			when "01" =>
				q <= a1;
			when "10" =>
				q <= a2;
			when others =>
				q <= a3;
		end case;
	end process;

end architecture RTL;

------------------------------------------------------------------
-- MUX8 ----------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity MUX8 is
	port(
		a0   : in  std_logic;
		a1   : in  std_logic;
		a2   : in  std_logic;
		a3   : in  std_logic;
		a4   : in  std_logic;
		a5   : in  std_logic;
		a6   : in  std_logic;
		a7   : in  std_logic;
		sel0 : in  std_logic;
		sel1 : in  std_logic;
		sel2 : in  std_logic;
		q    : out std_logic
	);
end entity MUX8;

architecture RTL of MUX8 is
	signal sel : std_logic_vector(2 downto 0);

begin
	sel <= sel2 & sel1 & sel0;

	mx : process(sel, a0, a1, a2, a3, a4, a5, a6, a7)
	begin
		case sel is
			when "000" =>
				q <= a0;
			when "001" =>
				q <= a1;
			when "010" =>
				q <= a2;
			when "011" =>
				q <= a3;
			when "100" =>
				q <= a4;
			when "101" =>
				q <= a5;
			when "110" =>
				q <= a6;
			when others =>
				q <= a7;
		end case;
	end process;

end architecture RTL;

------------------------------------------------------------------
-- DEC1-4 --------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity DEC14 is
	port(
		sel0 : in  std_logic;
		sel1 : in  std_logic;
		y0   : out std_logic;
		y1   : out std_logic;
		y2   : out std_logic;
		y3   : out std_logic
	);
end entity DEC14;

architecture RTL of DEC14 is
	signal y   : std_logic_vector(3 downto 0);
	signal sel : std_logic_vector(1 downto 0);
begin
	sel <= sel1 & sel0;

	dec : process(sel)
	begin
		case sel is
			when "00" =>
				y <= "0001";
			when "01" =>
				y <= "0010";
			when "10" =>
				y <= "0100";
			when others =>
				y <= "1000";
		end case;
	end process;

	y0 <= y(0);
	y1 <= y(1);
	y2 <= y(2);
	y3 <= y(3);

end architecture RTL;

------------------------------------------------------------------
-- DEC1-8 --------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity DEC18 is
	port(
		sel0 : in  std_logic;
		sel1 : in  std_logic;
		sel2 : in  std_logic;
		y0   : out std_logic;
		y1   : out std_logic;
		y2   : out std_logic;
		y3   : out std_logic;
		y4   : out std_logic;
		y5   : out std_logic;
		y6   : out std_logic;
		y7   : out std_logic
	);
end entity DEC18;

architecture RTL of DEC18 is
	signal y   : std_logic_vector(7 downto 0);
	signal sel : std_logic_vector(2 downto 0);
begin
	sel <= sel2 & sel1 & sel0;

	dec : process(sel)
	begin
		case sel is
			when "000" =>
				y <= "00000001";
			when "001" =>
				y <= "00000010";
			when "010" =>
				y <= "00000100";
			when "011" =>
				y <= "00001000";
			when "100" =>
				y <= "00010000";
			when "101" =>
				y <= "00100000";
			when "110" =>
				y <= "01000000";
			when others =>
				y <= "10000000";
		end case;
	end process;

	y0 <= y(0);
	y1 <= y(1);
	y2 <= y(2);
	y3 <= y(3);
	y4 <= y(4);
	y5 <= y(5);
	y6 <= y(6);
	y7 <= y(7);

end architecture RTL;

------------------------------------------------------------------
-- PRIORITY CODER 4:2 --------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity PRIOCOD42 is
	port(
		a0 : in  std_logic;
		a1 : in  std_logic;
		a2 : in  std_logic;
		a3 : in  std_logic;
		q0 : out std_logic;
		q1 : out std_logic;
		v  : out std_logic
	);
end entity PRIOCOD42;

architecture RTL of PRIOCOD42 is
	signal q : std_logic_vector(1 downto 0);

begin
	process(a3, a2, a1, a0)
	begin
		v <= '1';
		if a0 = '1' then
			q <= "00";
		elsif a1 = '1' then
			q <= "01";
		elsif a2 = '1' then
			q <= "10";
		elsif a3 = '1' then
			q <= "11";
		else
			q <= "00";
			v <= '0';
		end if;
	end process;

	q0 <= q(0);
	q1 <= q(1);

end architecture RTL;

------------------------------------------------------------------
-- PRIORITY CODER 8:3 --------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity PRIOCOD83 is
	port(
		a0 : in  std_logic;
		a1 : in  std_logic;
		a2 : in  std_logic;
		a3 : in  std_logic;
		a4 : in  std_logic;
		a5 : in  std_logic;
		a6 : in  std_logic;
		a7 : in  std_logic;
		q0 : out std_logic;
		q1 : out std_logic;
		q2 : out std_logic;
		v  : out std_logic
	);
end entity PRIOCOD83;

architecture RTL of PRIOCOD83 is
	signal q : std_logic_vector(2 downto 0);

begin
	process(a7, a6, a5, a4, a3, a2, a1, a0)
	begin
		v <= '1';
		if a0 = '1' then
			q <= "000";
		elsif a1 = '1' then
			q <= "001";
		elsif a2 = '1' then
			q <= "010";
		elsif a3 = '1' then
			q <= "011";
		elsif a4 = '1' then
			q <= "100";
		elsif a5 = '1' then
			q <= "101";
		elsif a6 = '1' then
			q <= "110";
		elsif a7 = '1' then
			q <= "111";
		else
			q <= "000";
			v <= '0';
		end if;
	end process;

	q0 <= q(0);
	q1 <= q(1);
	q2 <= q(2);

end architecture RTL;

------------------------------------------------------------------
-- SEQUENTIAL GATES ----------------------------------------------
------------------------------------------------------------------
-- RS, DL1, DLAR, JKFF, JKFFSR, JKFFAR, DFF, DFFSR, DFFAR --------
------------------------------------------------------------------

------------------------------------------------------------------
-- RS ------------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity RS is
	port(
		r  : in  std_logic;
		s  : in  std_logic;
		q  : out std_logic;
		qn : out std_logic
	);
end entity RS;

architecture RTL of RS is
	signal q_int  : std_logic;
	signal qn_int : std_logic;
begin
	process(r, qn_int)
	begin
		q_int <= not (r or qn_int);
	end process;

	process(s, q_int)
	begin
		qn_int <= not (s or q_int);
	end process;

	q  <= q_int;
	qn <= qn_int;

end architecture;

------------------------------------------------------------------
-- D type Latch 1 transparent ------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity DL1 is
	port(
		d   : in  std_logic;
		clk : in  std_logic;
		q   : out std_logic;
		qn  : out std_logic
	);
end entity DL1;

architecture RTL of DL1 is
	signal q_int  : std_logic;
	signal qn_int : std_logic;
begin
	process(clk, d)
	begin
		if clk = '1' then
			q_int <= d;
		end if;
	end process;

	qn_int <= q_int;

	q  <= q_int;
	qn <= qn_int;

end architecture;

------------------------------------------------------------------
-- D type Latch 1 transparent, asynchronous reset ----------------

library ieee;
use ieee.std_logic_1164.all;

entity DL1AR is
	port(
		d   : in  std_logic;
		clk : in  std_logic;
		ar  : in  std_logic;
		as  : in  std_logic;
		q   : out std_logic;
		qn  : out std_logic
	);
end entity DL1AR;

architecture RTL of DL1AR is
	signal q_int  : std_logic;
	signal qn_int : std_logic;
begin
	process(clk, d, ar, as)
	begin
		if ar = '1' then
			q_int <= '0';
		elsif as = '1' then
			q_int <= '1';
		elsif clk = '1' then
			q_int <= d;
		end if;
	end process;

	qn_int <= q_int;

	q  <= q_int;
	qn <= qn_int;

end architecture;

------------------------------------------------------------------
-- JK type Flip Flop (rising edge sensitive) ---------------------

library ieee;
use ieee.std_logic_1164.all;

entity JKFF is
	port(
		j   : in  std_logic;
		k   : in  std_logic;
		clk : in  std_logic;
		q   : out std_logic;
		qn  : out std_logic
	);
end entity JKFF;

architecture RTL of JKFF is
	signal q_int  : std_logic;
	signal qn_int : std_logic;
	signal jk     : std_logic_vector(1 downto 0);

begin
	jk <= j & k;

	process(clk)
	begin
		if rising_edge(clk) then
			case jk is
				when "10" =>
					q_int <= '1';
				when "01" =>
					q_int <= '0';
				when "11" =>
					q_int <= not q_int;
				when others =>
					q_int <= q_int;
			end case;
		end if;
	end process;

	qn_int <= not (q_int);

	q  <= q_int;
	qn <= qn_int;

end architecture;

------------------------------------------------------------------
-- JK type Flip Flop (rising edge) with async set&reset ---------- 

library ieee;
use ieee.std_logic_1164.all;

entity JKFFAR is
	port(
		j   : in  std_logic;
		k   : in  std_logic;
		clk : in  std_logic;
		as  : in  std_logic;
		ar  : in  std_logic;
		q   : out std_logic;
		qn  : out std_logic
	);
end entity JKFFAR;

architecture RTL of JKFFAR is
	signal q_int  : std_logic;
	signal qn_int : std_logic;
	signal jk     : std_logic_vector(1 downto 0);

begin
	jk <= j & k;

	process(as, ar, clk)
	begin
		if ar = '1' then
			q_int <= '0';
		elsif as = '1' then
			q_int <= '1';
		elsif rising_edge(clk) then
			case jk is
				when "10" =>
					q_int <= '1';
				when "01" =>
					q_int <= '0';
				when "11" =>
					q_int <= not q_int;
				when others =>
					q_int <= q_int;
			end case;
		end if;
	end process;

	qn_int <= not (q_int);

	q  <= q_int;
	qn <= qn_int;

end architecture;

------------------------------------------------------------------
-- JK type Flip Flop (rising edge) with sync set&reset ----------- 

library ieee;
use ieee.std_logic_1164.all;

entity JKFFSR is
	port(
		j   : in  std_logic;
		k   : in  std_logic;
		clk : in  std_logic;
		ss  : in  std_logic;
		sr  : in  std_logic;
		q   : out std_logic;
		qn  : out std_logic
	);
end entity JKFFSR;

architecture RTL of JKFFSR is
	signal q_int  : std_logic;
	signal qn_int : std_logic;
	signal jk     : std_logic_vector(1 downto 0);

begin
	jk <= j & k;

	process(clk)
	begin
		if rising_edge(clk) then
			if sr = '1' then
				q_int <= '0';
			elsif ss = '1' then
				q_int <= '1';
			else
				case jk is
					when "10" =>
						q_int <= '1';
					when "01" =>
						q_int <= '0';
					when "11" =>
						q_int <= not q_int;
					when others =>
						q_int <= q_int;
				end case;
			end if;
		end if;
	end process;

	qn_int <= not (q_int);

	q  <= q_int;
	qn <= qn_int;

end architecture;

------------------------------------------------------------------
-- DFF -----------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity DFF is
	port(
		d   : in  std_logic;
		clk : in  std_logic;
		q   : out std_logic;
		qn  : out std_logic
	);
end entity DFF;

architecture RTL of DFF is
	signal q_int  : std_logic;
	signal qn_int : std_logic;
begin
	process(clk)
	begin
		if rising_edge(clk) then
			q_int <= d;
		end if;
	end process;

	qn_int <= not (q_int);

	q  <= q_int;
	qn <= qn_int;

end architecture;

------------------------------------------------------------------
-- DFFAR -----------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity DFFAR is
	port(
		d   : in  std_logic;
		clk : in  std_logic;
		as  : in  std_logic;
		ar  : in  std_logic;
		q   : out std_logic;
		qn  : out std_logic
	);
end entity DFFAR;

architecture RTL of DFFAR is
	signal q_int  : std_logic;
	signal qn_int : std_logic;
begin
	process(ar, as, clk)
	begin
		if ar = '1' then
			q_int <= '0';
		elsif as = '1' then
			q_int <= '1';
		elsif rising_edge(clk) then
			q_int <= d;
		end if;
	end process;

	qn_int <= not (q_int);

	q  <= q_int;
	qn <= qn_int;

end architecture;

------------------------------------------------------------------
-- DFFSR ---------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity DFFSR is
	port(
		d   : in  std_logic;
		clk : in  std_logic;
		ss  : in  std_logic;
		sr  : in  std_logic;
		q   : out std_logic;
		qn  : out std_logic
	);
end entity DFFSR;

architecture RTL of DFFSR is
	signal q_int  : std_logic;
	signal qn_int : std_logic;
begin
	process(clk)
	begin
		if rising_edge(clk) then
			if sr = '1' then
				q_int <= '0';
			elsif ss = '1' then
				q_int <= '1';
			else
				q_int <= d;
			end if;
		end if;
	end process;

	qn_int <= not (q_int);

	q  <= q_int;
	qn <= qn_int;

end architecture;
------------------------------------------------------------------
-- MATH CIRCUITS--------------------------------------------------
------------------------------------------------------------------
-- Half-Adder, Full-Adder, Add8, Mul8, CompareLEQ -------------
------------------------------------------------------------------

------------------------------------------------------------------
-- Half-Adder ----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;

entity HALFADDER is
	port(
		a : in  std_logic;
		b : in  std_logic;
		s : out std_logic;
		c : out std_logic
	);
end entity HALFADDER;

architecture RTL of HALFADDER is
begin
	s <= a xor b;
	c <= a and b;

end architecture RTL;

------------------------------------------------------------------
-- Full-Adder ----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity FULLADDER is
	port(
		a    : in  std_logic;
		b    : in  std_logic;
		cin  : in  std_logic;
		s    : out std_logic;
		cout : out std_logic
	);
end entity FULLADDER;

architecture RTL of FULLADDER is
	signal sum_int : unsigned(1 downto 0);
	signal a_int   : unsigned(1 downto 0);
	signal b_int   : unsigned(1 downto 0);
	signal c_int   : unsigned(1 downto 0);

begin
	a_int <= "0" & a;
	b_int <= "0" & b;
	c_int <= "0" & cin;

	sum_int <= a_int + b_int + c_int;
	s       <= sum_int(0);
	cout    <= sum_int(1);

end architecture RTL;

------------------------------------------------------------------
-- Add4 ----------------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity ADD4 is
	port(
		a3   : in  std_logic;
		a2   : in  std_logic;
		a1   : in  std_logic;
		a0   : in  std_logic;
		b3   : in  std_logic;
		b2   : in  std_logic;
		b1   : in  std_logic;
		b0   : in  std_logic;
		cin  : in  std_logic;
		invb : in  std_logic;
		s3   : out std_logic;
		s2   : out std_logic;
		s1   : out std_logic;
		s0   : out std_logic;
		cout : out std_logic
	);
end entity ADD4;

architecture RTL of ADD4 is
	signal sum_int : unsigned(4 downto 0);
	signal a       : unsigned(4 downto 0);
	signal b       : unsigned(4 downto 0);
	signal c       : unsigned(4 downto 0);

begin
	a <= "0" & a3 & a2 & a1 & a0;
	b <= "0" & b3 & b2 & b1 & b0 when invb = '0' else "0" & not (b3) & not (b2) & not (b1) & not (b0);
	c <= "0000" & cin;

	sum_int <= a + b + c;

	s3   <= sum_int(3);
	s2   <= sum_int(2);
	s1   <= sum_int(1);
	s0   <= sum_int(0);
	cout <= sum_int(4);

end architecture RTL;
------------------------------------------------------------------
-- Mul8 ----------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity MUL8 is
	port(
		a3 : in  std_logic;
		a2 : in  std_logic;
		a1 : in  std_logic;
		a0 : in  std_logic;
		b3 : in  std_logic;
		b2 : in  std_logic;
		b1 : in  std_logic;
		b0 : in  std_logic;
		s7 : out std_logic;
		s6 : out std_logic;
		s5 : out std_logic;
		s4 : out std_logic;
		s3 : out std_logic;
		s2 : out std_logic;
		s1 : out std_logic;
		s0 : out std_logic
	);
end entity MUL8;

architecture RTL of MUL8 is
	signal a : signed(3 downto 0);
	signal b : signed(3 downto 0);
	signal s : signed(7 downto 0);

begin
	a <= a3 & a2 & a1 & a0;
	b <= b3 & b2 & b1 & b0;

	s  <= a * b;
	s7 <= s(7);
	s6 <= s(6);
	s5 <= s(5);
	s4 <= s(4);
	s3 <= s(3);
	s2 <= s(2);
	s1 <= s(1);
	s0 <= s(0);

end architecture RTL;

------------------------------------------------------------------
-- ComparatorLEQ -------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity COMPARATORLEQ is
	port(
		a3   : in  std_logic;
		a2   : in  std_logic;
		a1   : in  std_logic;
		a0   : in  std_logic;
		b3   : in  std_logic;
		b2   : in  std_logic;
		b1   : in  std_logic;
		b0   : in  std_logic;
		leq  : out std_logic;
		leqn : out std_logic
	);
end entity COMPARATORLEQ;

architecture RTL of COMPARATORLEQ is
	signal a       : signed(3 downto 0);
	signal b       : signed(3 downto 0);
	signal leq_int : std_logic;

begin
	a <= a3 & a2 & a1 & a0;
	b <= b3 & b2 & b1 & b0;

	leq_int <= '1' when a <= b else '0';
	leq     <= leq_int;
	leqn    <= not (leq_int);

end architecture RTL;

------------------------------------------------------------------
-- COMPLEX SEQUENTIAL CIRCUITS------------------------------------
------------------------------------------------------------------
-- UpDownCounter -------------------------------------------------
-- ARAM1x16, ARAM4x16, ARAM8x256 ---------------------------------
-- RAM1x16, RAM4x16, RAM8x256 ------------------------------------
-- DPRAM8x256 ----------------------------------------------------  
------------------------------------------------------------------

------------------------------------------------------------------
-- UpDownCounter -------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity UPDOWNCOUNTER is
	port(
		clk     : in  std_logic;
		clk_en  : in  std_logic;
		sreset  : in  std_logic;
		spreset : in  std_logic;
		a3      : in  std_logic;
		a2      : in  std_logic;
		a1      : in  std_logic;
		a0      : in  std_logic;
		down    : in  std_logic;
		q3      : out std_logic;
		q2      : out std_logic;
		q1      : out std_logic;
		q0      : out std_logic;
		zero    : out std_logic;
		match   : out std_logic
	);
end entity UPDOWNCOUNTER;

architecture RTL of UPDOWNCOUNTER is
	signal cnt_reg : unsigned(3 downto 0);
	signal a       : unsigned(3 downto 0);

begin
	a <= a3 & a2 & a1 & a0;

	process(clk)
	begin
		if rising_edge(clk) then
			if sreset = '1' then
				cnt_reg <= (others => '0');
			elsif spreset = '1' then
				cnt_reg <= a3 & a2 & a1 & a0;
			elsif clk_en = '1' then
				if down = '0' then
					cnt_reg <= cnt_reg - 1;
				else
					cnt_reg <= cnt_reg + 1;
				end if;
			end if;
		end if;
	end process;

	q3 <= cnt_reg(3);
	q2 <= cnt_reg(2);
	q1 <= cnt_reg(1);
	q0 <= cnt_reg(0);

	zero  <= '1' when cnt_reg = 0 else '0';
	match <= '1' when cnt_reg = a else '0';

end architecture RTL;

------------------------------------------------------------------
-- ARAM1x16 ------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity ARAM1x16 is
	port(
		ce : in  std_logic;
		we : in  std_logic;
		a3 : in  std_logic;
		a2 : in  std_logic;
		a1 : in  std_logic;
		a0 : in  std_logic;
		d  : in  std_logic;
		q  : out std_logic
	);
end entity ARAM1x16;

architecture RTL of ARAM1x16 is
	type ram_type is array (15 downto 0) of std_logic;
	signal ram_inst : ram_type;
	signal address  : unsigned(3 downto 0);

begin
	address <= a3 & a2 & a1 & a0;

	process(address, ce, we, d, ram_inst)
	begin
		if ce = '1' then
			if we = '1' then
				ram_inst(to_integer(address)) <= d;
			end if;
			q <= ram_inst(to_integer(address));
		else
			q <= '0';
		end if;
	end process;

end architecture RTL;

------------------------------------------------------------------
-- ARAM4x16 ------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity ARAM4x16 is
	port(
		ce : in  std_logic;
		we : in  std_logic;
		a3 : in  std_logic;
		a2 : in  std_logic;
		a1 : in  std_logic;
		a0 : in  std_logic;
		d3 : in  std_logic;
		d2 : in  std_logic;
		d1 : in  std_logic;
		d0 : in  std_logic;
		q3 : out std_logic;
		q2 : out std_logic;
		q1 : out std_logic;
		q0 : out std_logic
	);
end entity ARAM4x16;

architecture RTL of ARAM4x16 is
	type ram_type is array (15 downto 0) of unsigned(3 downto 0);
	signal ram_inst : ram_type;
	signal address  : unsigned(3 downto 0);
	signal din      : unsigned(3 downto 0);
	signal dout     : unsigned(3 downto 0);

begin
	address <= a3 & a2 & a1 & a0;
	din     <= d3 & d2 & d1 & d0;

	process(address, ce, we, din, ram_inst)
	begin
		if ce = '1' then
			if we = '1' then
				ram_inst(to_integer(address)) <= din;
			end if;
			dout <= ram_inst(to_integer(address));
		else
			dout <= (others => '0');
		end if;
	end process;

	q3 <= dout(3);
	q2 <= dout(2);
	q1 <= dout(1);
	q0 <= dout(0);

end architecture RTL;

------------------------------------------------------------------
-- ARAM4x256 -----------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity ARAM4x256 is
	port(
		ce : in  std_logic;
		we : in  std_logic;
		a7 : in  std_logic;
		a6 : in  std_logic;
		a5 : in  std_logic;
		a4 : in  std_logic;
		a3 : in  std_logic;
		a2 : in  std_logic;
		a1 : in  std_logic;
		a0 : in  std_logic;
		d3 : in  std_logic;
		d2 : in  std_logic;
		d1 : in  std_logic;
		d0 : in  std_logic;
		q3 : out std_logic;
		q2 : out std_logic;
		q1 : out std_logic;
		q0 : out std_logic
	);
end entity ARAM4x256;

architecture RTL of ARAM4x256 is
	type ram_type is array (255 downto 0) of unsigned(3 downto 0);
	signal ram_inst : ram_type;
	signal address  : unsigned(7 downto 0);
	signal din      : unsigned(3 downto 0);
	signal dout     : unsigned(3 downto 0);

begin
	address <= a7 & a6 & a5 & a4 & a3 & a2 & a1 & a0;
	din     <= d3 & d2 & d1 & d0;

	process(address, ce, we, din, ram_inst)
	begin
		if ce = '1' then
			if we = '1' then
				ram_inst(to_integer(address)) <= din;
			end if;
			dout <= ram_inst(to_integer(address));
		else
			dout <= (others => '0');
		end if;
	end process;

	q3 <= dout(3);
	q2 <= dout(2);
	q1 <= dout(1);
	q0 <= dout(0);

end architecture RTL;

------------------------------------------------------------------
-- RAM1x16 -------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity RAM1x16 is
	port(
		clk : in  std_logic;
		we  : in  std_logic;
		a3  : in  std_logic;
		a2  : in  std_logic;
		a1  : in  std_logic;
		a0  : in  std_logic;
		d   : in  std_logic;
		q   : out std_logic
	);
end entity RAM1x16;

architecture RTL of RAM1x16 is
	type ram_type is array (15 downto 0) of std_logic;
	signal ram_inst : ram_type;
	signal address  : unsigned(3 downto 0);

begin
	address <= a3 & a2 & a1 & a0;

	process(clk)
	begin
		if rising_edge(clk) then
			if we = '1' then
				ram_inst(to_integer(address)) <= d;
			end if;
		end if;
	end process;

	q <= ram_inst(to_integer(address));

end architecture RTL;

------------------------------------------------------------------
-- RAM4x16 -------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity RAM4x16 is
	port(
		clk : in  std_logic;
		we  : in  std_logic;
		a3  : in  std_logic;
		a2  : in  std_logic;
		a1  : in  std_logic;
		a0  : in  std_logic;
		d3  : in  std_logic;
		d2  : in  std_logic;
		d1  : in  std_logic;
		d0  : in  std_logic;
		q3  : out std_logic;
		q2  : out std_logic;
		q1  : out std_logic;
		q0  : out std_logic
	);
end entity RAM4x16;

architecture RTL of RAM4x16 is
	type ram_type is array (15 downto 0) of unsigned(3 downto 0);
	signal ram_inst : ram_type;
	signal address  : unsigned(3 downto 0);
	signal din      : unsigned(3 downto 0);
	signal dout     : unsigned(3 downto 0);

begin
	address <= a3 & a2 & a1 & a0;
	din     <= d3 & d2 & d1 & d0;

	process(clk)
	begin
		if rising_edge(clk) then
			if we = '1' then
				ram_inst(to_integer(address)) <= din;
			end if;
		end if;
	end process;

	dout <= ram_inst(to_integer(address));

	q3 <= dout(3);
	q2 <= dout(2);
	q1 <= dout(1);
	q0 <= dout(0);

end architecture RTL;

------------------------------------------------------------------
-- RAM4x256 -------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity RAM4x256 is
	port(
		clk : in  std_logic;
		we  : in  std_logic;
		a7  : in  std_logic;
		a6  : in  std_logic;
		a5  : in  std_logic;
		a4  : in  std_logic;
		a3  : in  std_logic;
		a2  : in  std_logic;
		a1  : in  std_logic;
		a0  : in  std_logic;
		d3  : in  std_logic;
		d2  : in  std_logic;
		d1  : in  std_logic;
		d0  : in  std_logic;
		q3  : out std_logic;
		q2  : out std_logic;
		q1  : out std_logic;
		q0  : out std_logic
	);
end entity RAM4x256;

architecture RTL of RAM4x256 is
	type ram_type is array (255 downto 0) of unsigned(3 downto 0);
	signal ram_inst : ram_type;
	signal address  : unsigned(7 downto 0);
	signal din      : unsigned(3 downto 0);
	signal dout     : unsigned(3 downto 0);

begin
	address <= a7 & a6 & a5 & a4 & a3 & a2 & a1 & a0;
	din     <= d3 & d2 & d1 & d0;

	process(clk)
	begin
		if rising_edge(clk) then
			if we = '1' then
				ram_inst(to_integer(address)) <= din;
			end if;
		end if;
	end process;

	dout <= ram_inst(to_integer(address));

	q3 <= dout(3);
	q2 <= dout(2);
	q1 <= dout(1);
	q0 <= dout(0);

end architecture RTL;

------------------------------------------------------------------
-- DPRAM4x256 -----------------------------------------------------

library ieee;
use ieee.std_logic_1164.all;
use ieee.std_logic_unsigned.all;

entity DPRAM4x256 is
	port(
		aclk : in  std_logic;
		awe  : in  std_logic;
		bclk : in  std_logic;
		bwe  : in  std_logic;
		a7   : in  std_logic;
		a6   : in  std_logic;
		a5   : in  std_logic;
		a4   : in  std_logic;
		a3   : in  std_logic;
		a2   : in  std_logic;
		a1   : in  std_logic;
		a0   : in  std_logic;
		b7   : in  std_logic;
		b6   : in  std_logic;
		b5   : in  std_logic;
		b4   : in  std_logic;
		b3   : in  std_logic;
		b2   : in  std_logic;
		b1   : in  std_logic;
		b0   : in  std_logic;
		da3  : in  std_logic;
		da2  : in  std_logic;
		da1  : in  std_logic;
		da0  : in  std_logic;
		db3  : in  std_logic;
		db2  : in  std_logic;
		db1  : in  std_logic;
		db0  : in  std_logic;
		qa3  : out std_logic;
		qa2  : out std_logic;
		qa1  : out std_logic;
		qa0  : out std_logic;
		qb3  : out std_logic;
		qb2  : out std_logic;
		qb1  : out std_logic;
		qb0  : out std_logic
	);
end entity DPRAM4x256;

architecture RTL of DPRAM4x256 is
	type ram_type is array (255 downto 0) of std_logic_vector(3 downto 0);
	shared variable ram_inst : ram_type;

	signal address_a : std_logic_vector(7 downto 0);
	signal address_b : std_logic_vector(7 downto 0);

	signal dina : std_logic_vector(3 downto 0);
	signal dinb : std_logic_vector(3 downto 0);

	signal douta : std_logic_vector(3 downto 0);
	signal doutb : std_logic_vector(3 downto 0);

begin
	address_a <= a7 & a6 & a5 & a4 & a3 & a2 & a1 & a0;
	address_b <= b7 & b6 & b5 & b4 & b3 & b2 & b1 & b0;

	dina <= da3 & da2 & da1 & da0;
	dinb <= db3 & db2 & db1 & db0;

	process(aclk)
	begin
		if rising_edge(aclk) then
			if awe = '1' then
				ram_inst(CONV_INTEGER(address_a)) := dina;
			end if;
			douta <= ram_inst(CONV_INTEGER(address_a));
		end if;
	end process;

	process(bclk)
	begin
		if rising_edge(bclk) then
			if bwe = '1' then
				ram_inst(CONV_INTEGER(address_b)) := dinb;
			end if;
			doutb <= ram_inst(CONV_INTEGER(address_b));
		end if;
	end process;

	qa3 <= douta(3);
	qa2 <= douta(2);
	qa1 <= douta(1);
	qa0 <= douta(0);

	qb3 <= doutb(3);
	qb2 <= doutb(2);
	qb1 <= doutb(1);
	qb0 <= doutb(0);

end architecture RTL;