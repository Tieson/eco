library ieee;
use ieee.std_logic_1164.all;
use ieee.std_logic_arith.all;

-- OH GOD!! IT IS MAGIC HERE!!!

entity testbench_#DFFSR# is

	generic(
		C_NUM_INPUTS : integer := #3#
	);

end entity testbench_#DFFSR#;

architecture #RTL# of testbench_#DFFSR# is

	component #DFFSR#
		port(
#
       d   : in  std_logic;
	   clk : in  std_logic;
	   ss  : in  std_logic;
	   sr  : in  std_logic;
	   q   : out std_logic;
	   qn  : out std_logic
        #);
	end component #DFFSR#;	
    #    
    signal clk : std_logic := '0';
    
    #
	constant clk_period : time := 10 ns;    
    
    #   
	signal d  : std_logic;
	signal ss : std_logic;
	signal sr : std_logic;
	signal q  : std_logic;
	signal qn : std_logic;
    #	
        signal input_stimuli : std_logic_vector(C_NUM_INPUTS - 1 downto 0) := (others => '0');
    
begin

	tb_inst : component #DFFSR#
		port map(#d   => d,
			     clk => clk,
			     ss  => ss,
			     sr  => sr,
			     q   => q,
			     qn  => qn#);
	
    #
    d <= input_stimuli(0);
	ss <= input_stimuli(1);
	sr <= input_stimuli(2);
    #
    
	clk_gen : process
	begin
		wait for clk_period/2;
		clk <= not clk;
	end process;
    #
    
	process
	begin
		wait for clk_period;
		for i in 0 to (2 ** C_NUM_INPUTS) - 1 loop
			input_stimuli <= CONV_STD_LOGIC_VECTOR(i, C_NUM_INPUTS);
			wait for clk_period;
		end loop;
		wait;
	end process;
    
end architecture #RTL#;