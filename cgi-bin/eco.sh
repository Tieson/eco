#!/bin/env bash

#nastaveni cest ke scriptum pro inicializaci promenych potrebnych pro chod Vivada
. /etc/profile.d/xil_ISE14.6_settings64.sh
. /etc/profile.d/xil_Vivado2016.4_settings64.sh

#nastaveni domovskeho adresare, nutne pro beh vivada - neni dulezite samotny nazev adresare
HOME="/var/www/apache_fake_home"
export HOME

#presun pripravevneho TCL scriptu do adresare, kde se daji spoustet scripty
cp /var/www/html/eco/test.tcl /var/www/cgi-bin/test.tcl

#spusteni simulace ve Vivadu pomoci TTCL scriptu a vraceni vystupu
/opt/Xilinx/Vivado/2016.4/bin/vivado -mode batch -source /var/www/html/eco/test.tcl 2>&1


