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
    <link rel="stylesheet" href="assets/js/libs/sweetalert/dist/sweetalert.css" type="text/css">
	<link rel="stylesheet" href="assets/css/style.css">

	<!--TODO: stahnout jquery.hotkeys jako bower plugin	<script src="../scripts/jquery.hotkeys.js"></script>-->

	<script src="assets/js/libs/jquery/dist/jquery.min.js"></script>
	<script src="assets/js/libs/jquery-ui/jquery-ui.min.js"></script>
	<script src="assets/js/libs/lodash/lodash.min.js"></script>
	<script src="assets/js/libs/backbone/backbone-min.js"></script>
<!--	<script src="assets/js/libs/backbone-relational/backbone-relational.js"></script>-->
	<script src="assets/js/libs/backbone.localStorage/backbone.localStorage-min.js"></script>
<!--	<script src="assets/js/libs/backbone.marionette/lib/backbone.marionette.min.js"></script>-->
	<script src="assets/js/libs/moment/min/moment.min.js"></script>
	<script src="assets/js/libs/moment/locale/cs.js"></script>

	<script src="assets/js/libs/jointjs/dist/joint.js"></script>
	<script src="assets/js/libs/bootstrap/dist/js/bootstrap.min.js"></script>

	<script src="assets/js/libs/list.js/dist/list.min.js"></script>

    <script src="assets/js/libs/sweetalert/dist/sweetalert.min.js"></script>

	<script src="scripts/joint.shapes.mylib.js?<?php echo(filemtime('./scripts/joint.shapes.mylib.js'))?>"></script>
	<!--<script src="/scripts/utils/fileLoader.js"></script>-->
	<!--<script src="/scripts/utils/Counter.js"></script>-->
	<!--<script src="/scripts/utils/Serialization.js"></script>-->


	<!--TODO: nahradit Backbone modelem/pohledem	<script src="/scripts/Creator.js"></script>-->
	<!--<script src="/scripts/VhdExport.js"></script>-->
	<!--<script src="/scripts/VhdImport.js"></script>-->


    <style>
        .joint-element .output, .joint-element .input
        {
            fill: #fff;
            stroke: #7f8c8d;
            stroke-opacity: 0.5;
            stroke-width: 2px;
        }
        .joint-element .not_gate
        {
            fill: none;
            stroke: #000000;
            stroke-opacity: 1;
            stroke-width: 2px;
        }
        .joint-element .entitybody
        {
            fill: #fff;
            stroke: #000000;
            stroke-opacity: 1;
            stroke-width: 2px;
        }
        .joint-element .label
        {
            fill: #000000;
            font-size: 15px;
            font-weight:400;
        }
    </style>

</head>
<body style="position: relative;">

<div class="templates">
	<!-- šablony pro Backbone -->
	<?php include 'templates/templates/homework.html' ?>
	<?php include 'templates/templates/schemas.html' ?>
	<?php include 'templates/templates/groups.html' ?>
	<?php include 'templates/templates/tasks.html' ?>

    <script type="text/template" id="schemaListItem-template">
        <%=name%>
    </script>
    <script type="text/template" id="categoryItem-template">
<!--        <div class="ribbon__contents__category noselect" data-idCategory="<%=id%>">-->
            <div class="ribbon__contents__header noselect">
                <%=name%>
            </div>
<!--            <div class="ribbon__contents__items">-->
<!--                <p>Kategorie neobsahuje žádné entity.</p>-->
<!--            </div>-->
<!--        </div>-->
    </script>


    <script type="text/template" id="main_bar-template">

    </script>
</div>

