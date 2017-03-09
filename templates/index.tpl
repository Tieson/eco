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
    <script src="../scripts/main2.js"></script>

    {*<script src="../scripts/ux.js"></script>*}


    <script src="../scripts/models/entities.js"></script>
    <script src="../scripts/models/schema.js"></script>
    <script src="../scripts/models/settings.js"></script>


    <script>
        var app = app || { };

        $(document).ready(initEntities);

        function initEntities(){

            app.AppView = Backbone.View.extend({
                el: "body",
                initialize: function () {
                    var categories = new app.Categories();
                    categories.fetch();
                    var categoriesView = new app.CategoriesView({ el: "#ribbonContent", collection: categories, onEntityClick: this.onEntityClick });
                },
                events: {
                    'click .entity': 'onEntityClick',
                    'click #contentToggler': 'ribbonToggle'
                },
                onEntityClick:function (event) {
                    var entityId = Number($(event.target).attr("data-entityid"));
                    var categoryId = $(event.target).closest('.ribbon__contents__category').attr("data-categoryid");
                    console.log(categoryId, entityId);
                },
                ribbonToggle: function () {
                    $('#ribbon').toggleClass("ribbon--hidden");
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
                width: 1920, height: 1080, gridSize: 10,
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
            paper.on('cell:pointerdown',
                    function(cellView, evt, x, y) {
                        console.log('cell view ' + cellView.model.id + ' was clicked', cellView.model);
                        if (cellView.model instanceof joint.shapes.mylib.INPUT) {
                            cellView.model.signal *= -1;
//                            graph.trigger("change:signal");
                            broadcastSignal(cellView.model, cellView.model.signal);
                        }
                    }
            );

            function toggleLive(model, signal) {
                // add 'live' class to the element if there is a positive signal
                V(paper.findViewByModel(model).el).toggleClass('live', signal > 0);
            }

            function broadcastSignal(gate, signal) {
                // broadcast signal to all output ports
                _.defer(_.invoke, graph.getConnectedLinks(gate, { outbound: true }), 'set', 'signal', signal);
            }
            function initializeSignal() {

                var signal = Math.random();
                console.log("signal", signal);
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
                });

                return signal;
            }

            // Every logic gate needs to know how to handle a situation, when a signal comes to their ports.
            joint.shapes.mylib.Hradlo.prototype.onSignal = function(signal, handler) {
                handler.call(this, 2, signal);
            };
            // The repeater delays a signal handling by 500ms
            joint.shapes.logic.Repeater.prototype.onSignal = function(signal, handler) {
                _.delay(handler, 500, signal);
            };
            joint.shapes.mylib.CLK.prototype.clock = 0;
            // The repeater delays a signal handling by 500ms
            joint.shapes.mylib.CLK.prototype.onSignal = function(signal, handler) {
                _.delay(handler, 500, signal);
            };

            joint.shapes.mylib.INPUT.prototype.signal = 1;

            // Output element just marks itself as alive.
            joint.shapes.mylib.OUTPUT.prototype.onSignal = function(signal) {
                toggleLive(this, signal);
            };

            var gates = {
//                repeater: new joint.shapes.logic.Repeater({ position: { x: 410, y: 25 }}),
                or: new joint.shapes.mylib.TUL_OR({ position: { x: 550, y: 50 }}),
                and: new joint.shapes.mylib.TUL_AND({ position: { x: 550, y: 150 }}),
                not: new joint.shapes.mylib.TUL_INV({ position: { x: 90, y: 140 }}),
                nand: new joint.shapes.mylib.TUL_NAND({ position: { x: 550, y: 250 }}),
                nor: new joint.shapes.mylib.TUL_NOR({ position: { x: 270, y: 190 }}),
                xor: new joint.shapes.mylib.TUL_XOR({ position: { x: 550, y: 200 }}),
                xnor: new joint.shapes.mylib.TUL_XNOR({ position: { x: 550, y: 100 }}),
                input: new joint.shapes.mylib.INPUT({ position: { x: 5, y: 45 }}),
                input2: new joint.shapes.mylib.INPUT({ position: { x: 5, y: 45 }}),
                input3: new joint.shapes.mylib.INPUT({ position: { x: 5, y: 45 }}),
                output: new joint.shapes.mylib.OUTPUT({ position: { x: 740, y: 340 }}),
                output2: new joint.shapes.mylib.OUTPUT({ position: { x: 740, y: 390 }})
            };


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

            // add gates and wires to the graph

            graph.addCells(_.toArray(gates));

            _.each(wires, function(attributes) {
                graph.addCell(paper.getDefaultLink().set(attributes));
            });

            graph.on('change:source change:target', function(model, end) {

                var e = 'target' in model.changed ? 'target' : 'source';

                if ((model.previous(e).id && !model.get(e).id) || (!model.previous(e).id && model.get(e).id)) {
                    // if source/target has been connected to a port or disconnected from a port reinitialize signals
                    current = initializeSignal();
                }
            });

            graph.on('change:signal', function(wire, signal) {

                toggleLive(wire, signal);

                var magnitude = Math.abs(signal);
                console.log("m",wire, signal, magnitude);

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

                        // calculate the output signal

                        var output = magnitude * (gate.operation.apply(gate, inputs) ? 1 : -1);
                        console.log("output", output);

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