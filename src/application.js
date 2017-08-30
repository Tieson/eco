/**
 * Created by Tomáš Václavík on 13.04.2017.
 */


window.eco = {
    Models: {},
    Collections: {},
    Views: {},
    Formaters: {},
    Validators: {},
    Mapper: {},
    Utils: getUtils(),
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
        router.on('route:showHwList', showStudentsHomeworkList);
        router.on('route:showHwDetail', showHomeworkDetail);

        /** Skupiny **/
        router.on('route:showGroups', showGroups);
        router.on('route:showGroupDetail', showGroupDetail);
        // router.on('route:addGroup', showAddGroup);

        /** Studenti **/
        // router.on('route:showStudents', showStudents);
        router.on('route:showUserGroups', showUserGroups);
        router.on('route:showUserGroupDetail', showUserGroupDetail);
        // router.on('route:showStudentsHwList', showStudentsHwList);

        /** Schémata **/
        router.on('route:showSchemas', showSchemaListAndNew);
        router.on('route:schemaCreateNew', showSchemaNew);
        router.on('route:openedSchema', showOpenSchema);
        router.on('route:showSchemaEdit', showSchemaEdit);

        router.on('route:schemaExportVhdl', schemaExportVhdl);


        // router.on('route:showGroupHomeworks', showGroupHomeworks);

        // router.on('route:showTasks', showTasks);
        router.on('route:showAllTasks', showAllTasks);
        router.on('route:showTaskDetail', showTaskDetail);
        router.on('route:editTask', editTask);

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
        var groups = new eco.Collections.GroupCollection({
            url: "/api/groups"
        });

        var entities = new eco.Collections.Entities();
        entities.fetch();
        var categories = new eco.Collections.Categories();
        categories.fetch();

        var activeSchemaView = null,
            openedSchemas = new eco.Collections.Schemas(null,{local: true}),
            openedSchemasPapers = {};

        var openedSchemasButtonsView = new eco.Views.SchemasListView({collection: openedSchemas, active: activeSchemaView});


        //MOCK user object
        var user = {
            get: function (key) {
                switch(key){
                    case 'id':
                        return 1;
                    case 'student_id':
                        return 9;
                    default:
                        return null;
                }
            }
        };

        var categoriesView = new eco.Views.CategoriesView({model: new eco.Models.EntityPanel({
            entities: entities,
            categories: categories,
        })});

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


        $("#saveSchema").on('click', function () {
            saveSchema(activeSchemaView);
        });

        function saveSchema(schema){
            if (schema){
                schema.saveGraph();
            }
        }

        function showSchema(schema) {
            main_tab.hide();
            schemas_tab.show();
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

            var counter = createSetCounter(0);

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

                                var foundEntity = entities.get(entityId);

                                var entityName = foundEntity.get('name');
                                console.log(entityName);
                                if (joint.shapes.mylib[entityName]){
                                    var newCell = new joint.shapes.mylib[entityName]({ position: {
                                        x: ui.offset.left - schemaContainer.offset().left,
                                        y: ui.offset.top - schemaContainer.offset().top
                                    }});
                                    // x.attr('custom', );
                                    var number = counter.inc(entityName);
                                    var elemLabel = eco.Utils.getElementLabel(entityName);
                                    if (elemLabel!==undefined){
                                        var uniqueName = elemLabel + number;
                                        newCell.attr('.label/text', uniqueName);
                                    }else{
                                        var uniqueName = entityName+'_'+number;
                                    }
                                    newCell.attr('custom', {
                                        type: entityName,
                                        name: elemLabel,
                                        number: number,
                                        uniqueName: uniqueName,
                                        label: foundEntity.get('label'),
                                    });
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


        /**
         * Nsledují router metody
         */

        function defaultRoute() {
            console.log("404 Stránka nenalezena.");
            setPageTitle('404 Stránka nenalezena');
            main.html('<h1>404 Stránka nenalezena</h1>');
            main_tab.show();
            schemas_tab.hide();
        }


        function editTask(id){
            setPageTitle('Seznam zadání');
            main.html('');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();

            var vent = _.extend({}, Backbone.Events);

            var model = new eco.Models.Task({
                url: "/api/tasks/"+id,
            });

            var viewAddNew = new eco.Views.EditTask({
                title: "Upravit zadání",
                template: '#taskEditForm-template',
                mapper: eco.Mapper.TaskEditMapper,
                model: model,
            });
            model.fetch();
            main.append(viewAddNew.$el);

            var files = new eco.Collections.Files(null,{
                url: '/api/tasks/'+id+'/files',
            });

            console.log("FILES", files);

            // část pro výpis souborů
            var filesView = new eco.Views.Files({
                title: "Soubory",
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
            main.append(filesView.render().$el);

            files.fetch();

            // část s formulářem pro nové zadání
            var addFileView = new eco.Views.AddFileForm({
                template: '#taskFilleAddForm-template',
                vent: vent,
                model: model,
                task_id: id,
            });
            main.append(addFileView.render().$el);
        }

        function showAllTasks() {
            //TODO: omezit práva pouze pro vyučující (i na serrveru)
            setPageTitle('Seznam zadání');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();

            var collection = new eco.Collections.Tasks(null, {
                url: "/api/tasks",
            });

            var view = new eco.Views.GenericList({
                template: '#tasksList-template',
                itemTemplate: '#tasksListItem-template',
                formater: eco.Formaters.TasksFormater,
                collection: collection,
                el: main
            });

            collection.fetch();
        }
        function showTaskDetail(id) {
            //TODO: omezit práva pouze pro vyučující (i na serrveru)
            setPageTitle('Seznam zadání');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();

            var model = new eco.Models.Task({id: id});
            console.log(model);

            var view = new eco.Views.GenericDetail({
                template: '#taskDetail-template',
                formater: eco.Formaters.TasksFormater,
                model: model,
                el: main
            });

            model.fetch();
        }

        function showHome() {
            main_tab.hide();
            schemas_tab.show();

            // openedSchemas.fetch();

            if (!activeSchemaView) {
                //pokud nemám žádné schéma, tak přejít na stránku pro vytvořenín ebo otevření schéma
                router.navigate('schemas/new', {
                    trigger: true,
                    replace: true
                });
            }else{
                //přejít na poslední otevřené schéma
                router.navigate('schemas/'+activeSchemaView.get('id'), {
                    trigger: true,
                    replace: true
                });
            }

        }

        function showOpenSchema(id) {
            console.log('openedSchema', id);


            $(document).on('keydown', null, 'ctrl+s', function () {
                saveSchema(activeSchemaView);
                return false;
            });

            // var sch = new eco.Models.Schema({
            //     id:30
            // });
            // var paper = eco.createPaper(sch);
            // sch.loadGraph(function(){
            //     console.log('graph loaded');
            //     console.log(paper);
            // });

            if(isSchemaOpen(parseInt(id))){
                main_tab.hide();
                schemas_tab.show();
                showSchema(openedSchemas.get(id));
            }
            else {
                var nSchema = new eco.Models.Schema({id: id});
                nSchema.fetch({
                    success: function () {
                        showSchema(nSchema);
                    },
                    error: function () {
                        setPageTitle('Otevřít schéma');
                        main.html("<div class='alert alert-danger mt20'>Požadované schéma nebylo nalezeno!</div>");
                        showNewSchemaForm();
                        showSchemas();
                    }
                });
            }
            //TODO: dodělat zapamatovávání schémat a jejich otevírání
        }

        /**
         * Exportuje schéma podle id do VHDL a poskytne soubor.
         * Pouze pokud to je vlastní schéma - ověření uživatele (studenta)
         * @param id
         */
        function schemaExportVhdl(id) {
            setPageTitle('Domácí úkoly');
            main.empty();
            main_tab.show();
            schemas_tab.hide();

            var nSchema = new eco.Models.Schema({id: id});
            var vhdlExporter = new eco.Models.VhdlExporter({
                schema: nSchema,
            });
            nSchema.fetch({
                success: function () {

                    nSchema.loadGraph(function () {
                        var $button = $("<a href='#' class='btn btn-success'>Stáhnout schéma <strong>"+ nSchema.get('name') +"</strong> ve VHDL</a>");
                        main.append($('<div class="alert alert-info mt20">Pokud stahování nezačne automaticky, použijte následující tlačítko</div>'));
                        main.append($button);
                        vhdlExporter.saveVhdlToFile($button);
                    });
                    // showSchema(nSchema);
                },
                error: function () {
                    main.html("<div class='alert alert-danger'>Požadované schéma nebylo nalezeno!</div>");
                }
            });
        }

        function showStudentsHomeworkList() {
            setPageTitle('Domácí úkoly');
            main.empty();
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();
            console.log('route:showHwList');
            var hws = new eco.Collections.Homeworks(null,
                // {url: '/api/students/'+ user.get('student_id') + '/hw'}
                {url: '/api/students/hw'}
            );

            var hwView = new eco.Views.GenericList({
                title: "Úkoly",
                template: '#homeworkList-template',
                itemTemplate: '#homeworkListItem-template',
                formater: eco.Formaters.HomeworkFormater,
                collection: hws,
                searchNames: [
                    "list-name",
                    "list-termin",
                    "list-stav",
                ]
            });
            main.append(hwView.render().$el);
            hws.fetch();
        }

        /**
         * Zobrazí detail zadání pro studenta
         * s možnosti přidání řešení a odevzdáním
         * route:showHwDetail
         * @param id
         */
        function showHomeworkDetail(id) {
            setPageTitle('Úkol');
            main.empty();
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();

            var hw = new eco.Models.Homework({
                id: id,
            });
            var detailView = new eco.Views.HomeworkDetail({
                model: hw,
            });

            main.append(detailView.render().$el);
            hw.fetch();
        }

        function showUserGroups() {
            setPageTitle('Skupiny');
            main_tab.show();
            schemas_tab.hide();
            var groups = new eco.Collections.UserGroupCollection({
                url: "/api/students/"+user.get('student_id')+"/groups",
            });
            eco.ViewGarbageCollector.clear();
            var groupsView = new eco.Views.StudentAssignGroupsList({
                template: '#userGroupsList-template',
                itemTemplate: '#userGroupsListItem-template',
                formater: eco.Formaters.StudentGroupFormater,
                collection: groups,
                el: main
            });
            console.log("group url", groups);
            groups.fetch();
        }
        function showUserAddGroups() {
            setPageTitle('Přidání do skupiny');
            main_tab.show();
            schemas_tab.hide();
            var groups = new eco.Collections.GroupCollection({
                url: "/api/students/"+user.get('student_id')+"/groups",
            });
            eco.ViewGarbageCollector.clear();
            var groupsView = new eco.Views.GroupList({
                template: '#userInviteGroupsList-template',
                collection: groups,
                el: main
            });
            eco.ViewGarbageCollector.add(groupsView);
            console.log("group url", groups);
            groups.fetch();
        }

        function showUserGroupDetail(id) {
            setPageTitle('Detail skupiny');
            main_tab.show();
            schemas_tab.hide();
            var group = new eco.Models.Group({id:id});
            eco.ViewGarbageCollector.clear();
            var groupsView = new eco.Views.GroupDetail({
                model: group,
                el: main
            });
            group.fetch();
        }

        function showGroups() {
            setPageTitle('Skupiny');
            main.empty();
            main_tab.show();
            schemas_tab.hide();
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
            main.append(groupsView.$el);

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

            groups.fetch();
        }
        function showGroupDetail(id) {
            setPageTitle('Detail skupiny');
            main.empty();
            main_tab.show();
            schemas_tab.hide();
            // eco.ViewGarbageCollector.clear();
            // var students = new eco.Collections.Students();
            console.log('route:circleDetail', id);
            var group = new eco.Models.Group({id:id});
            // students.url = 'api/groups/'+id+'/students';
            // console.log('route:circleDetail', id, students);
            var groupsDetailView = new eco.Views.GroupDetail({
                // collection: students,
                model: group,
            });
            group.fetch();
            // students.fetch();
            main.append(groupsDetailView.$el);
        }

        function showSchemaEdit(id) {
            main_tab.show();
            schemas_tab.hide();

            schemas.fetch({
                success: function () {
                    var schema = schemas.get(id);
                    setPageTitle('Editace schéma '+ schema.get('name'));
                    main.html("");

                    var view = new eco.Views.SchemasNew({
                        model: schema,
                        submitText: 'Uložit',
                        titleText: 'Editace schéma'
                    });

                    view.on('schemaNewSubmit', function (schema) {
                        schema.save();
                        router.navigate('schemas', {
                            trigger: true,
                            replace: true
                        });
                    });

                    main.append(view.render().$el);
                }
            });
        }

        function showSchemas() {
            main_tab.show();
            schemas_tab.hide();

            var view = new eco.Views.SchemasOpenList({
                template: "#schemasOpenList-template",
                itemTemplate: "#schemasOpenItem-template",
                collection: schemas,
                searchNames: [
                    'list-name',
                    'list-architecture',
                    'list-created'
                ]
            });
            // view.listenTo(vent, 'schemaDelete', function (schema) {
            //     console.log('schemaDelete vent', schema);
            //     // schemas.remove(schema);
            // });
            main.append(view.render().$el);
        }

        function showNewSchemaForm() {
            main_tab.show();
            schemas_tab.hide();
            console.log('route:showSchemas');


            var view = new eco.Views.SchemasNew({
                model: new eco.Models.Schema()
            });

            view.on('schemaNewSubmit', function (schema) {
                schema.save();
                schemas.add(schema);

                showSchema(schema);
            });

            main.append(view.render().$el);

        }
        function showSchemaListAndNew() {
            setPageTitle('Vaše schémata');
            main.empty();
            // showNewSchemaForm();
            showSchemas();
        }

        function showSchemaNew() {
            setPageTitle('Vaše schémata');
            main.empty();
            showNewSchemaForm();
        }

        Backbone.history.start();
    },
    /**konec router metod**/


    createPaper: function (schema) {
        console.log("%c createPaper ", "background:cornflowerblue; color: #fff");

        var graph = schema.get('graph');

        var container = $("#canvasWrapper"),
            width = 2400,
            height = 1200;

        var paperContainer = $('<div class="paper"></div>');
        paperContainer.width(width);
        paperContainer.height(height);
        paperContainer.attr('id', schema.get('id'));

        container.append(paperContainer);


        //return null;
        var paper = new joint.dia.Paper({

            el: paperContainer,
            model: graph,
            width: width,
            height: height,
            gridSize: 7,
            snapLinks: true,
            linkPinning: false,
            defaultLink: new joint.shapes.mylib.Vodic,
            drawGrid: {
                color: '#333',
                thickness: 1
            },

            validateConnection: function (vs, ms, vt, mt, e, vl) {

                if (e === 'target') {
                    // target requires an input port to connect
                    if (!mt || !mt.getAttribute('class') || mt.getAttribute('class').indexOf('input') < 0) return false;

                    // check whether the port is being already used
                    var portUsed = _.find(this.model.getLinks(), function (link) {

                        return (link.id !== vl.model.id &&
                        link.get('target').id === vt.model.id &&
                        link.get('target').port === mt.getAttribute('port'));
                    });

                    return !portUsed;

                } else { // e === 'source'
                    // source requires an output port to connect
                    return ms && ms.getAttribute('class') && ms.getAttribute('class').indexOf('output') >= 0;
                }
            }
        });

        // paper.on('cell:pointerdblclick', function (cellView, evt, x, y) {
        //     var element = cellView.model;
        //     element.remove();
        // });

        return paper;
    }
};