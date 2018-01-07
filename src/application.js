/**
 * Created by Tomáš Václavík on 13.04.2017.
 */


function beforeRoute() {
    $(document).off('keydown');

    $(eco.selectors.main).empty();
    $(eco.selectors.schemas).hide();
    $(eco.selectors.pages).hide();

    eco.Utils.hideButtons([eco.buttons.saveSchema, eco.buttons.exportSchema, eco.buttons.undo, eco.buttons.redo]);
}

eco.Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        'schemas': 'showSchemas', //seznam schémat uživatele
        'schemas/new': 'schemaCreateNew', //vytvoření nového schema
        'schemas/:id/vhdl': 'schemaExportVhdl', //exportuje schéma do hdl souboru
        'schemas/:id': 'openedSchema', //otevře schéma
        'schemas/:id/edit': 'showSchemaEdit', //upraví údaje schéma
        'students/groups': 'showUserGroups', //seznam skupin studenta
        'homeworks': 'showHwList', //seznam úkolů
        'homeworks/:id': 'showHwDetail', //detail úkolů

        'admin/rights': 'showAdmin', //detail úkolů

        '*path':  'defaultRoute', // defaultní: error 404
    },
    route: function(route, name, callback) {
        var router = this;
        if (!callback) callback = this[name];

        var f = function () {
            beforeRoute();
            callback && callback.apply(router, arguments);
        };
        return Backbone.Router.prototype.route.call(this, route, name, f);
    },
});

eco.activeSchemaModel = null;

