/**
 * Created by Tomáš Václavík on 13.04.2017.
 */


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
    buttons: {
        'saveSchema': ".saveSchemaButton",
        'exportSchema': ".vhdlExportSchemaButton",
        'libDownload': "#menu-file-download_lib",
    },
    selectors: {
        'main': '#page_main_content',
        'main_bar': '#main_bar',
        'pages': '#container--pages',
        'schemas': '#container--schemas',
        'canvasWrapper': '#canvasWrapper',
    }
};

window.eco.start = function (data) {
    //Routes
    var router = new eco.Router();

    router.on('all', function () {

    });

    router.on('route:home', showHome);
    router.on('route:showHwList', showStudentsHomeworkList);
    router.on('route:showHwDetail', showHomeworkDetail);

    /** Skupiny **/
    router.on('route:showGroups', showGroups);
    router.on('route:showGroupDetail', showGroupDetail);
    // router.on('route:addGroup', showAddGroup);

    /** Studenti **/
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
    var main = $(eco.selectors.main),
        main_tab = $(eco.selectors.pages),
        main_bar = $(eco.selectors.main_bar);
    var schemaContainer = $(eco.selectors.canvasWrapper),
        schemas_tab = $(eco.selectors.schemas);

    var baseTitle = $('title').html();

    // var user = new eco.Models.Student();
    // user.fetch();

    var schemas = new eco.Collections.Schemas();
    schemas.fetch();
    var groups = new eco.Collections.GroupCollection(null, {
        url: eco.basedir + "/api/groups"
    });

    var entities = new eco.Collections.Entities([
        {id: "2", id_category: "2", name: "TUL_BUF", label: "Buffer"},
        {id: "3", id_category: "2", name: "TUL_INV", label: "INV"},
        {id: "4", id_category: "2", name: "TUL_AND", label: "AND"},
        {id: "5", id_category: "2", name: "TUL_OR", label: "OR"},
        {id: "6", id_category: "2", name: "TUL_NAND", label: "NAND"},
        {id: "7", id_category: "2", name: "TUL_NOR", label: "NOR"},
        {id: "8", id_category: "2", name: "TUL_XOR", label: "XOR"},
        {id: "10", id_category: "2", name: "NAND3", label: "NAND3"},
        {id: "11", id_category: "2", name: "AND3", label: "AND3"},
        {id: "12", id_category: "2", name: "OR3", label: "OR3"},
        {id: "49", id_category: "2", name: "NOR3", label: "NOR3"},
        {id: "13", id_category: "2", name: "NAND4", label: "NAND4"},
        {id: "14", id_category: "2", name: "AND4", label: "AND4"},
        {id: "48", id_category: "2", name: "OR4", label: "OR4"},
        {id: "15", id_category: "2", name: "NOR4", label: "NOR4"},
        {id: "50", id_category: "2", name: "XOR4", label: "XOR4"},
        {id: "51", id_category: "2", name: "XNOR4", label: "XNOR4"},
        {id: "16", id_category: "3", name: "MUX2", label: "MUX2"},
        {id: "17", id_category: "3", name: "MUX4", label: "MUX4"},
        {id: "18", id_category: "3", name: "MUX8", label: "MUX8"},
        {id: "19", id_category: "3", name: "DEC14", label: "DEC14"},
        {id: "20", id_category: "3", name: "DEC18", label: "DEC18"},
        {id: "21", id_category: "3", name: "PRIOCOD42", label: "Prioritní kodér 42"},
        {id: "22", id_category: "3", name: "PRIOCOD83", label: "Prioritní kodér 83"},
        {id: "23", id_category: "4", name: "RS", label: "RS"},
        // {id:"52", id_category:"4",  name:"RST",           label:"RST" },
        {id: "24", id_category: "4", name: "DL1", label: "DL1"},
        {id: "25", id_category: "4", name: "DL1AR", label: "DL1AR"},
        {id: "26", id_category: "4", name: "JKFF", label: "JKFF"},
        {id: "27", id_category: "4", name: "JKFFAR", label: "JKFFAR"},
        {id: "28", id_category: "4", name: "JKFFSR", label: "JKFFSR"},
        {id: "29", id_category: "4", name: "DFF", label: "DFF"},
        {id: "30", id_category: "4", name: "DFFAR", label: "DFFAR"},
        {id: "31", id_category: "4", name: "DFFSR", label: "DFFSR"},
        {id: "32", id_category: "5", name: "HALFADDER", label: "HALFADDER"},
        {id: "33", id_category: "5", name: "FULLADDER", label: "FULLADDER"},
        {id: "34", id_category: "5", name: "ADD4", label: "ADD4"},
        {id: "35", id_category: "5", name: "MUL8", label: "MUL8"},
        {id: "36", id_category: "5", name: "COMPARATORLEQ", label: "COMPARATORLEQ"},
        {id: "37", id_category: "6", name: "UPDOWNCOUNTER", label: "UPDOWNCOUNTER"},
        {id: "38", id_category: "6", name: "ARAM1x16", label: "ARAM1x16"},
        {id: "39", id_category: "6", name: "ARAM4x16", label: "ARAM4x16"},
        {id: "40", id_category: "6", name: "ARAM4x256", label: "ARAM4x256"},
        {id: "41", id_category: "6", name: "RAM1x16", label: "RAM1x16"},
        {id: "42", id_category: "6", name: "RAM4x16", label: "RAM4x16"},
        {id: "43", id_category: "6", name: "RAM4x256", label: "RAM4x256"},
        // {id:"44", id_category:"6",  name:"DPRAM4x256",    label:"DPRAM4x256" },
        {id: "45", id_category: "1", name: "INPUT", label: "INPUT"},
        {id: "46", id_category: "1", name: "OUTPUT", label: "OUTPUT"},
        {id: "47", id_category: "1", name: "CLK", label: "clock"},
    ]);
    // entities.fetch();
    var categories = new eco.Collections.Categories([
        {id: 1, name: 'Vstupy a výstupy', active: 1},
        {id: 2, name: 'Základní kombinační', active: 1},
        {id: 3, name: 'Komplexní kombinační', active: 1},
        {id: 4, name: 'Sekvenční', active: 1},
        {id: 5, name: 'Matematické', active: 1},
        {id: 6, name: 'Komplexní sekvenční obvody', active: 1},
    ]);
    // categories.fetch();

    var activeSchemaView = null,
        openedSchemas = new eco.Collections.Schemas(null, {local: true}), // seznam otevřených schémat.
        openedSchemasPapers = {};

    var openedSchemasButtonsView = new eco.Views.SchemasListView({collection: openedSchemas, active: activeSchemaView});


    //MOCK user object
    var user = {
        get: function (key) {
            console.log('%cMOCK user.get', 'color: white; backbround: red;', key);
            //TODO: odstranit mock objekt
            switch (key) {
                case 'id':
                    return 1;
                case 'student_id':
                    return 9;
                default:
                    return null;
            }
        }
    };

    var categoriesView = new eco.Views.CategoriesView({
        model: new eco.Models.EntityPanel({
            entities: entities,
            categories: categories,
        })
    });

    /**
     * Nastaví titulek stránky
     * @param title Text titulku
     * @param showBase pokud je true, tak zobrazí i název stránky
     */
    function setPageTitle(title, showBase) {
        showBase = typeof showBase !== 'undefined' ? showBase : true;
        if (showBase) {
            $('title').html(title + ' | ' + baseTitle);
        } else {
            $('title').html(title);
        }
    }


    /**
     * Rychlé uložení schéma pomocí tlačítka
     */
    $(eco.buttons.saveSchema).on('click', function () {
        saveSchema(activeSchemaView);
    });

    /**
     * rychlý export schéma do VHDL pomocí tlačítka v hlavičce
     */
    $(eco.buttons.exportSchema).on('click', function (e) {
        exportActiveSchema();
        e.preventDefault();
        e.stopPropagation();
        return false;
    });


    function exportActiveSchema() {
        var vhdlExporter = new eco.Models.VhdlExporter({
            schema: activeSchemaView,
        });
        if (activeSchemaView) {
            var a = $('<a href="#" target="_blank" style="display: none">');
            var file_name = activeSchemaView.get('name') + ".vhd";
            var data = vhdlExporter.getVHDL();
            var uriContent = 'data:application/octet-stream,' + encodeURIComponent(data);
            a.attr('href', uriContent);
            a.attr('download', file_name);
            a.attr('target', "_blank");
            a.appendTo($('body'));
            a[0].click(); // automatické stažení
            a.remove();
        }
    }

    /**
     * Funkce pro uložení schéma - využívána různými původci požadavku pro uložení (tlačítko, kláv. zkratka)
     * @param schema
     */
    function saveSchema(schema) {
        if (schema) {
            schema.saveGraph();
        }
    }

    function showSchema(schema) {

        schemas_tab.show();
        showButtons([eco.buttons.saveSchema, eco.buttons.exportSchema]);
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

    function openSchema(schema) {
        console.log('%c openSchema ', 'background: yellow; color: red', schema.get('id'), schema, activeSchemaView);

        var paper = eco.createPaper(schema);

        var counter = createSetCounter(0);

        console.log('schema success', schema);
        schema.loadGraph(function () {
            console.log('%c schema loaded graph!! ', 'background: yellow; color: red', schema.get('graph'));

            var graph = schema.get('graph');
            graph.set('counter', counter);

            schema.set('opened', true); // nastavení indikátoru, že je otevřeno
            openedSchemas.add(schema); //přidáme schéma do kolekce otevřených
            addOpenedPaper(schema, paper);

            showSchemaPaper(schema);
            setSchemaActive(schema);

            var sim = new eco.Models.Simulation({paper: paper});
            sim.startSimulation();

            eco.Utils.inicilizeCounterbyGraph(counter, graph);

            paper.$el.droppable({
                drop: function (event, ui) {
                    var entityId = parseInt($(ui.helper).attr('data-entityid'));
                    var foundEntity = entities.get(entityId);
                    var entityName = foundEntity.get('name');
                    console.log(entityName);
                    if (joint.shapes.mylib[entityName]) {
                        var newCell = new joint.shapes.mylib[entityName]({
                            position: {
                                x: ui.offset.left - schemaContainer.offset().left,
                                y: ui.offset.top - schemaContainer.offset().top
                            }
                        });
                        // x.attr('custom', );
                        var number = counter.inc(entityName);
                        var elemLabel = eco.Utils.getElementLabel(entityName);
                        if (elemLabel !== undefined) {
                            var uniqueName = elemLabel + number;
                            newCell.attr('.label/text', uniqueName);
                        } else {
                            var uniqueName = entityName + '_' + number;
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
            if (paper) {
                console.log('paper:', paper);
                paper.$el.hide();
            }
        }
    }

    function isSchemaActive(schema) {
        return activeSchemaView && activeSchemaView.get('id') == schema.get('id');
    }

    function isSchemaOpen(schema) {
        if (_.isNumber(schema)) {
            return (!!openedSchemasPapers[schema]);
        } else {
            return (!!openedSchemasPapers[schema.get('id')]);
        }
    }

    function setSchemaActive(schema) {
        activeSchemaView = schema;
        openedSchemasButtonsView.setActiveSchema(schema);
    }

    function addOpenedPaper(schema, paper) {
        openedSchemasPapers[schema.get('id')] = paper;
    }

    function reopenSchema(schema) {
        console.log('%c reopenSchema ', 'background: yellow; color: blue', schema.get('id'), schema, activeSchemaView);
        showSchemaPaper(schema);
        setSchemaActive(schema);
    }


    /**
     * Následují router metody
     */

    function defaultRoute() {
        console.log("404 Stránka nenalezena.");
        setPageTitle('404 Stránka nenalezena');
        main.html('<h1>404 Stránka nenalezena</h1>');
        main_tab.show();

    }


    //Deprecated - needitovat a nerozvýjet používá se verze ze souboru teacher.js
    function editTask(id) {
        setPageTitle('Seznam zadání');
        main.html('');
        main_tab.show();

        eco.ViewGarbageCollector.clear();

        var vent = _.extend({}, Backbone.Events);

        var model = new eco.Models.Task({
            url: eco.basedir + "/api/tasks/" + id,
        });

        var viewAddNew = new eco.Views.EditTask({
            title: "Upravit zadání",
            template: '#taskEditForm-template',
            mapper: eco.Mappers.TaskEditMapper,
            model: model,
        });
        model.fetch();
        main.append(viewAddNew.$el);

        var files = new eco.Collections.Files(null, {
            url: eco.basedir + '/api/tasks/' + id + '/files',
        });

        console.log("FILES", files);

        // část pro výpis souborů
        var filesView = new eco.Views.Files({
            title: "Soubory",
            noRecordsMessage: 'Zatím zde nejsou žádné soubory.',
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
        main.append(filesView.$el);

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
        eco.ViewGarbageCollector.clear();

        var collection = new eco.Collections.Tasks(null, {
            url: eco.basedir + "/api/tasks",
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
        schemas_tab.show();

        // openedSchemas.fetch();

        if (!activeSchemaView) {
            //pokud nemám žádné schéma, tak přejít na stránku pro vytvořenín ebo otevření schéma
            router.navigate('schemas/new', {
                trigger: true,
                replace: true
            });
        } else {
            //přejít na poslední otevřené schéma
            router.navigate('schemas/' + activeSchemaView.get('id'), {
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
        $(document).on('keydown', null, 'ctrl+e', function () {
            exportActiveSchema();
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

        if (isSchemaOpen(parseInt(id))) {
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

        main_tab.show();


        var nSchema = new eco.Models.Schema({id: id});
        var vhdlExporter = new eco.Models.VhdlExporter({
            schema: nSchema,
        });
        nSchema.fetch({
            success: function () {

                nSchema.loadGraph(function () {
                    var $button = $("<a href='#' target='_blank' class='btn btn-success'>Stáhnout schéma <strong>" + nSchema.get('name') + "</strong> ve VHDL</a>");
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

        main_tab.show();

        eco.ViewGarbageCollector.clear();
        console.log('route:showHwList');
        var homeworsk = new eco.Collections.Homeworks(null,
            {url: eco.basedir + '/api/students/hw'}
        );

        var hwView = new eco.Views.GenericList({
            title: "Úkoly",
            template: '#homeworkList-template',
            itemTemplate: '#homeworkListItem-template',
            formater: eco.Formaters.HomeworkFormater,
            collection: homeworsk,
            searchNames: [
                "list-name",
                "list-termin",
                "list-stav",
                "list-predmet",
            ]
        });
        main.append(hwView.render().$el);
        homeworsk.fetch({
            success: function () {
                showSnackbar('Načítání dokončeno.');
            },
            error: function () {
                showSnackbar('Nepodařilo se načíst domácí úkoly.');
            }
        });
    }

    /**
     * Zobrazí detail zadání pro studenta
     * s možnosti přidání řešení a odevzdáním
     * route:showHwDetail
     * @param id
     */
    function showHomeworkDetail(id) {
        setPageTitle('Úkol');
        main_tab.show();
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

        var groups = new eco.Collections.UserGroupCollection(null, {
            url: eco.basedir + "/api/students/groups",
        });
        eco.ViewGarbageCollector.clear();
        var groupsView = new eco.Views.StudentAssignGroupsList({
            template: '#userGroupsList-template',
            itemTemplate: '#userGroupsListItem-template',
            formater: eco.Formaters.StudentGroupFormater,
            collection: groups,
            // el: main
        });
        console.log("group url", groups);
        groups.fetch();
        main.append(groupsView.render().$el);
    }

    function showUserAddGroups() {
        setPageTitle('Přidání do skupiny');
        main_tab.show();

        var groups = new eco.Collections.GroupCollection(null, {
            url: eco.basedir + "/api/students/" + user.get('student_id') + "/groups",
            //TODO: odstranit mock objekt
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

        var group = new eco.Models.Group({id: id});
        eco.ViewGarbageCollector.clear();
        var groupsView = new eco.Views.GroupDetail({
            model: group,
            el: main
        });
        group.fetch();
    }

    function showGroups() {
        setPageTitle('Skupiny');

        main_tab.show();

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
                }, "#nova_skupina-", $element);
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

        main_tab.show();

        // eco.ViewGarbageCollector.clear();
        // var students = new eco.Collections.Students();
        console.log('route:circleDetail', id);
        var group = new eco.Models.Group({id: id});
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

        schemas.fetch({
            success: function () {
                var schema = schemas.get(id);
                setPageTitle('Editace schéma ' + schema.get('name'));
                main.html("");

                var view = new eco.Views.SchemasEdit({
                    model: schema,
                    collection: schemas,
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
                showSchemas();
            }
        });
    }

    function showSchemas() {
        main_tab.show();

        var view = new eco.Views.SchemasOpenList({
            template: "#schemasOpenList-template",
            itemTemplate: "#schemasOpenItem-template",
            formater: eco.Formaters.SchemaSimpleFormater,
            collection: schemas,
            searchNames: [
                'list-name',
                'list-architecture',
                'list-created'
            ]
        });

        main.append(view.render().$el);
    }

    /**
     * Zobrazí form pro nové schéma
     * route:showSchemas
     */
    function showNewSchemaForm() {
        main_tab.show();

        var view = new eco.Views.SchemasNew({
            collection: schemas
        });

        main.append(view.render().$el);
    }

    function showSchemaListAndNew() {
        setPageTitle('Vaše schémata');

        showNewSchemaForm();
        showSchemas();
    }

    function showSchemaNew() {
        setPageTitle('Vaše schémata');

        showNewSchemaForm();
        showSchemas();
    }

    Backbone.history.start();
},
    /**konec router metod**/


    window.eco.createPaper = function (schema) {
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
    };
