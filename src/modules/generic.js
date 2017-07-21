/**
 * Created by Tom on 29.06.2017.
 */

eco.Views.GenericList = Backbone.View.extend({
    initialize: function (opts) {
        this.title = opts.title || "";
        this.template = _.template($(opts.template).html());
        this.itemTemplate = opts.itemTemplate;
        this.itemView = opts.itemView || eco.Views.GenericItem;
        this.formater = opts.formater || eco.Formaters.GenericFormater;
        this.collection = opts.collection;
        this.searchNames = opts.searchNames || ['list-one'];
        this.listenTo(this.collection, 'sync', this.render);
    },
    events: {},
    renderOne: function (item) {
        var itemView = new this.itemView({model: item, template: this.itemTemplate, formater: this.formater});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.items-container').append(itemView.render().$el);
    },
    render: function () {
        var html = this.template({title: this.title});
        var self = this;
        this.$el.html(html);
        this.$el.attr('id', "genericList");
        this.collection.each(this.renderOne, this);

        try {
            var options = {
                valueNames: this.searchNames
            };
            this.userList = new List('genericList', options);
        }catch (err){
            ;
        }

        return this;
    }
});

eco.Views.GenericItem = Backbone.View.extend({
    tagName: 'tr',
    initialize: function (opts) {
        this.template = _.template($(opts.template).html());
        this.model = opts.model;
        this.formater = opts.formater;
    },
    render: function () {
        var data = this.formater(this.model);
        var html = this.template(data);
        this.$el.html(html);
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
        this.listenTo(this.model, 'sync change', this.render);
    },
    render: function () {
        console.log(this.model);
        var self = this;
        var data = this.formater(this.model);
        var html = this.template(data);
        this.$el.html(html);
        this.$el.attr('data-id', data.id);
        this.$el.attr('data-cid', data.cid);
        return this;
    },
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
        this.listenTo(this.model, 'sync change', this.render);
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
                data.save(data.toJSON(),{
                    success: function(model, response) {
                    },
                    error: function(model, response) {
                        self.render();
                    },
                    wait: true
                });

                // this.trigger("formSubmited", schema);
            }
            return false;
    }
});