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
    ViewGarbageCollector: {
        items: [],
        clear: function () {
            _.each(this.items, function (item) {
                if (item && item.remove) {
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
        var main = $('#page_main_content'),
            main_tab = $('#container--pages');
        var schemaContainer = $('#canvasWrapper'),
            schemas_tab = $('#container--schemas');

        var router = new eco.Router();

        var schemas = new eco.Collections.Schemas();
        schemas.fetch();
        var groups = new eco.Collections.GroupCollection();


        var baseTitle = $('title').html();

        var activeSchemaView = null,
            openedSchemas = new eco.Collections.Schemas(null,{local: true}),
            openedSchemasPapers = {};

        var openedSchemasButtonsView = new eco.Views.SchemasListView({collection: openedSchemas, active: activeSchemaView});

        function openSchema(schema) {
            console.log('openSchema', schema);
            if (!openedSchemasPapers[schema.get('id')]){
                console.log('neobsahuje schéma________________');
                openedSchemas.add(schema); //přidáme schéma do kolekce otevřených
                schema.set('opened', true); // nastavení indikátoru, že je otevřeno


                schema.fetch();
                schema.loadGraph();
                schema.initializeGraph();
                var paper = eco.createPaper("", schema.get('graph'));
                // schema.set('paper', paper);
                openedSchemasPapers[schema.get('id')] = paper;
            }
            if (openedSchemasPapers[schema.get('id')]){
                //paper existuje
            }else{
                var paper = eco.createPaper("", schema.get('graph'));
                openedSchemasPapers[schema.get('id')] = paper;
            }

            if (activeSchemaView){
                //schovat posledně zobrazené schéma
                // var paper = activeSchemaView.get('paper');
                openedSchemasPapers[activeSchemaView.get('id')].$el.hide();
            }
            activeSchemaView = schema;

            $('title').html(schema.get('name') + ' | ' + baseTitle);
            openedSchemasButtonsView.setActiveSchema(schema);
            // openedSchemasButtonsView.render();
            openedSchemasPapers[schema.get('id')].$el.show();
        }


        router.on('route:home', function() {
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
                router.navigate('schema/'+activeSchemaView.get('id'), {
                    trigger: true,
                    replace: true
                });
            }

        });
        router.on('route:openedSchema', function(id) {
            console.log('openedSchema', id);


            var requestedSchema = openedSchemas.get(id);
            console.log(requestedSchema);
            if(requestedSchema){
                main_tab.hide();
                schemas_tab.show();
                openSchema(requestedSchema);
            }
            else {
                var nSchema = new eco.Models.Schema({id: id});
                nSchema.fetch({
                    success: function () {
                        openSchema(nSchema);
                    },
                    error: function () {
                        $('title').html('Otevřít schéma | ' + baseTitle);
                        main.html("<div class='alert alert-danger'>Požadované schéma nebylo nalezeno!</div>");
                        showNewSchemaForm();
                        showSchemas();
                    }
                });

            }

            //TODO: dodělat zapamatovávání schémat a jejich otevírání
        });

        router.on('route:teacher', function() {
            console.log('route:teacher');
            router.navigate('teacher/circles', {
                trigger: true,
                replace: true
            });
        });
        router.on('route:showHwList', function() {
            $('title').html('Domácí úkoly | ' + baseTitle);
            main.html('');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();
            console.log('route:showHwList');
            var hws = new eco.Collections.Homeworks({student_id: 9}); //TODO: dinamicky získávat id uživatele
            var view = new eco.Views.HomeworkList({
                collection: hws,
                el: main
            });
            hws.fetch();
        });
        router.on('route:showCircles', function() {
            $('title').html('Skupiny | ' + baseTitle);
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();
            console.log('route:showCircles');
            var groupsView = new eco.Views.GroupList({
                collection: groups,
                el: main
            });
            groups.fetch();
            // groupsView.show();
        });
        router.on('route:circleDetail', function(id) {
            $('title').html('Detail skupiny | ' + baseTitle);
            // eco.ViewGarbageCollector.clear();
            console.log('route:circleDetail', id);
            var students =new eco.Collections.Students();
            var group = new eco.Models.Group({id:id});
            group.fetch();
            students.url = 'api/groups/'+id+'/students';
            students.fetch();
            var groupsDetailView = new eco.Views.GroupDetail({
                collection: students,
                model: group,
            });
        });

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

                openSchema(schema);
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

                openSchema(schema);
            });

            main.append(view.render().$el);

        }
        function showSchemaListAndNew() {
            $('title').html('Schémata | ' + baseTitle);
            main.html("");
            showNewSchemaForm();
            showSchemas();
        }

        router.on('route:showSchemas', showSchemaListAndNew);
        router.on('route:schemaCreateNew', showSchemaListAndNew);

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


    createPaper: function ($element, graph) {
        console.log("%ccreatePaper", "color:cornflowerblue", $element, graph);


        var container = $("#canvasWrapper"),
            width = 2400,
            height = 1200;

        var paperContainer = $('<div class="paper"></div>');
        paperContainer.width(width);
        paperContainer.height(height);

        container.append(paperContainer);

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

        paper.on('cell:pointerclick', createCellDoubleclickHandler(function (cellView, evt, x, y) {
            console.log("dbclick");
            // if (cellView.model instanceof joint.shapes.mylib.HradloIO) {
            //     cellView.model.switchSignal();
            //     broadcastSignal(cellView.model, cellView.model.signal, self);
            //     V(cellView.el).toggleClass('live', cellView.model.signal > 0);
            // }
        }));
        paper.on('cell:pointerclick', function (cellView) {

            // console.log(cellView.model.get('outPorts') );
            console.log("click", this.model.getConnectedLinks(cellView.model, {outbound: true}).map(function (x) {
                return x;
            }) );
            /**
             * Po kliknutí na hodiny je vypnout/zaponout
             */
            // if (cellView.model instanceof joint.shapes.mylib.CLK) {
            //     console.log(cellView.model.tickOn);
            //     cellView.model.tickOn = !cellView.model.tickOn;
            //     V(cellView.el).toggleClass('running', cellView.model.tickOn);
            // }
            // console.log(cellView.model.get('attrs'));
            // console.log(cellView.model.attr('.label/text'));
        });

        return paper;
    },
};



