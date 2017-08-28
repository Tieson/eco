
<div class="main_bar" id="main_bar">
	<div class="dropdown">
		<a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
			<i class=" glyphicon glyphicon-file"></i> Schéma
		</a>
		<ul class="dropdown-menu">
			<li><a href="/#schemas/new" id="menu-file-new_schema">Nové</a></li>
			<li><a href="/#schemas" id="menu-file-open_schema">Otevřít</a></li>
			<li class="divider"></li>
			<li><a href="/#" id="menu-file-download_lib">Stáhnout lib.vdl</a></li>
		</ul>
	</div>

	<?php if (!empty($user_role) && $user_role=="student"): ?>
        <div class="dropdown">
            <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
                <i class=" glyphicon glyphicon-education"></i> Student
            </a>
            <ul class="dropdown-menu">
                <li><a href="/#homeworks" id="menu-task-show">Úkoly</a></li>
                <li><a href="/#students/groups" id="menu-task-show">Skupiny</a></li>
            </ul>
        </div>
	<?php endif; ?>
	<?php if(!empty($user_role) && $user_role=="teacher"): ?>
        <div class="dropdown">
            <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
                <i class=" glyphicon glyphicon-king"></i> Vyučující
            </a>
            <ul class="dropdown-menu">
                <li><a href="/teacher#groups">Skupiny</a></li>
                <li><a href="/teacher#tasks">Zadání</a></li>
                <li><a href="/teacher#homeworks">Úkoly</a></li>
            </ul>
        </div>
	<?php endif; ?>

	<div class="schema_list">
		<div class="schema_list__items" id="schema_list_container"></div>
		<a class="schema_list__add" id="addSchema" href="/#schemas/new"> + </a>
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
			<ul class="dropdown-menu">
				<?php if (!empty($user_name)): ?>
                    <li><a href="/logout">Odhlásit se</a></li>
				<?php else: ?>
                    <li><a href="/login">Přihlásit se</a></li>
				<?php endif; ?>
			</ul>
		</div>

		<div class="main_bar__usermenu__item item" id="saveSchema">
			<div class="menuLabel noselect">
				<i class="glyphicon glyphicon-floppy-disk"></i> Uložit schéma
			</div>
		</div>

	</div>
</div>