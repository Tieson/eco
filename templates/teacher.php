<?php require 'head.php' ?>

<?php require 'templates.php' ?>

<div class="page_wrap">

	<?php require 'header.php' ?>

	<div class="main_content" id="main-content">
		<div class="main_content__container" id="container--pages">
			<div class="container">
				<div id="page_main_content"></div>
			</div>
		</div>
	</div>
</div>

<div id="snackbar">...</div>

<div id="modals"></div>

<div id="scripts">
    <script src="src/helpers/util.js?<?php echo(filemtime('./src/helpers/util.js')) ?>"></script>
    <script src="src/teacher.js?<?php echo(filemtime('./src/teacher.js')) ?>"></script>

    <script src="src/helpers/formaters.js?<?php echo(filemtime('./src/helpers/formaters.js')) ?>"></script>
    <script src="src/helpers/validators.js?<?php echo(filemtime('./src/helpers/validators.js')) ?>"></script>
    <script src="src/helpers/snackbar.js?<?php echo(filemtime('./src/helpers/snackbar.js')) ?>"></script>
    <script src="src/helpers/mappers.js?<?php echo(filemtime('./src/helpers/mappers.js')) ?>"></script>

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
    <script src="src/modules/users.js?<?php echo(filemtime('./src/modules/users.js')) ?>"></script>

    <script src="src/modules/simmulator.js?<?php echo(filemtime('./src/modules/simmulator.js')) ?>"></script>

    <!--	--><?php //require 'scripts.php'; ?>

    <script>

        eco.Router = Backbone.Router.extend({
            routes: {
                '': 'home',

                'groups': 'showGroups', //zobrazení seznamu skupin, které vyučuící vlastní
                'groups/:id': 'showGroupDetail', //zobrazení detailu skupiny
                'groups/:id/homeworks': 'showGroupHomeworks', //TODO: zobrazení úkolů skupiny - pro učitele

                'students': 'showStudents', //zobrazení studentů

                'tasks': 'showOwnTasks',
                'tasks/:id': 'showTaskDetail',
                'tasks/:id/edit': 'editTask',

                'homeworks' : 'homeworksAssigment',
                'homeworks/:id': 'showHwDetail', //zobrazí detail úkolů se zadáním a dalšími informacemi


                /** Schémata **/
                'schemas': 'showSchemas', //seznam schémat, která lze otevřít (pouze vlastní schémata)
                'schemas/new': 'schemaCreateNew', //vytvoření nového schema - pro konkrétního uživatele
                'schemas/:id': 'openedSchema', //Pro editaci konkrétního schéma = otevření schéma (pouze jedno otevřené)
                'schemas/:id/edit': 'showSchemaEdit',

                'teachers/:id/tasks': 'showTasks',
//                'teachers/:id/hw': 'showGroupHomeworks',



                /** Studenti **/
                'students/groups': 'showUserGroups', // zobrazí seznam skupin ve kterých student je
                'students/:id/groups/:id': 'showUserGroupDetail', // zobrazí detail skupiny ve které je student - jiný pohled pro studenta a ostatní
                'students/:id/homeworks': 'showStudentsHwList', // zobrazí všechny úkoly studenta

                '*path':  'defaultRoute',
            }
        });


        $(document).ready(function() {
            eco.start();
        });
    </script>

</div>

</body>
</html>