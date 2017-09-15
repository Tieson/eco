create_project project_1 /var/www/html/eco/vivado/autovalidation
open_project /var/www/html/eco/vivado/autovalidation/project_1.xpr

add_files -norecurse -scan_for_includes {/var/www/html/eco/lib.vhd /var/www/html/eco/soubory/task_2/etalon/ProjektA.vhd /var/www/html/eco/soubory/task_2/test/ProjektATB.vhd /var/www/html/eco/soubory/task_2/result/HomeWork.vhd}
set_property SOURCE_SET sources_1 [get_filesets sim_1]
add_files -fileset sim_1 -norecurse -scan_for_includes /var/www/html/eco/soubory/task_2/test/ProjektATB.vhd

set_property top project_1 [get_filesets sim_1]
set_property top ProjektATB [get_filesets sim_1]

launch_simulation

close_sim