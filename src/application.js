/**
 * Created by Tomáš Václavík on 13.04.2017.
 */


var eco = eco || {};


// Every logic gate needs to know how to handle a situation, when a signal comes to their ports.
joint.shapes.mylib.Hradlo.prototype.onSignal = function (signal, handler) {
//            console.log("joint.shapes.mylib.Hradlo.prototype.onSignal", this);
    handler.call(this, 0, signal);
};


function app() {
    var schemas = new eco.Schemas();
}


eco.AppView = Backbone.View.extend({
    el: "body",
    activeSchema: null, // aktivní schéma může být pouze jedno
    initialize: function (options) {

        this.schemas = new eco.Schemas(); // všechna schémata načtená ze serveru
        this.openedSchemas = new eco.Schemas(); // pouze otevřená schémata, která mají tab, graf, paper atd.

        this.modalView = new eco.SchemaModalView({
            template: '#template-modal',
            inputValidator: inputNameValidator
        });

        this.openSchemaModalView = new eco.SchemaOpenListModalView({
            collection: this.schemas,
            title: "Otevřít schéma",
            template: "#editSchemaModal-template"
        });

        this.hw = new eco.Homeworks({student_id: 8});
        this.hwListModalView = new eco.SchemaOpenListModalView({
            collection: this.hw,
            title: "Úkoly",
            template: "#homeworkList-template"
        });

        this.listenTo(this.openSchemaModalView, 'itemClick', this.modalOpenSchemaClick);
        this.listenTo(this.modalView, 'save', this.saveNewSchema);


        this.schemasView = new eco.SchemasView({collection: this.openedSchemas, active: this.activeSchema});
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

