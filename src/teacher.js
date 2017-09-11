// Every logic gate needs to know how to handle a situation, when a signal comes to their ports.




window.eco = {
    Models: {},
    Collections: {},
    Views: {},
    Formaters: {},
    Validators: {},
    Mappers: {},
    Utils: getUtils(),
    basedir: config.basedir || '',
    ViewGarbageCollector: {
        items: [],
        clear: function () {
            _.each(this.items, function (item) {
                if (item && item.remove) {
                    item.stopListening();
                    item.remove();
                }
            });
            this.items = [];
        },
        add: function (item) {
            this.items.push(item)
        },
        getItems: function () {
            return this.items;
        }
    },

    start: function(data) {
        //Routes
        var router = new eco.Router();

        router.on('route:home', showHome);

        /** Skupiny **/
        router.on('route:showGroups', showGroups);
        router.on('route:showGroupDetail', showGroupDetail);


        // router.on('route:homeworksAssigment', homeworksAssigment); eco.Views.TaskStudent

        /** Studenti **/
        // router.on('route:showStudents', showStudents);
        // router.on('route:showStudentsHwList', showStudentsHwList);

        /** Schémata **/
        // router.on('route:showSchemas', showSchemaListAndNew);
        // router.on('route:schemaCreateNew', showSchemaListAndNew);
        // router.on('route:openedSchema', showOpenSchema);
        // router.on('route:showSchemaEdit', showSchemaEdit);


        router.on('route:showGroupHomeworks', showGroupHomeworks);

        router.on('route:showOwnTasks', showOwnTasks);
        router.on('route:showTaskDetail', showTaskDetail);
        router.on('route:editTask', editTask);

        router.on('route:showHwDetail', showHwDetail);

        router.on('route:defaultRoute', defaultRoute);



        //global Variables
        var main = $('#page_main_content'),
            main_tab = $('#container--pages'),
            main_bar = $('#main_bar');
        var schemaContainer = $('#canvasWrapper'),
            schemas_tab = $('#container--schemas');

        var baseTitle = $('title').html();

        // var user = new eco.Models.Student();
        // user.fetch();

        var schemas = new eco.Collections.Schemas();
        schemas.fetch();
        var groups = new eco.Collections.GroupCollection(null,{
            url: eco.basedir+"/api/groups"
        });

        var entities = new eco.Collections.Entities();
        entities.fetch();
        var categories = new eco.Collections.Categories();
        categories.fetch();

        var activeSchemaView = null,
            openedSchemas = new eco.Collections.Schemas(null,{local: true}),
            openedSchemasPapers = {};

        var openedSchemasButtonsView = new eco.Views.SchemasListView({collection: openedSchemas, active: activeSchemaView});


        var categoriesView = new eco.Views.CategoriesView({model: new eco.Models.EntityPanel({
            entities: entities,
            categories: categories,
        })});


        /**
         * Uloží do DB aktivní schéma
         */
        $("#saveSchema").on('click', function () {
            saveSchema(activeSchemaView);
        });

        /**
         * Uloží do DB předané schéma
         * @param schema
         */
        function saveSchema(schema){
            if (schema){
                schema.saveGraph();
            }
        }

        /**
         * Nastaví titulek stránky
         * @param title Text titulku
         * @param showBase pokud je true, tak zobrazí i název stránky
         */
        function setPageTitle(title, showBase) {
            showBase = typeof showBase !== 'undefined' ? showBase : true;
            if (showBase)
            {
                $('title').html(title + ' | ' + baseTitle);
            } else
            {
                $('title').html(title);
            }
        }

        function showSchema(schema) {
            console.log('%c showSchema ', 'background: yellow; color:white;', schema);

            //schovat posledně zobrazené schéma
            hideSchemaPaper(activeSchemaView);

            if (isSchemaOpen(schema)) {
                reopenSchema(schema);
            } else {
                openSchema(schema);
            }

            setPageTitle(schema.get('name'));
        }


        function openSchema(schema){
            console.log('%c openSchema ', 'background: yellow; color: red', schema.get('id'), schema, activeSchemaView);

            var paper = eco.createPaper(schema);

            // schema.fetch({
            //     success: function () {
            console.log('schema success', schema);
            schema.loadGraph(function () {
                console.log('%c schema loaded graph!! ', 'background: yellow; color: red', schema.get('graph'));

                var graph = schema.get('graph');

                schema.set('opened', true); // nastavení indikátoru, že je otevřeno
                openedSchemas.add(schema); //přidáme schéma do kolekce otevřených
                addOpenedPaper(schema, paper);

                showSchemaPaper(schema);
                setSchemaActive(schema);

                var sim = new eco.Models.Simulation({paper: paper});
                sim.startSimulation();

                paper.$el.droppable({
                    drop: function( event, ui ) {
                        console.log("paper DROP", ui, $(ui.helper), $(ui.draggable));
                        var entityId = parseInt($(ui.helper).attr('data-entityid'));
                        console.log("categories", entities);
                        console.log("catId", entityId);

                        var foundEntity = (entities.find(function (x) {
                            return x.get('id') == entityId;
                        }));

                        var entityName = foundEntity.get('name');
                        console.log(entityName);
                        if (joint.shapes.mylib[entityName]){
                            var newCell = new joint.shapes.mylib[entityName]({ position: {
                                x: ui.offset.left - schemaContainer.offset().left,
                                y: ui.offset.top - schemaContainer.offset().top
                            }});
                            schema.get('graph').addCell(newCell);
                            //TODO: Přidat label hlavně u vstupů a výstupů s ID od counteru
                        }
                        else {
                            foundEntity.set('disabled', true);
                        }
                    }
                });
            });

        }

        function showSchemaPaper(schema) {
            console.log('%c showSchemaPaper ', 'background: yellow', schema);
            if (schema) {
                var paper = openedSchemasPapers[schema.get('id')];
                if (paper) {
                    console.log('paper:', paper);
                    paper.$el.show();
                }
            }
        }

        function hideSchemaPaper(schema) {
            console.log('%c hideSchemaPaper ', 'background: yellow', schema);
            if (schema) {
                var paper = openedSchemasPapers[schema.get('id')];
                if (paper){
                    console.log('paper:', paper);
                    paper.$el.hide();
                }
            }
        }

        function isSchemaActive(schema) {
            return activeSchemaView && activeSchemaView.get('id') == schema.get('id');
        }

        function isSchemaOpen(schema) {
            if (_.isNumber(schema)){
                return (!!openedSchemasPapers[schema]);
            }else{
                return (!!openedSchemasPapers[schema.get('id')]);
            }
        }

        function setSchemaActive(schema) {
            activeSchemaView = schema;
            openedSchemasButtonsView.setActiveSchema(schema);
        }

        function addOpenedPaper(schema, paper){
            openedSchemasPapers[schema.get('id')] = paper;
        }

        function reopenSchema(schema) {
            console.log('%c reopenSchema ', 'background: yellow; color: blue', schema.get('id'), schema, activeSchemaView);
            showSchemaPaper(schema);
            setSchemaActive(schema);
        }

        /*
         * Nsledují router metody
         */

        function defaultRoute() {
            console.log("404 Stránka nenalezena.");
            setPageTitle('404 Stránka nenalezena');
            main.html('<h1>404 Stránka nenalezena</h1>');
            main_tab.show();
            schemas_tab.hide();

            // router.navigate('schemas/new', {
            //     trigger: true,
            //     replace: true
            // });
        }

        // TODO deprecated
        /**
         * Stránka pro zadánání úkolů (nezávisle na skupině)
         * Možnost hromadného zadávání
         */
        function homeworksAssigment() {
            setPageTitle('Seznam zadání');
            main.html('');
            eco.ViewGarbageCollector.clear();

            //load teachers tasks
            var tasks_collection = new eco.Collections.Tasks(null, {
                url: eco.basedir+"/api/tasks",
            });

            //load students in teachers groups
            var students_collection = new eco.Collections.Students(null, {
                url: eco.basedir+"/api/students",
            });

            var task_student_view = new eco.Views.TaskStudent({
                tasks_collection: tasks_collection,
                students_collection: students_collection
            });

            main.append(task_student_view.$el);

            $('.datepicker').datepicker({
                language: 'cs'
            });

            tasks_collection.fetch();
        }
        /**
         * Zobrazí detail zadání pro studenta
         * s možnosti přidání řešení a odevzdáním
         * route:showHwDetail
         * @param id
         */
        function showHwDetail(id) {
            setPageTitle('Úkol');
            main.empty();
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();

            var hw = new eco.Models.HomeworkTeacher({
                id: id,
            });
            var detailView = new eco.Views.HomeworkTeacherDetail({
                model: hw,
            });

            main.append(detailView.render().$el);
            hw.fetch();
        }

        function showGroupHomeworks(id) {
            //TODO: omezit práva pouze pro vyučující (i na serrveru)
            setPageTitle('Seznam úkolů');
            main.html('');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();

            var $title = $("<h1></h1>");
            var group = new eco.Models.Group({id:id});
            group.fetch({
                success: function (model) {
                    $title.text('Úkoly studentů skupiny: '+model.get('subject'));
                }
            });

            var collection = new eco.Collections.Homeworks(null,{
                url: eco.basedir+"/api/groups/"+id+"/homeworks",
            });

            var view = new eco.Views.GroupHomeworkList({
                template: '#homeworkTeacherList-template',
                itemTemplate: '#homeworkTeacherListItem-template',
                formater: eco.Formaters.HwTeacherFormater,
                collection: collection,
                uniqueId: 'groupsHwList',
                searchNames: [
                    "list-name",
                    "list-user",
                    "list-termin",
                    "list-status",
                ]
            });

            main.append($title);
            main.append(view.$el);

            collection.fetch();
        }

        function showOwnTasks() {
            //TODO: omezit práva pouze pro vyučující (i na serveru)
            setPageTitle('Zadání');
            main.html('');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();

            var vent = _.extend({}, Backbone.Events);

            var collection = new eco.Collections.Tasks(null, {
                url: eco.basedir+"/api/tasks",
            });

            var view = new eco.Views.Tasks({
                title: "Seznam zadání",
                template: '#tasksList-template',
                itemTemplate: '#tasksListItem-template',
                formater: eco.Formaters.TasksFormater,
                collection: collection,
                searchNames: [
                    'list-name',
                    'list-created',
                    'list-etalon',
                    'list-test',
                ],
                vent: vent,
            });

            collection.fetch();

            // část s formulářem pro nové zadání
            var viewAddNew = new eco.Views.GenericForm({
                title: "Přidat nové zadání",
                template: '#taskForm-template',
                mapper: function ($element) {
                    return {
                        'name': $element.find('#task_name').val(),
                        'description': $element.find('#task_description').val(),
                    }
                },
                model: new eco.Models.Task(),
                vent: vent,
                collection: collection,
            });
            main.append(viewAddNew.render().$el);
            main.append(view.$el);

        }

        function editTask(id){
            setPageTitle('Seznam zadání');
            var main = $('#page_main_content');
            main.empty('');
            eco.ViewGarbageCollector.clear();

            var vent = _.extend({}, Backbone.Events);

            var model = new eco.Models.Task({
                url: eco.basedir+"/api/tasks/"+id,
            });
            model.fetch();

            var viewAddNew = new eco.Views.EditTask({
                title: "Upravit zadání",
                template: '#taskEditForm-template',
                mapper: eco.Mappers.TaskEditMapper,
                model: model,
            });

            var files = new eco.Collections.Files(null,{
                url: eco.basedir+'/api/tasks/'+id+'/files',
            });

            console.log("FILES", files);

            // část pro výpis souborů
            var filesView = new eco.Views.Files({
                title: "Soubory k zadání",
                template: '#tasksFilesList-template',
                itemTemplate: '#tasksFilesItem-template',
                formater: eco.Formaters.FileFormater,
                collection: files,
                searchNames: [
                    'list-file',
                    'list-type',
                ],
                vent: vent,
            });

            files.fetch();

            // část s formulářem pro nové zadání
            var addFileView = new eco.Views.AddFileForm({
                template: '#taskFilleAddForm-template',
                vent: vent,
                model: model,
                task_id: id,
            });

            main.append(viewAddNew.$el);
            main.append(addFileView.render().$el);
            main.append(filesView.render().$el);
        }

        function showTaskDetail(id) {
            //TODO: pro_studenty
            //TODO: Tento pohled nechat jen pro studenty a zobrazit zde soubory ke stažení (k zadání)
            main.empty();
            setPageTitle('Seznam zadání');

            eco.ViewGarbageCollector.clear();

            var model = new eco.Models.Task({id: id});

            var view = new eco.Views.GenericDetail({
                template: '#taskDetail-template',
                formater: eco.Formaters.TasksFormater,
                model: model,
                el: main
            });


            model.fetch();
        }

        /**
         * Zobrazí formulář pro vytvoření nové skupiny a seznam existujících skupin
         */
        function showGroups() {
            setPageTitle('Skupiny');
            main.empty();
            eco.ViewGarbageCollector.clear();
            var groupsView = new eco.Views.GroupsList({
                template: '#groupsList-template',
                itemTemplate: '#groupsListItem-template',
                formater: eco.Formaters.GroupFormater,
                searchNames: [
                    'list-subject',
                    'list-day',
                    'list-block',
                    'list-weeks',
                    'list-teacher',
                    'list-created',
                ],
                collection: groups,
            });

            var newModel = new eco.Models.Group({});

            var addGroupView = new eco.Views.GroupAddForm({
                title: "Vytvoření nové skupiny",
                template: "#addGroupForm-template",
                mapper: function ($element) {
                    var result = eco.Utils.mapValues({
                        'subject': eco.Utils.inputParsers.byValue,
                        'day': eco.Utils.inputParsers.byValue,
                        'weeks': eco.Utils.inputParsers.byValue,
                        'block': eco.Utils.inputParsers.byValue,
                    }, "#nova_skupina-" , $element);
                    return result;
                },
                model: newModel,
                collection: groups,
            });
            addGroupView.render();

            main.append(addGroupView.$el);
            main.append(groupsView.$el);

            groups.fetch();
        }

        /**
         * Zobrazí detail skupiny se seznamem studentů
         * route:showGroupDetail/:id
         * @param id
         */
        function showGroupDetail(id) {
            setPageTitle('Detail skupiny');
            main.empty();
            // eco.ViewGarbageCollector.clear();
            // var students = new eco.Collections.Students();
            var group = new eco.Models.Group({id:id});
            // students.url = 'api/groups/'+id+'/students';
            // console.log('route:circleDetail', id, students);
            var groupsDetailView = new eco.Views.GroupDetail({
                template: '#groupsDetail-template',
                model: group,
            });
            group.fetch();
            main.append(groupsDetailView.$el);
        }

        /**
         * Přesměruje na skupiny pro domovskou stránku
         */
        function showHome() {
            main.empty();
            router.navigate('groups', {
                trigger: true,
                replace: true
            });
        }

        Backbone.history.start();
    },
    /**konec router metod**/

};

