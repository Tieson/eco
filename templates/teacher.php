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

                'groups': 'showGroups', //seznam skupin vyučujícího
                'groups/:id': 'showGroupDetail', //detailu skupiny
                'groups/:id/homeworks': 'showGroupHomeworks', //seznam úkolů zadanách ve skupině

                'tasks': 'showOwnTasks', // seznam zadání
                'tasks/:id': 'showTaskDetail', //detail zadání
                'tasks/:id/edit': 'editTask', // úprava zadání s uploadem souborů

                'homeworks/:id': 'showHwDetail', //detail úkolů se zadáním

                'schemas': 'showSchemas', //seznam vlastních schémat
                'schemas/new': 'schemaCreateNew', //vytvoření nového schema
                'schemas/:id': 'openedSchema', //otevření schéma
                'schemas/:id/edit': 'showSchemaEdit', //úprava údajů schéma

//                'students/:id/homeworks': 'showStudentsHwList', // zobrazí všechny úkoly studenta

                '*path':  'defaultRoute',
            },
            route: function(route, name, callback) {
                var router = this;
                if (!callback) callback = this[name];

                var f = function () {
                    $(document).off('keydown');
                    beforeRoute();
                    callback && callback.apply(router, arguments);
                };
                return Backbone.Router.prototype.route.call(this, route, name, f);
            },
        });



        function hideButtons(btns) {
            _.each(btns, function (item) {
                $(item).hide();
            });
        }

        function showButtons(btns) {
            _.each(btns, function (item) {
                $(item).show();
            });
        }

        function beforeRoute() {
            $(eco.selectors.schemas).hide();
            $(eco.selectors.pages).hide();
            hideButtons([eco.buttons.saveSchema, eco.buttons.exportSchema]);
        }


        $(document).ready(function() {
            eco.start();
        });
    </script>

</div>

</body>
</html>