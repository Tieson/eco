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
        var baseTitle = $('title').html();

        // var user = new eco.Models.Student();
        // user.fetch();

        var schemas = new eco.Collections.Schemas();
        schemas.fetch();
        var groups = new eco.Collections.GroupCollection();


        var activeSchemaView = null,
            openedSchemas = new eco.Collections.Schemas(null,{local: true}),
            openedSchemasPapers = {};

        var openedSchemasButtonsView = new eco.Views.SchemasListView({collection: openedSchemas, active: activeSchemaView});



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


        router.on('route:home', showHome);
        router.on('route:openedSchema', showOpenSchema);
        router.on('route:teacher', showTeacher);
        router.on('route:showHwList', showHomeworkList);
        router.on('route:showHwDetail', showHomeworkDetail);
        router.on('route:showUserGroups', showUserGroups);
        router.on('route:showUserGroupDetail', showUserGroupDetail);
        router.on('route:showCircles', showGroups);
        router.on('route:circleDetail', showGroupDetail);
        router.on('route:showSchemas', showSchemaListAndNew);
        router.on('route:schemaCreateNew', showSchemaListAndNew);
        router.on('route:showSchemaEdit', showSchemaEdit);

        /**
         * Nsledují router metody
         */

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
                router.navigate('schema/'+activeSchemaView.get('id'), {
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
        function showTeacher() {
            console.log('route:teacher');
            router.navigate('teacher/circles', {
                trigger: true,
                replace: true
            });
        }
        function showHomeworkList() {
            setPageTitle('Domácí úkoly');
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
        }
        function showHomeworkDetail(id) {
            main.html('');
            main_tab.show();
            schemas_tab.hide();

            setPageTitle('Domácí úkol');
            eco.ViewGarbageCollector.clear();
            console.log('route:showHwList');
            var hw = new eco.Models.Homework({id: id, student_id: 9}); //TODO: dinamicky získávat id uživatele
            var view = new eco.Views.HomeworkDetail({
                model: hw,
                el: main
            });
            main.append(view.render().$el);
            hw.fetch();
        }
        function showUserGroups() {
            setPageTitle('Skupiny');
            main_tab.show();
            schemas_tab.hide();
            eco.ViewGarbageCollector.clear();
            var groupsView = new eco.Views.GroupList({
                collection: groups,
                el: main
            });
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
        }
        function showGroupDetail(id) {
            setPageTitle('Detail skupiny');
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