/**
 * Created by Tomáš Václavík on 13.04.2017.
 */

// Every logic gate needs to know how to handle a situation, when a signal comes to their ports.
joint.shapes.mylib.Hradlo.prototype.onSignal = function (signal, handler) {
//            console.log("joint.shapes.mylib.Hradlo.prototype.onSignal", this);
    handler.call(this, 0, signal);
};



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
        router.on('route:showHwList', showHomeworkList);
        router.on('route:showHwDetail', showHomeworkDetail);

        /** Skupiny **/
        router.on('route:showGroups', showGroups);
        router.on('route:showGroupDetail', showGroupDetail);
        router.on('route:addGroup', showAddGroup);

        /** Studenti **/
        // router.on('route:showStudents', showStudents);
        router.on('route:showUserGroups', showUserGroups);
        router.on('route:showUserGroupDetail', showUserGroupDetail);
        // router.on('route:showStudentsHwList', showStudentsHwList);

        /** Schémata **/
        router.on('route:showSchemas', showSchemaListAndNew);
        router.on('route:schemaCreateNew', showSchemaListAndNew);
        router.on('route:openedSchema', showOpenSchema);
        router.on('route:showSchemaEdit', showSchemaEdit);


        router.on('route:showGroupHomeworks', showGroupHomeworks);

        router.on('route:showTasks', showTasks);
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

        // main view zrušen protože potom nefunguje list otevřených schémat - je přepsán
        // var mainBarView = new eco.Views.MainBar({
        //     user: user,
        //     el: $('#main_bar'),
        // });


        var categoriesView = new eco.Views.CategoriesView({model: new eco.Models.EntityPanel({
            entities: entities,
            categories: categories,
        })});

        $("#saveSchema").on('click', function () {
            saveSchema(activeSchemaView);
        });


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
            //     }
            // });

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

            // router.navigate('schemas/new', {
            //     trigger: true,
            //     replace: true
            // });
        }

        function showGroupHomeworks(id_teacher) {
            //TODO: omezit práva pouze pro vyučující (i na serrveru)
            setPageTitle('Seznam zadání');
            main.html('');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();

            var collection = new eco.Collections.HomeworksTeacher({
                url: "/api/teachers/"+id_teacher+"/hw",
            });

            var view = new eco.Views.GenericList({
                template: '#hwList-template', //TODO: změnit šablony -- bude to D&D
                itemTemplate: '#hwListItem-template',
                formater: eco.Formaters.HwTeacherFormater,
                collection: collection,
            });
            main.append(view.$el);


            // var viewAddNew = new eco.Views.GenericForm({
            //     //TODo: předělat na úkoly!!!! --- celé to bude jinou formou D&D
            //     title: "Zadat úkol",
            //     template: '#taskForm-template',
            //     mapper: function ($element) {
            //         return {
            //             'name': $element.find('#task_name').val(),
            //             'description': $element.find('#task_description').val(),
            //             'etalon_file': $element.find('#task_etalon').val(),
            //             'test_file': $element.find('#task_test').val(),
            //         }
            //     },
            //     model: new eco.Models.Task(),
            // });
            // main.append(viewAddNew.render().$el);

            collection.fetch();
        }

        function showTasks(id) {
            //TODO: omezit práva pouze pro vyučující (i na serveru)
            setPageTitle('Zadání');
            main.html('');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();

            var vent = _.extend({}, Backbone.Events);

            var collection = new eco.Collections.Tasks(null, {
                url: "/api/teachers/"+id+"/tasks",
            });

            var view = new eco.Views.Tasks({
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
            main.append(view.$el);

            collection.fetch();


            // část s formulářem pro nové zadání
            var viewAddNew = new eco.Views.GenericForm({
                title: "Přidat nové zadání",
                template: '#taskForm-template',
                mapper: function ($element) {
                    return {
                        'name': $element.find('#task_name').val(),
                        'description': $element.find('#task_description').val(),
                        'etalon_file': $element.find('#task_etalon').val(),
                        'test_file': $element.find('#task_test').val(),
                    }
                },
                model: new eco.Models.Task(),
                vent: vent,
                collection: collection
            });
            main.append(viewAddNew.render().$el);

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
                        main.html("<div class='alert alert-danger'>Požadované schéma nebylo nalezeno!</div>");
                        showNewSchemaForm();
                        showSchemas();
                    }
                });
            }
            //TODO: dodělat zapamatovávání schémat a jejich otevírání
        }
        function showHomeworkList() {
            setPageTitle('Domácí úkoly');
            main.html('');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();
            console.log('route:showHwList');
            var hws = new eco.Collections.Homeworks(
                {url: '/api/students/'+ user.get('student_id') + '/hw'}
            ); //TODO: dinamicky získávat id uživatele
            var view = new eco.Views.HomeworkList({
                collection: hws,
                el: main
            });
            hws.fetch();
        }
        function showHomeworkDetail(id) {
            main.html('');
            main_tab.show();
            schemas_tab.hide();

            setPageTitle('Domácí úkol');
            eco.ViewGarbageCollector.clear();
            console.log('route:showHwDetail');
            var hw = new eco.Models.Homework({id: id, student_id: user.get('student_id')}); //TODO: dinamicky získávat id uživatele
            var view = new eco.Views.HomeworkDetail({
                model: hw,
                el: main
            });
            main.append(view.render().$el);
            hw.fetch();
        }
        function showUserGroups(id) {
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
        function showAddGroup() {
            setPageTitle('Vytvoření nové skupiny');
            main_tab.show();
            schemas_tab.hide();
            var group = new eco.Model.Group({});
            eco.ViewGarbageCollector.clear();
            var groupsView = new eco.Views.GroupAdd({
                template: '#addGroup-template',
                model: group,
                el: main
            });
            eco.ViewGarbageCollector.add(groupsView);
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
            console.log('route:showSchemas');


            var view = new eco.Views.SchemasOpenList({
                collection: schemas
            });

            view.on('schemaOpenClick', function (schema) {
                console.log('schemaOpenClick !! --- XXX', this, schema);
                main_tab.hide();
                schemas_tab.show();

                showSchema(schema);
            });

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
            setPageTitle('Schémata');
            main.html("");
            showNewSchemaForm();
            showSchemas();
        }

        /*router.on('route:new', function() {
            var newContactForm = new eco.Views.ContactForm({
                model: new eco.Models.Contact()
            });

            newContactForm.on('form:submitted', function(attrs) {
                attrs.id = contacts.isEmpty() ? 1 : (_.max(contacts.pluck('id')) + 1);
                contacts.add(attrs);
                router.navigate('contacts', true);
            });

            $('.main-container').html(newContactForm.render().$el);
        });

        router.on('route:editContact', function(id) {
            var contact = contacts.get(id),
                editContactForm;

            if (contact) {
                editContactForm = new eco.Views.ContactForm({
                    model: contact
                });

                editContactForm.on('form:submitted', function(attrs) {
                    contact.set(attrs);
                    router.navigate('contacts', true);
                });

                $('.main-container').html(editContactForm.render().$el);
            } else {
                router.navigate('contacts', true);
            }
        });*/

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

        return paper;
    }
};