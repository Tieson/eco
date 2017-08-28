
eco.Models.Schema = Backbone.Model.extend({
    urlRoot: '/api/schemas',
    defaults: {
        id: null,
        user_id: null,
        name: '',
        architecture: '',
        description: '',
        opened: false,
        // created: null,
        // colletion: null, //kolekce VHDL dat
        graph: null,
        paper: null,
    },
    parse: function (data) {
        return data; // in this case your model will be mixed with server response after sync was call
    },
    initialize: function (opts) {
        this.set('graph', new joint.dia.Graph());
        console.log('eco.Models.Schema:initialize');
    },
    validateParams: function () {
        console.log("validateParams");
        return this.get('name').length > 0 && this.get('architecture').length > 0 && isVhdlName(this.get('name')) && isVhdlName(this.get('architecture'));
    },

    /**
     * Uložení aktuálního stavu grafu jako JSON do DB
     * Tabulka VHDL ale data jsou serializovany JSON
     */
    saveGraph: function () {
        console.log("saveGraph");
        var self = this;
        var graphstring = this.getGraphAsString();

        if (this.lastVHDL == null) {
            this.lastVHDL = new eco.Models.VHDL({
                schema_id: self.id,
                data: graphstring,
            });
        }

        this.lastVHDL.set("data",graphstring);
        this.lastVHDL.data = graphstring;
        this.lastVHDL.url = '/api/schemas/' + this.id + '/vhdls';
        showSnackbar('Schéma uloženo.');

        // console.log(this.lastVHDL.data, this.lastVHDL.url);
        this.lastVHDL.save();
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
        console.log("loadGraph");
        // pokud data grafu nebyla načtena, tak vytvoří nový graf
        if (this.lastVHDL == null) {
            this.lastVHDL = new eco.Models.VHDL();
        }
        var vhdl = this.lastVHDL;
        var self = this;

        if (this.id) {
            // vhdl.set('url', '/api/schemas/' + this.id + '/vhdls/last');
            vhdl.url = '/api/schemas/' + this.id + '/vhdls/last';

            vhdl.fetch({
                success: function () {
                    var data = vhdl.get('data');
                    console.log('loadGraph fetch success');
                    if (data.length>0){
                        self.get('graph').fromJSON(JSON.parse(data));
                    }
                    if(callback) {callback.apply(self);}
                },
                error: function () {
                    console.log('loadGraph fetch error');
                }
            });
        } else {
            console.log("no ID");
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
        console.log(this, item);
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
        console.log(this.model.toJSON());
        return this;
    }
});

eco.Collections.Schemas = Backbone.Collection.extend({
    url: '/api/schemas',
    model: eco.Models.Schema
});

eco.Collections.Papers = Backbone.Collection.extend({
    model: joint.dia.Paper
});

eco.Views.SchemasListView = Backbone.View.extend({
    el: "#schema_list_container",
    activeSchema: null,
    initialize: function (opts) {
        console.log("SchemasListView init", this.collection);
        this.listenTo(this.collection, 'sync, change, add', this.render);
    },
    events: {
        'click .schema_list__item__edit': 'editSchemaHandler',
        'click .schema_list__item': 'openSchemaHandler'
    },
    fetch: function () {
        this.collection.fetch({
            success: function () {
                console.log("DONE!!!!!!!");
            }
        });
    },
    renderOne: function(group) {
        var itemView = new eco.Models.SchemaItemView({model: group});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.groups-container').append(itemView.render().$el);
    },
    render: function () {
        console.log("%cSchemasListView: render Schemas ", "color: red;", this.activeSchema);
        var self = this;
        this.$el.html("");
        this.collection.each(function (schema) {
            // console.log('%c schema ','background:#0a0;color:#fff',schema);
            // if (self.activeSchema && _.isEqual(schema, self.activeSchema)) {
            //     m.set('active', true);
            // }
            var schemaItemView = new eco.Views.SchemaItemView({model: schema});

            var $item = schemaItemView.render().$el;
            self.$el.append($item);


            if(self.activeSchema && self.activeSchema.get('id') == schema.get('id')){
                //schéma je aktivní
                console.log('%c Active schema','background:#f00;color:#fff', schema);
                $item.addClass('active');
            }
        });
        return this;
    },
    editSchemaHandler: function (event) {
        console.log("editSchemaHandler");
        var model = this.collection.get($(event.currentTarget).parent().data('id'));
        this.trigger('editSchema', model);
    },
    openSchemaHandler: function (event) {
        console.log("openSchemaHandler",$(event.currentTarget));
        var model = this.collection.get($(event.currentTarget).data('id'));
        this.trigger('openSchema', model);
    },
    setActiveSchema: function (schema) {
        this.activeSchema = schema;
        this.render();
    }
});


eco.Models.VHDL = Backbone.Model.extend({
    // urlRoot: '/api/vhdls',
    defaults: {
        id: null,
        data: null,
        created: null,
        schema_id: null
    }
});

eco.Collections.VHDLs = Backbone.Collection.extend({
    model: eco.Models.VHDL,
    initialize: function (opts) {
        // this.url = opts.url;
    }
});



eco.Views.SchemasOpenList = Backbone.View.extend({
    template: _.template($('#schemasOpenList-template').html()),
    initialize: function (opts) {
        this.listenTo(this.collection, 'sync', this.render);
    },
    events: {
        'click .open-schema': 'schemaOpenClick'
    },
    renderOne: function(item) {
        var itemView = new eco.Views.SchemasOpenItem({model: item});
        itemView.on('schemaOpen',this.schemaOpen);
        eco.ViewGarbageCollector.add(itemView);
        this.$('.schemas-container').append(itemView.render().$el);
    },
    render: function () {
        console.log('eco.Views.SchemasOpenList: render');
        var html = this.template();
        this.$el.html(html);
        this.collection.each(this.renderOne, this);
        return this;
    },
    schemaOpen: function (item) {
        console.log('eco.Views.SchemasOpenList: schemaOpen', item, this);
        this.trigger("schemaOpenClick", item, this);
    },
    schemaOpenClick: function (event) {
            this.trigger("schemaOpenClick", this.collection.get($(event.currentTarget).attr("data-schema-id")));
    }

});
eco.Views.SchemasOpenItem = Backbone.View.extend({
    className: '',
    tagName: 'tr',
    template: _.template($('#schemasOpenItem-template').html()),
    render: function() {
        var data = {
            cid: this.model.cid,
            id: this.model.get('id'),
            name: this.model.get('name'),
            architecture: this.model.get('architecture'),
            opened: this.model.get('opened'),
            created: moment(this.model.get('created')).format('LLL')
        };
        var html = this.template(data);
        this.$el.append(html);
        this.$el.attr('data-id', data.id);
        this.$el.attr('data-cid', data.cid);
        return this;
    }
});

eco.Views.SchemasNew = Backbone.View.extend({
    className: "schema_new",
    tagName: 'div',
    template: _.template($('#schemasNew-template').html()),
    submitText: 'Vytvořit',
    titleText: 'Vytvořit nové schéma',
    error: {
        invalidName: false,
        invalidArchitecture: false
    },
    initialize: function (opts) {
        this.listenTo(this.collection, 'sync', this.render);
        if (opts.submitText) {
            this.submitText = opts.submitText;
        }
        if (opts.titleText) {
            this.titleText = opts.titleText;
        }
    },
    events: {
        'submit form': 'schemaNewSubmit',
    },
    render: function () {
        var html = this.template({error: this.error, submitText: this.submitText,  titleText: this.titleText,  schema: this.model.toJSON()});
        this.$el.html(html);

        return this;
    },
    schemaNewSubmit: function (e) {
        e.preventDefault();
        var self = this;
        var schema = this.model;
        schema.set('name', self.$el.find('#schemasNew_name').val());
        schema.set('architecture', self.$el.find('#schemasNew_arch').val());
        if (isVhdlName(schema.get('name')) && isVhdlName(schema.get('architecture'))) {
            this.trigger("schemaNewSubmit", schema);
        }else{
            if (!isVhdlName(schema.get('name')))
                this.error.invalidName = true;
            else
                this.error.invalidName = false;
            if (!isVhdlName(schema.get('architecture')))
                this.error.invalidArchitecture = true;
            else
                this.error.invalidArchitecture = false;

            this.render();
        }
    }

});