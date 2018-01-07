
eco.Models.Schema = Backbone.Model.extend({
    urlRoot: eco.basedir+'/api/schemas',
    lastVHDL: null,
    defaults: {
        id: null,
        user_id: null,
        name: '',
        architecture: 'rtl',
        description: '',
        opened: false,
        deleted: null,
        graph: null,
        paper: null,
        undomanager: null,
    },
    parse: function (data) {
        return data;
    },
    initialize: function (opts) {
        this.set('graph', new joint.dia.Graph());
    },
    validateParams: function () {
        return this.get('name').length > 0 && this.get('architecture').length > 0 && isVhdlName(this.get('name')) && isVhdlName(this.get('architecture'));
    },

    /**
     * Uložení aktuálního stavu grafu jako JSON do DB
     * Tabulka VHDL ale data jsou serializovany JSON
     */
    saveGraph: function () {
        var self = this;
        var graphstring = this.getGraphAsString();

        if (this.lastVHDL === null) {
            this.lastVHDL = new eco.Models.VHDL({
                schema_id: self.id,
                data: graphstring,
            });
        }

        this.lastVHDL.set("data", graphstring);
        this.lastVHDL.data = graphstring;
        this.lastVHDL.url = eco.basedir+'/api/schemas/' + this.id + '/vhdls';

        // console.log(this.lastVHDL.data, this.lastVHDL.url);
        this.lastVHDL.save(null, {
            success: function (model) {
                showSnackbar('Schéma ('+self.get('name')+') uloženo.');
            },
            error: function () {
                showSnackbar('Chyba, schéma '+self.get('name')+') se nepodařilo uložit.');
            }
        });
    },

    /**
     * Uloží aktuální stav jako novou verzi = nepřepisuje původní data, ale vytvoří nový záznam v DB
     */
    saveGraphNewVersion: function () {
        var graphstring = this.getGraphAsString();

        this.lastVHDL = new eco.Models.VHDL({});

        this.lastVHDL.data = graphstring;
        this.lastVHDL.schema_id = this.id;
    },

    /**
     * Vrátí data grafu v JSON formátu jako string
     */
    getGraphAsString: function () {
        return JSON.stringify(this.get('graph').toJSON());
    },

    /**
     * Načte data Grafu z DB
     */
    loadGraph: function (callback) {
        var self = this;

        if (this.lastVHDL === null) {
            this.lastVHDL = new eco.Models.VHDL({
                schema_id: self.id
            });
        }

        var vhdl = this.lastVHDL;

        if (this.id !== null || this.id !== undefined) {
            vhdl.url = eco.basedir+'/api/schemas/' + this.id + '/vhdls/last';
            vhdl.fetch({
                success: function () {
                    var data = vhdl.get('data');
                    if (data.length>0){
                        self.get('graph').fromJSON(JSON.parse(data));
                    }
                    if(callback) {callback.apply(self);}
                },
                error: function () {
                    if(callback) {callback.apply(self);}
                }
            });
        }
    },
});

eco.Views.OpenedSchemaView = Backbone.Collection.extend({
    model: eco.Models.Schema,
    actveSchema: null,
    initialize: function (options) {

        this.on("add", this.addItem, this);
    },
    render: function () {

    },
    addItem: function (item) {
    }
});

eco.Views.SchemaView = Backbone.View.extend({
    className: "canvas_item",
    tagName: 'div',
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
    }
});

eco.Views.SchemaItemView = Backbone.View.extend({
    className: "schema_list__item",
    tagName: 'a',
    initialize: function () {

        this.template = _.template($('#schemaListItem-template').html());
        // this.listenTo(this.model.collection, 'sync', this.render);
        this.listenTo(this.model, 'change', this.render);
    },
    events: {
        // 'click .schema_list__item': 'onSchemaClick'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.attr('data-id', this.model.get('id'));
        this.$el.attr('href', '#schemas/'+this.model.get('id'));
        return this;
    }
});

eco.Collections.Schemas = Backbone.Collection.extend({
    url: eco.basedir+'/api/schemas',
    model: eco.Models.Schema
});

eco.Collections.Papers = Backbone.Collection.extend({
    model: joint.dia.Paper
});

