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


        var options = {
            valueNames: this.searchNames
        };
        this.userList = new List('genericList', options);

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
    render: function() {
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