eco.AppView = Backbone.View.extend({
    el: "body",
    activeSchema: null, // aktivní schéma může být pouze jedno
    initialize: function (options) {

        this.schemas = new eco.Schemas(); // všechna schémata načtená ze serveru
        this.openedSchemas = new eco.Schemas(); // pouze otevřená schémata, která mají tab, graf, paper atd.

        this.modalView = new eco.SchemaModalView({
            template: '#template-modal',
        });

        this.openSchemaModalView = new eco.SchemaOpenListModalView({
            collection: this.schemas,
            title: "Otevřít schéma",
            template: "#schemaListModal-template"
        });

        this.hw = new eco.Homeworks({student_id: 8});
        this.hwListModalView = new eco.SchemaOpenListModalView({
            collection: this.hw,
            title: "Úkoly",
            template: "#homeworkList-template"
        });

        this.listenTo(this.openSchemaModalView, 'itemClick', this.modalOpenSchemaClick);
        this.listenTo(this.modalView, 'save', this.saveNewSchema);


        this.schemasView = new eco.SchemasListView({collection: this.openedSchemas, active: this.activeSchema});
        this.listenTo(this.schemasView, 'editSchema', this.editSchema);
        this.listenTo(this.schemasView, 'openSchema', this.openSchema);

        /**
         * Inicialiazace a načtení kategorií a entit, které lze vkládat do schéma
         */
        this.categories = new eco.Categories();
        this.categories.fetch();
        this.categoriesView = new eco.CategoriesView({
            el: "#ribbonContent",
            collection: this.categories,
            onEntityClick: this.onEntityClick
        });
    },
    events: {
        'click .entity': 'onEntityClick',
        'click #contentToggler': 'ribbonToggle',
        'click #addSchema': 'addNewSchema',
        'click #saveSchema': 'saveVHDL',
        'click #menu-file-open_schema': 'menuOpenSchema',
        'click #menu-task-show': 'menuTaskShow'
    },
    modalOpenSchemaClick: function (schema) {
        console.log("zase", this, schema);
        this.openedSchemas.add(schema);
    },
    menuOpenSchema: function () {
        console.log("menuOpenSchema");
        this.openSchemaModalView.show();
    },
    menuTaskShow: function () {
        console.log("menuTaskShow");
        this.hwListModalView.show();
    },
    onEntityClick: function (event) {
        var entityId = Number($(event.target).attr("data-entityid"));
        var categoryId = $(event.target).closest('.ribbon__contents__category').attr("data-categoryid");
        console.log(categoryId, entityId);
    },
    ribbonToggle: function () {
        console.log("toggle");
        var ribbon = $('#ribbon'),
            show = ribbon.find('.ribbon__toggle__show'),
            hide = ribbon.find('.ribbon__toggle__hide');
        if (!ribbon.hasClass('ribbon--hidden')) {
            ribbon.removeClass("ribbon--hidden");
            show.hide();
            hide.show();
        } else {
            ribbon.addClass("ribbon--hidden");
            show.show();
            hide.hide();
        }
        console.log(ribbon);
    },
    addNewSchema: function () {
        this.modalView.show({model: new eco.Schema(), title: "Create new schema"});
    },
    saveNewSchema: function (schema) {
        console.log("saveNewSchema", schema);
        schema.save({
            success: function (result, a) {
                console.log("ok", result, a);
            },
            error: function () {
                console.log("ko");
            }
        });
    },
    editSchema: function (schema) {
        this.modalView.show({model: schema, title: "Edit schema"});
    },
    saveVHDL: function () {
        if (this.activeSchema) {
            this.activeSchema.saveGraph();
        } else {
            console.log("není žádné aktivní schéma, vyberte schéma z nabídky.");
        }
    },
    setActiveSchema: function (schema) {
        var old = this.activeSchema;
        this.activeSchema = schema;
        if (this.activeSchema) {
            this.categoriesView.setActive(true);
        } else {
            this.categoriesView.setActive(false);
        }
    },
    openSchema: function (schema) {
        console.log("openSchema", schema);
        this.changeOpenedSchema(schema);
    },
    changeOpenedSchema: function (newSchema) {
        var lastOpenedSchema = this.activeSchema;
        console.log("changeOpenedSchema");
        if (lastOpenedSchema) {
            lastOpenedSchema.closeSchema();
        }
        this.setActiveSchema(newSchema);
        console.log("activeSchema", this.activeSchema);

        this.activeSchema.openSchema();
    },
    addTestElements: function (schema) {

        var gates = {
//                repeater: new joint.shapes.logic.Repeater({ position: { x: 410, y: 25 }}),
//                or: new joint.shapes.mylib.TUL_OR({ position: { x: 550, y: 50 }}),
//                and: new joint.shapes.mylib.TUL_AND({ position: { x: 550, y: 150 }}),
            not: new joint.shapes.mylib.TUL_INV({position: {x: 90, y: 140}}),
            nand: new joint.shapes.mylib.TUL_NAND({position: {x: 550, y: 250}}),
            nand2: new joint.shapes.mylib.TUL_NAND({position: {x: 550, y: 250}}),
            nand3: new joint.shapes.mylib.TUL_NAND({position: {x: 550, y: 250}}),
            nand4: new joint.shapes.mylib.TUL_NAND({position: {x: 550, y: 250}}),
//                nor: new joint.shapes.mylib.TUL_NOR({ position: { x: 270, y: 190 }}),
//                xor: new joint.shapes.mylib.TUL_XOR({ position: { x: 550, y: 200 }}),
//                clk: new joint.shapes.mylib.CLK({ position: { x: 550, y: 100 }}),
            input: new joint.shapes.mylib.INPUT({position: {x: 5, y: 45}}),
            input2: new joint.shapes.mylib.INPUT({position: {x: 5, y: 45}}),
            input3: new joint.shapes.mylib.INPUT({position: {x: 5, y: 45}}),
//                vcc: new joint.shapes.mylib.VCC({ position: { x: 5, y: 100 }}),
//                gnd: new joint.shapes.mylib.GND({ position: { x: 5, y: 165 }}),
            output: new joint.shapes.mylib.OUTPUT({position: {x: 740, y: 340}}),
            output2: new joint.shapes.mylib.OUTPUT({position: {x: 740, y: 390}})
        };
        gates.input2.attr(".label/text", "X1");
        gates.input3.attr(".label/text", "X2");

        schema.get("graph").addCell(_.toArray(gates));
    }
});

