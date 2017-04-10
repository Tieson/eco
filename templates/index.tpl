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

    {*<script src="../js/libs/list.js/dist/list.min.js"></script>*}

    <script src="../js/libs/bootstrap/dist/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <script src="../scripts/utils/Util.js"></script>
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


        // Every logic gate needs to know how to handle a situation, when a signal comes to their ports.
        joint.shapes.mylib.Hradlo.prototype.onSignal = function(signal, handler) {
//            console.log("joint.shapes.mylib.Hradlo.prototype.onSignal", this);
            handler.call(this, 0, signal);
        };

        $(document).ready(initEntities);

        function initEntities(){
//            var eventAgg = _.extend({ }, Backbone.Events);
            app.AppView = Backbone.View.extend({
                el: "body",
                activeSchema: null,
                initialize: function (options) {
                    console.log(app);
                    this.schemas = new app.Schemas();
                    var categories = new app.Categories();
                    this.modalView = new app.SchemaModalView({ template: '#template-modal', inputValidator: inputNameValidator });
                    this.listenTo(this.modalView, 'save', this.saveNewSchema);
                    categories.fetch();

                    this.schemasView = new app.SchemasView({ collection : this.schemas });
                    this.listenTo(this.schemasView, 'editSchema', this.editSchema);
                    this.listenTo(this.schemasView, 'openSchema', this.openSchema);

                    this.categoriesView = new app.CategoriesView({ el: "#ribbonContent", collection: categories, onEntityClick: this.onEntityClick });
//                    this.ribbonToggle();
                },
                events: {
                    'click .entity': 'onEntityClick',
                    'click #contentToggler': 'ribbonToggle',
                    'click #addSchema': 'addNewSchema',
                    'click #saveSchema': 'saveVHDL',
//                    'click .schema_list__item': '___?___',
                },
                onEntityClick:function (event) {
                    var entityId = Number($(event.target).attr("data-entityid"));
                    var categoryId = $(event.target).closest('.ribbon__contents__category').attr("data-categoryid");
                    console.log(categoryId, entityId);
                },
                ribbonToggle: function () {
                    console.log("toggle");
                    var ribbon = $('#ribbon'),
                            show = ribbon.find('.ribbon__toggle__show'),
                            hide = ribbon.find('.ribbon__toggle__hide');
                    if (!ribbon.hasClass('ribbon--hidden')){
                        ribbon.removeClass("ribbon--hidden");
                        show.hide();
                        hide.show();
                    }else{
                        ribbon.addClass("ribbon--hidden");
                        show.show();
                        hide.hide();
                    }
                    console.log(ribbon);
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
                },
                saveVHDL: function () {
                    if (this.activeSchema){
                        this.activeSchema.saveGraph();
                    }else{
                        console.log("není žádné aktivní schéma, vyberte schéma z nabídky.");
                    }
                },
                setActiveSchema: function (schema) {
                    var old = this.activeSchema;
                    this.activeSchema = schema;
                    if (this.activeSchema) {
                        this.categoriesView.setActive(true);
                    }else{
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
                    if (lastOpenedSchema){
                        lastOpenedSchema.closeSchema();
                    }
                    this.setActiveSchema(newSchema);
                    console.log("activeSchema", this.activeSchema);

                    this.activeSchema.openSchema();
                },
                testAddElement: function () {

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

//                    this.activeSchema.get("graph").addCell(_.toArray(gates));
                    this.activeSchema.get("graph").addCell(new joint.shapes.mylib.TUL_NAND({ position: { x: 550, y: 250 }}));
                }
            });
            var appView = new app.AppView();


//            var sch = CreateSchema();

//            sch.get("paper").remove();

//            console.log('sch.get("paper")', sch.get("paper"));


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

        }

    </script>


</head>
<body style="position: relative;">

{literal}
    <script type="text/template" id="template-user">
        e-mail: <%= mail %>
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
                        <label for="schema_name">Název: <i class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Zadávejte pouze písmena anglické abecedy, podtržítka a číslice."></i></label>
                        <input type="text"
                               name="name"
                               id="schema_name"
                               class="form-control"
                               value="<%= schema.name %>"
                               autofocus="autofocus",
                               placeholder="schema_01"
                        >
                    </div>
                    <div class="form-group">
                        <label for="schema_name">Architektura: <i class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Zadávejte pouze písmena anglické abecedy, podtržítka a číslice."></i></label>
                        <input type="text"
                               name="architecture"
                               id="schema_architecture"
                               class="form-control"
                               value="<%= schema.architecture %>"
                               placeholder="arch_01"
                        >
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <small>
                                Název a architektura musí být validní VHDL název.
                                Ten může obsahovat pouze písmena anglické abecedy, kterými musí začínat, dále číslice a podtržítka.
                                Podtržítka nesmí být zasebou.
                            </small>
                        </div>
                    </div>
                    <!--<hr>
                    <div class="row">
                        <div class="col-xs-12">
                            <a href="#" class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i> smazat schéma</a>
                        </div>
                    </div>-->
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn btn-storno button">Storno</a>
                    <button type="submit" class="btn btn-save button button--primary">Save</button>
                </div>
            </div>
        </div>
    </script>

    <script type="text/template" class="template-schema-list">
            <%= schema.name %>
        <div class="schema_list__item__edit btn btn-xs"><i class="glyphicon glyphicon-cog"></i></div>
    </script>
{/literal}

    <div id="notificationMessages" class="notif">
        {section loop=$messgs name=msg}
            <div class="item">{$messgs[msg]}</div>
        {/section}
    </div>

    <div class="page_wrap">

        <div class="main_bar">
            <div class="dropdown">
                <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
                    <i class=" glyphicon glyphicon-file"></i> File
                </a>
                <ul class="dropdown-menu">
                    <li><a href="#">New Schema</a></li>
                    <li><a href="#">Open Schema</a></li>
                    <li><a href="#">Save Schema As &hellip;</a></li>
                    <li><a href="#">Export Schema to VHDL</a></li>
                    <li class="divider"></li>
                    <li><a href="#">Download lib.vdl</a></li>
                </ul>
            </div>
            <div class="dropdown">
                <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
                    <i class=" glyphicon glyphicon-flash"></i> Task
                </a>
                <ul class="dropdown-menu">
                    <li><a href="#">Show tasks</a></li>
                    <li class="disabled"><a href="#">Submit this solution</a></li>
                </ul>
            </div>

            {include file='UIElements/schemaList.tpl'}

            <div id="schemaList">
                <div class="wrapper">

                </div>
            </div>

            <div id='usermenu' class="main_bar__usermenu">
                {include file='UIElements/userSlideBox.tpl'}
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