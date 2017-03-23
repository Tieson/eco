var app = app || {};

app.Schema = Backbone.Model.extend({
    urlRoot: '/api/schemas',
    defaults: {
        // id: null,
        user_id: null,
        name: '',
        architecture: '',
        description: '',
        // created: null,
        // colletion: null, //kolekce VHDL dat
        // graph: null,
        // paper: null,
        // tab: null,
        // local_only: true
    },
    parse: function(data){
        return data; // in this case your model will be mixed with server response after sync was call
    },
    initialize: function (opts) {
        // console.log("schema url", this.url());
        // this.colletion = new app.VHDLs();
        // this.colletion.url = this.entitiesUrl();
        // // this.colletion.fetch();
        // console.log(this.colletion);
        // console.log(this);
    },
    // entitiesUrl: function () {
    //     return '/api/schemas/' + this.id + '/vhdls';
    // },
    refetchCollection: function () {
        this.colletion.fetch();
    },
    validateParams: function () {
        console.log("fun: validateParams");
        return this.get('name').length> 0 && this.get('architecture').length> 0;
    }
});

app.SchemaView = Backbone.View.extend({
    initialize: function () {
        this.template = _.template($('.template-schema-list').html());
        this.listenTo(this.model.collection, 'sync', this.render);
    },
    events: {
        // 'click .schema_list__item': 'onSchemaClick'
    },
    render: function () {
        // console.log("rendering Schema", this.model, this.model.collection);
        var self = this;
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

app.Schemas = Backbone.Collection.extend({
    url: '/api/schemas',
    model: app.Schema
});

app.SchemasView = Backbone.View.extend({
    el: "#schema_list_container",
    initialize: function (opts) {
        console.log("schemas init");
        var self = this;
        this.collection.fetch();
        this.listenTo(this.collection, 'sync add change', this.render);
        // this.collection = opts.collection;

    },
    events: {
        'click .schema_list__item': 'onSchemaClick'
    },
    render: function () {
        console.log("%crender Schemas " + this.category, "color: #139");
        var self = this;
        this.$el.html("");
        this.collection.each(function (schema) {
            var schemaView = new app.SchemaView({model: schema});
            self.$el.append(schemaView.render().$el);
        });
        return this;
    },
    onSchemaClick: function (event) {
        var model = this.collection.get($(event.target).data('id'));
        console.log(".schema_list__item click!", model);
        this.trigger('editSchema', model);

        var sch = new app.Schema({name: "áron", architecture: "random"});
        sch.save(null, {
            success: function () {
                console.log("save success");
            }, always: function () {
                console.log("always");
            }, error: function () {
                console.log("error");
            }
        });
        this.collection.add(sch);
    }
});


app.VHDL = Backbone.Model.extend({
    defaults: {
        id: null,
        data: null,
        created: null,
        schema_id: null
    }
});

app.VHDLs = Backbone.Collection.extend({
    model: app.VHDL,
    initialize: function (opts) {
        this.url = opts.url;
    }
});