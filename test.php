
<?php
$path = '/var/www/html/eco/vivado/test.tcl';
$tcl = file_get_contents($path);

$cmd = "/opt/Xilinx/Vivado/2016.4/bin/vivado -mode batch -source vivado/test.tcl 2>&1";


$output = array();

exec($cmd, $output);

foreach($output as $line) {
	echo $line;
}



//ERROR
//type=AVC msg=audit(1505508290.587:12948): avc:  denied  { execmem } for  pid=12448 comm="vivado" scontext=unconfined_u:system_r:httpd_t:s0 tcontext=unconfined_u:system_r:httpd_t:s0 tclass=process
//type=SYSCALL msg=audit(1505508290.587:12948): arch=c000003e syscall=9 success=no exit=-13 a0=0 a1=838844 a2=7 a3=802 items=0 ppid=12434 pid=12448 auid=0 uid=48 gid=48 euid=48 suid=48 fsuid=48 egid=48 sgid=48 fsgid=48 tty=(none) ses=205 comm="vivado" exe="/opt/Xilinx/Vivado/2016.4/bin/unwrapped/lnx64.o/vivado" subj=unconfined_u:system_r:httpd_t:s0 key=(null)


echo 'End';