/**
 * Created by Tom on 29.06.2017.
 */

eco.Views.GenericList = Backbone.View.extend({
    views: [],
    initialize: function (opts) {
        this.title = opts.title || "";
        this.noRecordsMessage = opts.noRecordsMessage || 'Zatím zde nejsou žádné záznamy.';
        this.template = _.template($(opts.template).html());
        this.itemTemplate = opts.itemTemplate;
        this.itemView = opts.itemView || eco.Views.GenericItem;
        this.formater = opts.formater || eco.Formaters.GenericFormater;
        this.collection = opts.collection;
        this.searchNames = opts.searchNames || ['list-one'];
        this.renderLoading();
        this.listenTo(this.collection, 'sync', this.render);
        this.afterInitialization();
        this.vent = opts.vent;
        this.uniqueId = opts.uniqueId || '';
    },
    renderLoading: function () {
        this.$el.html('<div class="loader">Načítám</div>');
    },
    afterInitialization: function () {

    },
    events: {},
    renderOne: function (item) {
        var itemView = new this.itemView({
            model: item,
            template: this.itemTemplate,
            formater: this.formater,
            uniqueId: this.uniqueId,
        });
        eco.ViewGarbageCollector.add(itemView);
        this.$('.items-container').append(itemView.render().$el);
    },
    render: function () {
        var html = this.template({title: this.title, recordsLength: this.collection.length, noRecordsMessage: this.noRecordsMessage});
        var self = this;
        this.$el.html(html);
        this.$el.attr('id', "genericList"+this.uniqueId);
        if(this.collection.length > 0){
            this.collection.each(this.renderOne, this);
        }else {
            this.$el.html('<h1>'+this.noRecordsMessage+'</h1>');
        }
        try {
            var options = {
                valueNames: this.searchNames
            };
            this.$('.items-container').addClass('list');
            this.userList = new List('genericList'+this.uniqueId, options);
        } catch (err) {
            ;
        }

        return this;
    }
});

eco.Views.GenericItem = Backbone.View.extend({
    tagName: 'tr',
    className: 'genericListItem',
    initialize: function (opts) {
        this.template = _.template($(opts.template).html(), {variable: 'data'});
        this.model = opts.model;
        this.formater = opts.formater || eco.Formaters.GenericFormater;
        this.uniqueId = opts.uniqueId || '';
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        var data = this.formater(this.model);
        var html = this.template(data);
        this.$el.html(html);
        this.$el.addClass(this.uniqueId+"Item");
        this.$el.attr('data-id', data.id);
        this.$el.attr('data-cid', data.cid);

        return this;
    }
});


eco.Views.GenericDetail = Backbone.View.extend({

    // tagName: 'div',
    initialize: function (opts) {
        this.title = opts.title || "";
        this.template = _.template($(opts.template).html());
        this.formater = opts.formater || eco.Formaters.GenericFormater;
        this.model = opts.model;
        this.afterRender = opts.afterRender;
        this.renderLoading();
        this.listenTo(this.model, 'sync change', this.render);
        this.afterInitialization();
    },
    renderLoading: function () {
        this.$el.html('<div class="loader">Načítám</div>');
    },
    afterInitialization: function () {
    },
    render: function () {
        console.log(this.model);
        var self = this;
        var data = this.formater(this.model);
        var html = this.template(_.extend({}, {title: this.title}, data));
        this.$el.html(html);
        this.$el.attr('data-id', data.id);
        this.$el.attr('data-cid', data.cid);
        if (this.afterRender){
            this.afterRender();
        }
        return this;
    }
});

eco.Views.GenericForm = Backbone.View.extend({
    tagName: 'div',
    initialize: function (opts) {
        this.title = opts.title || "";
        this.template = _.template($(opts.template).html());
        this.formater = opts.formater || eco.Formaters.GenericFormater;
        this.validator = opts.validator || eco.Validators.NoValidator;
        this.mapper = opts.mapper;
        if (!this.mapper) {
            throw new Error("Mapper must be set!");
        }
        this.model = opts.model;
        this.renderLoading();
        this.afterInitialization();
        this.vent = opts.vent;
        this.sanckbarMessage = opts.sanckbarMessage || 'Podařilo se uložit!';
        this.sanckbarMessageError = opts.sanckbarMessageError || "Něco se pokazilo.";
        this.listenTo(this.model, 'sync change add', this.render);
    },
    renderLoading: function () {
        // this.$el.html('<div class="loader">Načítám</div>');
    },
    afterInitialization: function () {

    },
    onSuccess:function (schema, model) {

    },
    onError:function () {

    },
    events: {
        'submit form': 'formSubmit',
    },
    render: function () {
        var data = this.formater(this.model);
        console.log("DATA", data, this.model);
        var html = this.template({error: this.error, title: this.title, model: data});
        this.$el.html(html);

        return this;
    },
    formSubmit: function (e) {
        e.preventDefault();
        console.log("formSubmit");
        var self = this;
        var schema = this.model;

        var data = this.model.clone();
        data.set(this.mapper(self.$el));

        if (this.validator(data)) {
            data.save(data.toJSON(), {
                success: function (model, response) {
                    console.log("Generic formSubmit success");
                    showSnackbar(self.sanckbarMessage);
                    if (self.collection) {
                        schema.set(data);
                        self.collection.add(schema);
                        schema.fetch();
                        self.model = schema.clone().clear();
                        // self.render();
                    }
                    self.onSuccess(schema, model);
                },
                error: function (model, response) {
                    showSnackbar(self.sanckbarMessageError);
                    if (self.collection) {
                        self.collection.remove(schema);
                    }
                    self.render();
                    // self.onError();
                },
                wait: true
            });

            // this.trigger("formSubmited", schema);
        }
        if (this.vent) {
            // this.vent.trigger('formSubmited', this);
        }
        return false;
    }
});