<div class="page_wrap">

	<div class="main_bar" id="main_bar">
        <div class="dropdown">
            <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
                <i class=" glyphicon glyphicon-file"></i> Soubor
            </a>
            <ul class="dropdown-menu">
                <li><a href="#schemas/new" id="menu-file-new_schema">Nové schéma</a></li>
                <li><a href="#" id="menu-file-close_schema">Zavřít schéma</a></li>
                <li><a href="#schemas" id="menu-file-open_schema">Otevřít schéma</a></li>
                <li><a href="#" id="menu-file-save_schema_as">Uložit schéma jako &hellip;</a></li>
                <li><a href="#" id="menu-file-export_schema">Exportovat schéma do VHDL</a></li>
                <li class="divider"></li>
                <li><a href="#" id="menu-file-download_lib">Stáhnout lib.vdl</a></li>
            </ul>
        </div>
        <div class="dropdown">
            <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
                <i class=" glyphicon glyphicon-education"></i> Student
            </a>
            <ul class="dropdown-menu">
                <li><a href="#homeworks" id="menu-task-show">Úkoly</a></li>
                <li><a href="#students/groups" id="menu-task-show">Skupiny</a></li>
            </ul>
        </div>
        <div class="dropdown">
            <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
                <i class=" glyphicon glyphicon-king"></i> Vyučující
            </a>
            <ul class="dropdown-menu">
                <li><a href="#groups">Skupiny</a></li>
                <li><a href="#teachers/9/tasks">Zadání</a></li>
                <li><a href="#teachers/9/hw">Úkoly</a></li>
                <li><a href="#"></a></li>
            </ul>
        </div>

        <div class="schema_list">
            <div class="schema_list__items" id="schema_list_container"></div>
            <a class="schema_list__add" id="addSchema" href="#schemas/new"> + </a>
        </div>

        <div id='usermenu' class="main_bar__usermenu">

            <div class="main_bar__usermenu__item item" id="userInfo">
                <div class="menuLabel clickmenu noselect">
                    <i class="glyphicon glyphicon-user"></i> Účet
                </div>
                <!--<div class='menuitemsContainer'>
				<a href='./?logout' class="button remove"><i class="glyphicon glyphicon-log-out"></i> Log out</a>
			<a href="#logForm" class="button button--primary popup"><i class="glyphicon glyphicon-log-in"></i> Log in</a>
				<div class="nebo">or</div>
				<a href="#regForm" class="button button--default reg popup"><i class="glyphicon glyphicon-edit"></i> Create account</a>
			</div>-->
            </div>
            <div class="main_bar__usermenu__item item" id="saveSchema">
                <div class="menuLabel noselect">
                    <i class="glyphicon glyphicon-floppy-disk"></i> Uložit schéma
                </div>
            </div>

        </div>
	</div>


    <div class="main_content" id="main-content">
        <div class="main_content__container" id="container--pages" style="display: none;">
            <div class="container">
                <div id="page_main_content"></div>
            </div>
        </div>
        <div class="main_content__container" id="container--schemas">
            <div class="center_wrap">
                <div id="ribbon" class="ribbon">

                    <div id="contentToggler" class="ribbon__toggle noselect">
                        <i class="glyphicon glyphicon-arrow-right ribbon__toggle__show" title="Show entities"></i>
                        <i class="glyphicon glyphicon-arrow-left ribbon__toggle__hide"></i>
                    </div>

                    <div id="ribbonContent" class="ribbon__contents">
                        <p class="text-muted text-center">
                            Nic tu není. Entity se načítají...
                        </p>

                    </div>
                </div>

                <div class="paper_container">
                    <div id="canvasWrapper"></div>
                </div>
            </div>
        </div>
    </div>


</div>

<div id="modals"></div>

<div id="scripts">
    <script src="src/helpers/util.js?<?php echo(filemtime('./src/helpers/util.js')) ?>"></script>
    <script src="src/application.js?<?php echo(filemtime('./src/application.js')) ?>"></script>
    <script src="src/helpers/templates.js?<?php echo(filemtime('./src/helpers/templates.js')) ?>"></script>

    <script src="src/helpers/formaters.js?<?php echo(filemtime('./src/helpers/formaters.js')) ?>"></script>
    <script src="src/helpers/validators.js?<?php echo(filemtime('./src/helpers/validators.js')) ?>"></script>

    <script src="src/modules/generic.js?<?php echo(filemtime('./src/modules/generic.js')) ?>"></script>
    <script src="src/modules/entities.js?<?php echo(filemtime('./src/modules/entities.js')) ?>"></script>
    <script src="src/modules/files.js?<?php echo(filemtime('./src/modules/files.js')) ?>"></script>
    <script src="src/modules/main.js?<?php echo(filemtime('./src/modules/main.js')) ?>"></script>
    <script src="src/modules/schema.js?<?php echo(filemtime('./src/modules/schema.js')) ?>"></script>
    <script src="src/modules/modal.js?<?php echo(filemtime('./src/modules/modal.js')) ?>"></script>
    <script src="src/modules/settings.js?<?php echo(filemtime('./src/modules/settings.js')) ?>"></script>
    <script src="src/modules/tasks.js?<?php echo(filemtime('./src/modules/tasks.js')) ?>"></script>
    <script src="src/modules/group.js?<?php echo(filemtime('./src/modules/group.js')) ?>"></script>
    <script src="src/modules/student.js?<?php echo(filemtime('./src/modules/student.js')) ?>"></script>
    <script src="src/modules/homeworks.js?<?php echo(filemtime('./src/modules/homeworks.js')) ?>"></script>
    <script src="src/modules/simmulator.js?<?php echo(filemtime('./src/modules/simmulator.js')) ?>"></script>

    <script src="src/application_ready.js?<?php echo(filemtime('./src/application_ready.js')) ?>"></script>
</div>

</body>
</html>