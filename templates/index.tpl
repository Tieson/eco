<!DOCTYPE html>
<html lang='cs'>
<head>
    <title>Grafický editor číslicových obvodů v HTML5</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset='utf-8'>
    <meta name='description' content=''>
    <meta name='keywords' content=''>
    {*<meta name='author' content=''>*}
    <meta name='robots' content='all'>

    <link rel="stylesheet" href="../js/libs/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../js/libs/jointjs/dist/joint.min.css">
    <link rel="stylesheet" href="../src/css/style.css">


    {*<link href="../css/style.css" rel="stylesheet">*}
    <link href="../css/jquery.fancybox.css" rel="stylesheet">

    {*<script data-main="../js/main" src="../js/require.js" async></script>*}


    {*<link href="../scripts/joint.css" rel="stylesheet">*}
    <!-- <link href='/favicon.png' rel='shortcut icon' type='image/png'> -->


    <script src="../js/libs/jquery/dist/jquery.min.js"></script>
    <script src="../scripts/jquery.hotkeys.js"></script>
    <script src="../scripts/jquery.fancybox.pack.js"></script>


    <script src="../js/libs/lodash/lodash.min.js"></script>
    <script src="../js/libs/backbone/backbone-min.js"></script>

    <script src="../js/libs/jointjs/dist/joint.js"></script>
    <script src="../js/libs/jointjs/dist/joint.shapes.logic.min.js"></script>
    <script src="../scripts/joint.shapes.mylib.js"></script>


    <script src="../js/libs/bootstrap/dist/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <script src="../scripts/utils/fileLoader.js"></script>
    <script src="../scripts/utils/Counter.js"></script>
    <script src="../scripts/utils/Serialization.js"></script>
    <script src="../scripts/utils/Notification.js"></script>


    <script src="../scripts/Communicator.js"></script>
    <script src="../scripts/Creator.js"></script>
    <script src="../scripts/VhdExport.js"></script>
    <script src="../scripts/VhdImport.js"></script>
    <script src="../scripts/schema.js"></script>
    {*<script src="../scripts/main.js"></script>*}
    {*<script src="../scripts/main2.js"></script>*}

    <script src="../scripts/ux.js"></script>


    <script src="../scripts/models/entities.js"></script>
    <script src="../scripts/models/schema.js"></script>
    <script src="../scripts/models/modal.js"></script>
    <script src="../scripts/models/settings.js"></script>


    <script>
        var app = app || { };

        $(document).ready(initEntities);


        function initTest(){

            var schema2 = new app.Schema({ user_id: 1, name: "qščřrsaf", architecture: "ščřwersfd" });
            console.log("schema.isNew()", schema2.isNew());
            console.log(schema2);
            console.log(schema2.toJSON());
            schema2.save(schema2.toJSON(), {
                success: function (response) {
                    console.log("ok", response);
                },
                error: function () {
                    console.log("ko");
                }
            });
            console.log("done");
        }

        function initEntities(){

//            var eventAgg = _.extend({ }, Backbone.Events);

            app.AppView = Backbone.View.extend({
                el: "body",
                initialize: function (options) {
                    console.log(app);
                    this.schemas = new app.Schemas();
                    var categories = new app.Categories();
                    this.modalView = new app.BaseModalView({ template: '#template-modal' });
                    this.listenTo(this.modalView, 'save', this.saveNewSchema);
                    categories.fetch();

                    this.schemasView = new app.SchemasView({ collection : this.schemas });
                    this.listenTo(this.schemasView, 'editSchema', this.editSchema);

                    var categoriesView = new app.CategoriesView({ el: "#ribbonContent", collection: categories, onEntityClick: this.onEntityClick });
                    this.ribbonToggle();
                },
                events: {
                    'click .entity': 'onEntityClick',
                    'click #contentToggler': 'ribbonToggle',
                    'click #addSchema': 'addNewSchema'
                },
                onEntityClick:function (event) {
                    var entityId = Number($(event.target).attr("data-entityid"));
                    var categoryId = $(event.target).closest('.ribbon__contents__category').attr("data-categoryid");
                    console.log(categoryId, entityId);
                },
                ribbonToggle: function () {
                    var ribbon = $('#ribbon'),
                            show = ribbon.find('.ribbon__toggle__show'),
                            hide = ribbon.find('.ribbon__toggle__hide');
                    ribbon.toggleClass("ribbon--hidden");
                    if (ribbon.hasClass('ribbon--hidden')){
                        show.show();
                        hide.hide();
                    }else{
                        show.hide();
                        hide.show();
                    }
                },
                addNewSchema: function () {
                    this.modalView.show({ model: new app.Schema(), title: "Create new schema" });
                },
                saveNewSchema: function (schema) {
                    console.log("saveNewSchema", schema);
                    this.schemas.create(schema, {
                        success: function (result, a) {
                            console.log("ok", result, a);
                        },
                        error: function () {
                            console.log("ko");
                        }
                    });
                },
                editSchema: function(schema){
                    this.modalView.show({ model: schema, title: "Edit schema" });
                }
            });


            var appView = new app.AppView();



            app.EntityDetailView = Backbone.View.extend({
                el: $("#entityDetail"),
                initialize: function () {
                    //this.listenTo(this.model, 'change', this.render);
                    this.render();
                },
                events: {

                },
                render: function () {
                    var self = this;
                    this.$el.html('<h2>'+this.model.attr('.label/text')+'</h2>');

                    return this;
                }
            });


            var entityDetailView;
            var graph = new joint.dia.Graph();

            var paper = new joint.dia.Paper({

                el: $('#canvasWrapper'),
                model: graph,
                width: 1920, height: 1080, gridSize: 7,
                snapLinks: true,
                linkPinning: false,
                defaultLink: new joint.shapes.mylib.Vodic,
                drawGrid: {
                    color: '#333',
                    thickness: 1
                },

                validateConnection: function(vs, ms, vt, mt, e, vl) {

                    if (e === 'target') {
                        // target requires an input port to connect
                        if (!mt || !mt.getAttribute('class') || mt.getAttribute('class').indexOf('input') < 0) return false;

                        // check whether the port is being already used
                        var portUsed = _.find(this.model.getLinks(), function(link) {

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
            paper.on('cell:pointerclick', createCellDoubleclickHandler(function(cellView, evt, x, y){
                if (cellView.model instanceof joint.shapes.mylib.HradloIO) {
                    cellView.model.switchSignal();
                    broadcastSignal(cellView.model, cellView.model.signal);
                    V(cellView.el).toggleClass('live', cellView.model.signal > 0);
                }
            }));
            paper.on('cell:pointerclick', function(cellView) {

                /**
                 * Po kliknutí na hodiny je vypnout/zaponout
                 */
                if (cellView.model instanceof joint.shapes.mylib.CLK) {
                    console.log(cellView.model.tickOn);
                    cellView.model.tickOn = !cellView.model.tickOn;
                    V(cellView.el).toggleClass('running', cellView.model.tickOn);
                }

//                console.log(cellView.model.get('id'));
//                console.log(cellView.model.get('position'));
//                console.log(cellView.model.position());
//                console.log(cellView.model.get('attrs'));
//                console.log(cellView.model.attr('.label/text'));
            });

            function createCellDoubleclickHandler(callback) {
                var doubleclick;
                return function (cellView, evt, x, y) {
                    var now = new Date();
                    if (doubleclick && doubleclick.getTime() > (now.getTime() - 500)) {
                        callback(cellView, evt, x, y);
                    } else {
                        doubleclick = new Date();
                    }
                }
            }

            function toggleLive(model, signal) {
                // add 'live' class to the element if there is a positive signal
                V(paper.findViewByModel(model).el).toggleClass('live', signal > 0);
            }

            function broadcastSignal(gate, signal) {
                // broadcast signal to all output ports
                _.defer(_.invoke, graph.getConnectedLinks(gate, { outbound: true }), 'set', 'signal', signal);
                toggleLive(gate, signal);
            }

            function startClock(gate, signal) {
//                _.delay(startClock, gate.clockSpd, gate, gate.signal);
                window.setInterval(function(){
                    if (gate.tryTick()){
                        broadcastSignal(gate, gate.signal);
                    }
                }, 100);
            }

            function initializeSignal() {

                var signal = Math.random();
                // > 0 wire with a positive signal is alive
                // < 0 wire with a negative signal means, there is no signal

                // 0 none of the above - reset value

                // cancel all signals stores in wires
                _.invoke(graph.getLinks(), 'set', 'signal', 0);

                // remove all 'live' classes
                $('.live').each(function() {
                    V(this).removeClass('live');
                });

                _.each(graph.getElements(), function(element) {
                    // broadcast a new signal from every input in the graph
                    (element instanceof joint.shapes.mylib.INPUT) && broadcastSignal(element, element.signal);
                    (element instanceof joint.shapes.mylib.VCC) && broadcastSignal(element, element.signal);
                    (element instanceof joint.shapes.mylib.GND) && broadcastSignal(element, element.signal);
                    (element instanceof joint.shapes.mylib.CLK) && startClock(element, element.signal);
                });

                return signal;
            }

            // Every logic gate needs to know how to handle a situation, when a signal comes to their ports.
            joint.shapes.mylib.Hradlo.prototype.onSignal = function(signal, handler) {
                handler.call(this, 10, signal);
            };

            // Output element just marks itself as alive.
            joint.shapes.mylib.OUTPUT.prototype.onSignal = function(signal) {
                toggleLive(this, signal);
            };

            var gates = {
//                repeater: new joint.shapes.logic.Repeater({ position: { x: 410, y: 25 }}),
//                or: new joint.shapes.mylib.TUL_OR({ position: { x: 550, y: 50 }}),
//                and: new joint.shapes.mylib.TUL_AND({ position: { x: 550, y: 150 }}),
                not: new joint.shapes.mylib.TUL_INV({ position: { x: 90, y: 140 }}),
                nand: new joint.shapes.mylib.TUL_NAND({ position: { x: 550, y: 250 }}),
                nand2: new joint.shapes.mylib.TUL_NAND({ position: { x: 550, y: 250 }}),
                nand3: new joint.shapes.mylib.TUL_NAND({ position: { x: 550, y: 250 }}),
                nand4: new joint.shapes.mylib.TUL_NAND({ position: { x: 550, y: 250 }}),
//                nor: new joint.shapes.mylib.TUL_NOR({ position: { x: 270, y: 190 }}),
//                xor: new joint.shapes.mylib.TUL_XOR({ position: { x: 550, y: 200 }}),
//                clk: new joint.shapes.mylib.CLK({ position: { x: 550, y: 100 }}),
                input: new joint.shapes.mylib.INPUT({ position: { x: 5, y: 45 }}),
                input2: new joint.shapes.mylib.INPUT({ position: { x: 5, y: 45 }}),
                input3: new joint.shapes.mylib.INPUT({ position: { x: 5, y: 45 }}),
//                vcc: new joint.shapes.mylib.VCC({ position: { x: 5, y: 100 }}),
//                gnd: new joint.shapes.mylib.GND({ position: { x: 5, y: 165 }}),
                output: new joint.shapes.mylib.OUTPUT({ position: { x: 740, y: 340 }}),
                output2: new joint.shapes.mylib.OUTPUT({ position: { x: 740, y: 390 }})
            };
            gates.input2.attr(".label/text", "X1");
            gates.input3.attr(".label/text", "X2");


            var wires = [
//                { source: { id: gates.input.id, port: 'q' }, target: { id: gates.not.id, port: 'a' }},
//                { source: { id: gates.not.id, port: 'q' }, target: { id: gates.nor.id, port: 'a' }},
//                { source: { id: gates.not.id, port: 'q' }, target: { id: gates.nor.id, port: 'b' }},
//                { source: { id: gates.nor.id, port: 'out' }, target: { id: gates.repeater.id, port: 'a' }},
//                { source: { id: gates.nor.id, port: 'q' }, target: { id: gates.output.id, port: 'a' }},
//                { source: { id: gates.repeater.id, port: 'q' }, target: { id: gates.nor.id, port: 'in2'},
//                    vertices: [{ x: 215, y: 100 }]
//                }
            ];

            /**
             * Přidá entity do grafu
             */
            graph.addCells(_.toArray(gates));

            /**
             * Přidá vodiče do grafu
             */
            _.each(wires, function(attributes) {
                graph.addCell(paper.getDefaultLink().set(attributes));
            });

            /**
             * Reinitialyze signals when wire was connected or disconnected.
             */
            graph.on('change:source change:target', function(model, end) {
                var e = 'target' in model.changed ? 'target' : 'source';
                if ((model.previous(e).id && !model.get(e).id) || (!model.previous(e).id && model.get(e).id)) {
                    current = initializeSignal();
                }
            });

            graph.on('change:signal', function(wire, signal) {

                toggleLive(wire, signal);

                var magnitude = Math.abs(signal);

                // if a new signal has been generated stop transmitting the old one
//                if (magnitude !== current) return;

                var gate = graph.getCell(wire.get('target').id);

                if (gate) {

                    gate.onSignal(signal, function() {

                        // get an array of signals on all input ports
                        var inputs = _.chain(graph.getConnectedLinks(gate, { inbound: true }))
                                .groupBy(function(wire) {
                                    return wire.get('target').port;
                                })
                                .map(function(wires) {
                                    return Math.max.apply(this, _.invoke(wires, 'get', 'signal')) > 0;
                                })
                                .value();

                        var output = magnitude * (gate.operation.apply(gate, inputs) ? 1 : -1);
                        broadcastSignal(gate, output);
                    });
                }
            });

            // initialize signal and keep its value
            var current = initializeSignal();

        }

    </script>


</head>
<body style="position: relative;">

{literal}
    <script type="text/template" id="template-user">
        mail: <%= mail %> ;
        name: <%= name %>
    </script>

    <script type="text/template" class="template-categories-list">
        <div class="ribbon__contents__header">
            <%= name %>
        </div>
    </script>

    <script type="text/template" id="template-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title"><%= title%></h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="schema_name">Název:</label>
                        <input type="text" name="name" id="schema_name" class="form-control" value="<%= schema.name %>">
                    </div>
                    <div class="form-group">
                        <label for="schema_name">Architektura:</label>
                        <input type="text" name="architecture" id="schema_architecture" class="form-control" value="<%= schema.architecture %>">
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn btn-storno button">Storno</a>
                    <a href="#" class="btn btn-save button button--primary">Save</a>
                </div>
            </div>
        </div>
    </script>

    <script type="text/template" class="template-schema-list">
        <div class="schema_list__item" <% if (typeof(id) !== "undefined") { %>data-id="<%= id %>"<% } %>>
            <%= name %>
        </div>
    </script>
{/literal}

    <div id="notificationMessages" class="notif">
        {section loop=$messgs name=msg}
            <div class="item">{$messgs[msg]}</div>
        {/section}
    </div>

    <div class="page_wrap">

        <div class="main_bar">
            <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect"><i class="glyphicon glyphicon-menu-hamburger"></i> menu</a>

            {include file='UIElements/schemaList.tpl'}

            <div id="schemaList">
                <div class="wrapper">

                </div>
            </div>

            <div id='usermenu' class="main_bar__usermenu">
                <div class="wrapper">
                    {include file='UIElements/userSlideBox.tpl'}
                </div>
            </div>
        </div>

        <div class="center_wrap">
            {include file='commonComponents/ribbon.tpl'}

            <div class="paper_container" id="canvasWrapper">
                {*<div id="moje_platno" class="paper"></div>*}
            </div>

            <div id="entityDetail"></div>
        </div>

        {*<footer class="page_footer">
            <span>&COPY; 2013 Jaroslav Řehák (TUL)</span>
            <span> - 2015 Tomáš Václavík (TUL)</span>
        </footer>*}

    </div>

    {include file='UIElements/createSchemaForm.tpl'}
    {include file='UIElements/editSchemaForm.tpl'}

    {include file='UIElements/openSchemaList.tpl'}

    <div class="owerlay" id="owerlay"></div>
</body>
</html>