eco.Views.SchemasListView = Backbone.View.extend({
    el: "#schema_list_container",
    activeSchema: null,
    initialize: function (opts) {
        this.listenTo(this.collection, 'sync, change, add', this.render);
    },
    events: {
        'click .schema_list__item__edit': 'editSchemaHandler',
        'click .schema_list__item': 'openSchemaHandler'
    },
    fetch: function () {
        this.collection.fetch({
            success: function () {
            }
        });
    },
    renderOne: function(group) {
        var itemView = new eco.Models.SchemaItemView({model: group});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.groups-container').append(itemView.render().$el);
    },
    render: function () {
        // console.log("%cSchemasListView: render Schemas ", "color: red;", this.activeSchema);
        var self = this;
        this.$el.html("");
        this.collection.each(function (schema) {
            var schemaItemView = new eco.Views.SchemaItemView({model: schema});

            var $item = schemaItemView.render().$el;
            self.$el.append($item);

            if(self.activeSchema && self.activeSchema.get('id') == schema.get('id')){
                $item.addClass('active');
            }
        });
        return this;
    },
    editSchemaHandler: function (event) {
        var model = this.collection.get($(event.currentTarget).parent().data('id'));
        this.trigger('editSchema', model);
    },
    openSchemaHandler: function (event) {
        var model = this.collection.get($(event.currentTarget).data('id'));
        this.trigger('openSchema', model);
    },
    setActiveSchema: function (schema) {
        this.activeSchema = schema;
        this.render();
    }
});


eco.Models.VHDL = Backbone.Model.extend({
    // urlRoot: eco.basedir+'/api/vhdls',
    defaults: {
        id: null,
        data: null,
        created: null,
        schema_id: null
    }
});

eco.Views.SchemasOpenList = eco.Views.GenericList.extend({
    events: {
        'click .delete-schema': 'deleteSchema'
    },
    deleteSchema: function (e) {
        var self = this;
        swal({
                title: "Opravdu chtete schéma odstranit?",
                text: "Akci nelze vzít zpět!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ano, smazat!",
                cancelButtonText: "Ne",
                closeOnConfirm: true
            },
            function () {
                var cid = $(e.currentTarget).attr('data-cid');
                var model = self.collection.get(cid);
                model.destroy({
                    success: function () {
                        self.collection.remove(model);
                        self.render();
                        showSnackbar('Schéma bylo navždy ztaceno.');
                    },
                    error: function () {
                        self.collection.add(model);
                        self.render();
                        showSnackbar('Nejde to, schéma je asi již odevzdané.');
                    }
                });

            });
    }

});

eco.Views.SchemasNew = eco.Views.GenericForm.extend({
    className: "schema_new",
    tagName: 'div',
    submitText: 'Vytvořit',
    titleText: 'Vytvořit nové schéma',
    error: {
        invalidName: false,
        invalidArchitecture: false
    },
    afterInitialization: function (opts) {
        this.collection = opts.collection;
        if(!opts.model){
            this.editing = true;
            this.model = new eco.Models.Schema();
        }else{
            this.editing = false;
            this.model = opts.model;
        }
        this.listenTo(this.collection, 'sync', this.render);
        if (opts.submitText) {
            this.submitText = opts.submitText;
        }
        if (opts.titleText) {
            this.titleText = opts.titleText;
        }
    },
    render: function () {
        var html = this.template({error: this.error, submitText: this.submitText,  titleText: this.titleText,  schema: this.model.toJSON()});
        this.$el.html(html);

        return this;
    },

});

eco.Views.SchemasEdit = eco.Views.GenericForm.extend({
    className: "schema_new",
    tagName: 'div',
    submitText: 'Uložit',
    titleText: 'Editace schéma',
    noclear: true,
    error: {
        invalidName: false,
        invalidArchitecture: false
    },
    afterInitialization: function (opts) {
        this.collection = opts.collection;

        this.listenTo(this.collection, 'sync', this.render);
        if (opts.submitText) {
            this.submitText = opts.submitText;
        }
        if (opts.titleText) {
            this.titleText = opts.titleText;
        }
    },
    render: function () {
        var html = this.template({error: this.error, submitText: this.submitText,  titleText: this.titleText,  schema: this.model.toJSON()});
        this.$el.html(html);

        return this;
    },

});