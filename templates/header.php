
<div class="main_bar" id="main_bar">
    <div class="main_menu">
        <div class="dropdown">
            <a href="#"
               id="menuToggler"
               title="Schéma (Entita)"
               class="button button--primary main_bar__menu noselect dropdown-toggle"
               data-toggle="dropdown">
                <i class=" glyphicon glyphicon-file"></i> <span class="title">Schéma</span>
            </a>
            <ul class="dropdown-menu">
                <li><a href="<?php echo $projectDir ?>/#schemas" id="menu-file-open_new_schema"><i class="glyphicon glyphicon-open-file"></i> Nové / Otevřít</a></li>
                <li class="divider"></li>
                <li><a href="#" id="saveSchema" class="saveSchemaButton" title="Uložit schéma (Ctrl + s)"><i class="glyphicon glyphicon-floppy-disk"></i> Uložit schéma <small>(Ctrl + S)</small></a></li>
                <li><a href="#" id="vhdlExportSchema" class="vhdlExportSchemaButton" title="Exportovat do souboru VHD"><i class="glyphicon glyphicon-cloud-download"></i> Export VHDL <small>(Ctrl + E)</small></a></li>
                <li><a href="<?php echo $projectDir ?>/lib.vhd" download="lib.vhd" target="_blank" id="menu-file-download_lib"><i class="glyphicon glyphicon-cloud-download"></i> Stáhnout lib.vdl</a></li>
            </ul>
        </div>

        <?php if (!empty($user_role) && $user_role=="student"): ?>
            <a href="<?php echo $projectDir ?>/#homeworks" id="menu-task-show" class="button button--primary main_bar__menu noselect">
                <i class=" glyphicon glyphicon-tasks"></i>
                <span class="title">Úkoly</span>
            </a>
            <a href="<?php echo $projectDir ?>/#students/groups" id="menu-task-show" class="button button--primary main_bar__menu noselect">
                <i class="glyphicon glyphicon-record"></i>
                <span class="title">Skupiny</span>
            </a>
        <?php endif; ?>
        <?php if(!empty($user_role) && $user_role=="teacher"): ?>
            <a href="<?php echo $projectDir ?>/teacher#groups" class="button button--primary main_bar__menu noselect">
                <i class=" glyphicon glyphicon-record"></i>
                <span class="title">Skupiny</span>
            </a>
            <a href="<?php echo $projectDir ?>/teacher#tasks" class="button button--primary main_bar__menu noselect">
                <i class=" glyphicon glyphicon-briefcase"></i>
                <span class="title">Úlohy</span>
            </a>
        <?php endif; ?>
    </div>
	<div class="schema_list">
		<div class="schema_list__items" id="schema_list_container"></div>
		<a class="schema_list__add" id="addSchema" href="<?php echo $projectDir ?>/#schemas/new"> + </a>
	</div>

	<div id='usermenu' class="main_bar__usermenu">

		<div class="dropdown main_bar__usermenu__item item" id="userInfo">
			<div class="noselect dropdown-toggle menuLabel" data-toggle="dropdown">
				<i class="glyphicon glyphicon-user"></i>
				<?php if (!empty($user_name)): ?>
					<?php echo $user_name; ?>
				<?php else: ?>
					Účet
				<?php endif; ?>
			</div>
			<ul class="dropdown-menu dropdown-menu-right">
				<?php if (!empty($user_name)): ?>
                    <li><a href="<?php echo $projectDir ?>/logout">Odhlásit se</a></li>
				<?php else: ?>
                    <li><a href="<?php echo $projectDir ?>/login">Přihlásit se</a></li>
				<?php endif; ?>
			</ul>
		</div>

		<div class="main_bar__usermenu__item item vhdlExportSchemaButton" title="Exportovat Schéma do VHDL (Ctrl + e)">
			<div class="menuLabel noselect">
				<i class="glyphicon glyphicon-cloud-download"></i>
			</div>
		</div>
		<div class="main_bar__usermenu__item item saveSchemaButton" title="Uložit schéma (Ctrl + s)">
			<div class="menuLabel noselect">
				<i class="glyphicon glyphicon-floppy-disk"></i>
			</div>
		</div>

	</div>
</div>