eco.start = function (data) {
    var router = new eco.Router();

    router.on('all', function () { });

    router.on('route:home', showHome);
    router.on('route:showHwList', showStudentsHomeworkList);
    router.on('route:showHwDetail', showHomeworkDetail);

    /** Skupiny studenta **/
    router.on('route:showUserGroups', showUserGroups);

    /** Schémata **/
    router.on('route:showSchemas', showSchemaListAndNew);
    router.on('route:schemaCreateNew', showSchemaNew);
    router.on('route:openedSchema', showOpenSchema);
    router.on('route:showSchemaEdit', showSchemaEdit);

    router.on('route:schemaExportVhdl', schemaExportVhdl);

    router.on('route:defaultRoute', defaultRoute);


    router.on('route:showAdmin', showAdminSetRights);


    //global Variables
    var main = $(eco.selectors.main),
        main_tab = $(eco.selectors.pages);
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

    var entities = new eco.Collections.Entities();
    var categories = new eco.Collections.Categories();

    var openedSchemas = new eco.Collections.Schemas(null, {local: true}), // seznam otevřených schémat.
        openedSchemasPapers = {};
    var openedSchemasButtonsView = new eco.Views.SchemasListView({collection: openedSchemas, active: eco.activeSchemaModel});

    this.vent = _.extend({}, Backbone.Events);
    var categoriesView = new eco.Views.CategoriesView({
        model: new eco.Models.EntityPanel({
            entities: entities,
            categories: categories,
        }),
        vent: this.vent
    });

    categoriesView.listenTo(this.vent, 'onEntityClick', function (item, event) {
        if (eco.activeSchemaModel) {
            var graph = eco.activeSchemaModel.get('graph');

            var entityId = $(event.currentTarget).attr('data-entityid');
            var foundEntity = entities.get(entityId);
            var entityName = foundEntity.get('name');

            eco.Utils.addEntityToGraph(entityName, {
                x: 40,
                y: 40
            }, graph, foundEntity);
        }
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
        saveSchema(eco.activeSchemaModel);
    });

    /**
     * Rychlé zpět v editoru
     */
    $(eco.buttons.undo).on('click', function () {
        schemaUndo();
    });
    /**
     * Rychlé dopředu v editoru
     */
    $(eco.buttons.redo).on('click', function () {
        schemaRedo();
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
            schema: eco.activeSchemaModel,
        });
        if (eco.activeSchemaModel) {
            var file_name = eco.activeSchemaModel.get('name') + ".vhd";
            var data = vhdlExporter.getVHDL();
            eco.Utils.downloadAsFile(data, file_name);
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

    /**
     * Funkce zajistí otevření zadaného schéma - jeho zobrazení. Buď otevřen neotevřené nebo znovu zobrazí již otevřené.
     * @param schema
     */
    function showSchema(schema) {
        schemas_tab.show();
        eco.Utils.showButtons([eco.buttons.saveSchema, eco.buttons.exportSchema, eco.buttons.undo, eco.buttons.redo]);
        hideSchemaPaper(eco.activeSchemaModel); //schovat posledně zobrazené schéma
        if (isSchemaOpen(schema)) {
            reopenSchema(schema);
        } else {
            openSchema(schema);
        }
        setPageTitle(schema.get('name'));
    }

    function openSchema(schema) {
        var paper = eco.createPaper(schema, schemaContainer);
        var counter = createSetCounter(0);
        var sim = new eco.Models.Simulation({paper: paper});
        var undomanager = new Backbone.UndoManager({
            // maximumStackLength: 50,
        });
        schema.set('undomanager', undomanager);
        schema.set('sim', sim);

        schema.loadGraph(function () {
            var graph = schema.get('graph');
            graph.set('counter', counter);
            // schema.set('opened', true); // nastavení indikátoru, že je otevřeno
            openedSchemas.add(schema); //přidáme schéma do kolekce otevřených
            addOpenedPaper(schema, paper);
            showSchemaPaper(schema);
            setSchemaActive(schema);
            eco.Utils.inicilizeCounterbyGraph(counter, graph);
            sim.startSimulation();
            undomanager.register(graph);
            Backbone.UndoManager.removeUndoType("change");
            undomanager.startTracking();

            paper.$el.droppable({
                drop: function (event, ui) {
                    var entityId = parseInt($(ui.helper).attr('data-entityid'));
                    var foundEntity = entities.get(entityId);
                    var entityName = foundEntity.get('name');

                    eco.Utils.addEntityToGraph(entityName, {
                        x: ui.offset.left - schemaContainer.offset().left,
                        y: ui.offset.top - schemaContainer.offset().top
                    }, graph, foundEntity);
                }
            });
        });
    }

    function showSchemaPaper(schema) {
        if (schema) {
            var paper = openedSchemasPapers[schema.get('id')];
            if (paper) {
                paper.$el.show();
            }
        }
    }

    function hideSchemaPaper(schema) {
        if (schema) {
            var paper = openedSchemasPapers[schema.get('id')];
            if (paper) {
                paper.$el.hide();
            }
        }
    }

    function isSchemaOpen(schema) {
        if (_.isNumber(schema)) {
            return (!!openedSchemasPapers[schema]);
        } else {
            return (!!openedSchemasPapers[schema.get('id')]);
        }
    }

    function setSchemaActive(schema) {
        eco.activeSchemaModel = schema;
        openedSchemasButtonsView.setActiveSchema(schema);
    }

    function addOpenedPaper(schema, paper) {
        openedSchemasPapers[schema.get('id')] = paper;
    }

    function reopenSchema(schema) {
        showSchemaPaper(schema);
        setSchemaActive(schema);
    }


    /**
     * Následují router metody
     */

    function defaultRoute() {
        setPageTitle('404 Stránka nenalezena');
        main.html('<h1>404 Stránka nenalezena</h1>');
        main_tab.show();
    }

    function showHome() {
        schemas_tab.show();

        if (!eco.activeSchemaModel) {
            router.navigate('schemas', {
                trigger: true,
                replace: true
            });
        } else {
            //přejít na poslední otevřené schéma
            router.navigate('schemas/' + eco.activeSchemaModel.get('id'), {
                trigger: true,
                replace: true
            });
        }

    }

    function showAdminSetRights() {
        main_tab.show();
        eco.ViewGarbageCollector.clear();
        var users = new eco.Collections.Users();

        var view = new eco.Views.UsersAdminList({
            title: "Uživatelé a jejich oprávnění",
            template: '#adminList-template',
            itemTemplate: '#adminListItem-template',
            formater: eco.Formaters.UserFormater,
            collection: users,
            searchNames: [
                'list-mail',
                'list-name',
                'list-created',
                'list-activated',
                'list-role',
            ]
        });
        main.append(view.render().$el);
        users.fetch({
            success: function () {
                showSnackbar('Načítání dokončeno.');
            },
            error: function () {
                showSnackbar('Nepodařilo se načíst seznam uživatelů.');
            }
        });

    }

    function showOpenSchema(id) {
        if (entities.length<=1){
            entities.fetch();
        }
        if (categories.length<=1){
            categories.fetch();
        }
        $(document).on('keydown', null, 'ctrl+s', function () {
            saveSchema(eco.activeSchemaModel);
            return false;
        });
        $(document).on('keydown', null, 'ctrl+e', function () {
            exportActiveSchema();
            return false;
        });
        $(document).on('keydown', null, 'ctrl+z', function () {
            schemaUndo();
            return false;
        });
        $(document).on('keydown', null, 'ctrl+shift+z', function () {
            schemaRedo();
            return false;
        });

        if (isSchemaOpen(parseInt(id))) {
            showSchema(openedSchemas.get(id));
        }
        else {
            var schema = new eco.Models.Schema({id: id});
            schema.fetch({
                success: function () {
                    showSchema(schema);
                },
                error: function () {
                    router.navigate('schemas', {trigger: true, replace: true});
                    showSnackbar('Požadované schéma nebylo nalezeno!');
                }
            });
        }
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
        });
        groups.fetch();
        main.append(groupsView.render().$el);
    }

    function showSchemaEdit(id) {
        main_tab.show();

        schemas.fetch({
            success: function () {
                var schema = schemas.get(id);
                if (!schema) {
                    showSnackbar('Schéma k úpravě nenalezeno!');
                    router.navigate('schemas', {
                        trigger: true,
                        replace: true
                    });
                }
                setPageTitle('Editace schéma ' + schema.get('name'));
                main.html("");

                var view = new eco.Views.SchemasEdit({
                    model: schema,
                    collection: schemas,
                    submitText: 'Uložit',
                    titleText: 'Editace schéma',
                    mapper: eco.Mappers.schemaEditMapper,
                    template: '#schemasNew-template',
                    validator: eco.Validators.SchemaValidator,
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
            collection: schemas,
            validator: eco.Validators.SchemaValidator,
            mapper: eco.Mappers.schemaEditMapper,
            template: '#schemasNew-template',
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


    function schemaUndo() {
        var undomanager = eco.activeSchemaModel.get('undomanager');
        if (undomanager) {
            undomanager.undo(true);
            eco.Utils.recoutSchemaCounters(eco.activeSchemaModel);
        }
    }
    function schemaRedo() {
        var undomanager = eco.activeSchemaModel.get('undomanager');
        if (undomanager) {
            undomanager.redo(true);
            eco.Utils.recoutSchemaCounters(eco.activeSchemaModel);
        }
    }

    Backbone.history.start();
},
    /**konec router metod**/


    window.eco.createPaper = function (schema, $container, size) {
        // console.log("%c createPaper ", "background:cornflowerblue; color: #fff");

        var size = _.extend({}, {width: 2400, height: 1200}, size);
        var graph = schema.get('graph');

        var container = $container;

        var paperContainer = $('<div class="paper"></div>');
        paperContainer.width(size.width);
        paperContainer.height(size.height);
        paperContainer.attr('id', schema.get('id'));
        paperContainer.attr('data-id', schema.get('id'));

        container.append(paperContainer);


        //return null;
        var paper = new joint.dia.Paper({

            el: paperContainer,
            model: graph,
            width: size.width,
            height: size.height,
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
