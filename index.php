<!DOCTYPE html>
<html lang='cs'>
<head>
	<title>Grafický editor číslicových obvodů v HTML5</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset='utf-8'>
	<!--<meta name='description' content=''>-->
	<meta name='keywords' content='Editor, Digital circuits, číslicové obvody, simulace, interaktivní'>
	<!--<meta name='author' content='Tomáš Václavík'>-->
	<meta name='robots' content='all'>

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="assets/js/libs/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="assets/js/libs/jointjs/dist/joint.min.css">
	<link rel="stylesheet" href="assets/css/style.css">

	<!--TODO: stahnout jquery.hotkeys jako bower plugin	<script src="../scripts/jquery.hotkeys.js"></script>-->

	<script src="assets/js/libs/jquery/dist/jquery.min.js"></script>
	<script src="assets/js/libs/lodash/lodash.min.js"></script>
	<script src="assets/js/libs/backbone/backbone-min.js"></script>
	<script src="assets/js/libs/backbone-relational/backbone-relational.js"></script>

	<script src="assets/js/libs/jointjs/dist/joint.js"></script>
	<script src="assets/js/libs/jointjs/dist/joint.shapes.logic.min.js"></script>
	<script src="assets/js/libs/bootstrap/dist/js/bootstrap.min.js"></script>


	<script src="scripts/joint.shapes.mylib.js"></script>
	<!--<script src="/scripts/utils/fileLoader.js"></script>-->
	<!--<script src="/scripts/utils/Counter.js"></script>-->
	<!--<script src="/scripts/utils/Serialization.js"></script>-->


	<!--TODO: nahradit Backbone modelem/pohledem	<script src="/scripts/Creator.js"></script>-->
	<!--<script src="/scripts/VhdExport.js"></script>-->
	<!--<script src="/scripts/VhdImport.js"></script>-->

	<script src="src/application.js"></script>
	<script src="src/application_ready.js"></script>
	<script src="src/helpers/templates.js"></script>

	<script src="scripts/utils/Util.js"></script>

	<script src="src/moduls/entities.js"></script>
	<script src="src/moduls/schema.js"></script>
	<script src="src/moduls/modal.js"></script>
	<script src="src/moduls/settings.js"></script>
	<script src="src/moduls/task.js"></script>

</head>
<body style="position: relative;">

<div class="templates">
	<!-- šablony pro Backbone -->
	<?php include 'templates/templates/homeworkList.html' ?>
	<?php include 'templates/templates/editSchemaModal.html' ?>
</div>

<div class="page_wrap">

	<div class="main_bar">
		<div class="dropdown">
			<a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
				<i class=" glyphicon glyphicon-file"></i> Soubor
			</a>
			<ul class="dropdown-menu">
				<li><a href="#" id="menu-file-new_schema">Nové schéma</a></li>
				<li><a href="#" id="menu-file-close_schema">Zavřít schéma</a></li>
				<li><a href="#" id="menu-file-open_schema">Otevřít schéma</a></li>
				<li><a href="#" id="menu-file-save_schema_as">Uložit schéma jako &hellip;</a></li>
				<li><a href="#" id="menu-file-export_schema">Exportovat schéma do VHDL</a></li>
				<li class="divider"></li>
				<li><a href="#" id="menu-file-download_lib">Stáhnout lib.vdl</a></li>
			</ul>
		</div>
		<div class="dropdown">
			<a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
				<i class=" glyphicon glyphicon-flash"></i> Úkoly
			</a>
			<ul class="dropdown-menu">
				<li><a href="#" id="menu-task-show">Zobrazit moje úkoly</a></li>
				<li class="disabled"><a href="#">Odevzdat toto schéma jako úkol</a></li>
			</ul>
		</div>

		<div class="schema_list">
			<div class="schema_list__items" id="schema_list_container"></div>
			<a class="schema_list__add" id="addSchema" href="#newSchema"> + </a>
		</div>

		<div id='usermenu' class="main_bar__usermenu">

			<div class="main_bar__usermenu__item item" id="userInfo">
				<div class="menuLabel clickmenu noselect">
					<i class="glyphicon glyphicon-user"></i> Account
				</div>
				<div class='menuitemsContainer'>
					<!--<a href='./?logout' class="button remove"><i class="glyphicon glyphicon-log-out"></i> Log out</a>-->
					<a href="#logForm" class="button button--primary popup"><i class="glyphicon glyphicon-log-in"></i> Log in</a>
					<div class="nebo">or</div>
					<a href="#regForm" class="button button--default reg popup"><i class="glyphicon glyphicon-edit"></i> Create account</a>

				</div>
			</div>
			<div class="main_bar__usermenu__item item" id="saveSchema">
				<div class="menuLabel noselect">
					<i class="glyphicon glyphicon-floppy-disk"></i> Uložit schéma
				</div>
			</div>

		</div>
	</div>

	<div class="center_wrap">

		<div id="ribbon" class="ribbon">

			<div id="contentToggler" class="ribbon__toggle noselect">
				<i class="glyphicon glyphicon-arrow-right ribbon__toggle__show" title="Show entities" style="display: none;"></i>
				<i class="glyphicon glyphicon-arrow-left ribbon__toggle__hide"></i>
			</div>

			<div id="ribbonContent" class="ribbon__contents">

			</div>
		</div>

		<div class="paper_container" id="canvasWrapper">

		</div>

		<div id="entityDetail"></div>
	</div>


</div>

</body>
</html>