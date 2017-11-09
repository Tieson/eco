library IEEE;
use IEEE.std_logic_1164.all;

entity HomeWork is
	port (
		X0 : in std_logic; --[154;413]
		X1 : in std_logic; --[154;532]
		Z0 : out std_logic --[1365;336]
	);
end entity HomeWork;

architecture fasd of HomeWork is
	signal q_TUL_XOR_0 : std_logic;

begin
	Buffer_0 : entity work.TUL_BUF --[955;393]
	port map(a => q_TUL_XOR_0, q => Z0);

	XOR_0 : entity work.TUL_XOR --[532;448]
	port map(a => X0, b => X1, q => q_TUL_XOR_0);

end architecture fasd;

