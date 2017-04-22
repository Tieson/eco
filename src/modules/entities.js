
eco.Models.Entity = Backbone.Model.extend({});

eco.Views.EntityView = Backbone.View.extend({
    tagName: "div",
    className: "entity noselect",
    render: function () {
        this.$el.html(this.model.get('name'));
        $(this.$el).attr('data-entityid', this.model.get('id'));
        return this;
    }
});

eco.Collections.Entities = Backbone.Collection.extend({
    model: eco.Models.Entity
});

eco.Views.EntititesView = Backbone.View.extend({
    tagName: "div",
    className: "ribbon__contents__items",
    initialize: function (opts) {
        this.category = opts.category;
    },
    render: function () {
        console.log("%crender entities " + this.category, "color: #47f");
        var self = this;
        this.$el.html();
        this.collection.each(function (entity) {
            var entityView = new eco.Views.EntityView({model: entity});
            self.$el.append(entityView.render().$el);
        });
        return this;
    }
});

eco.Models.Category = Backbone.Model.extend({
    defatults: {
        id: null,
        name: null,
        entities: new eco.Collections.Entities()
    },
    initialize: function (opts) {
        this.entities = new eco.Collections.Entities();
        this.entities.url = this.entitiesUrl();
        this.entities.fetch();
    },
    entitiesUrl: function () {
        return '/api/categories/' + this.id + '/entities';
    }
});

eco.Views.CategoryView = Backbone.View.extend({
    className: 'ribbon__contents__category',
    initialize: function () {
        this.template = _.template($('.template-categories-list').html());
        this.listenTo(this.model.entities, 'sync', this.render);
    },
    events: {
        'click .ribbon__contents__header': 'onCategoryClick'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        $(this.$el).attr('data-categoryid', this.model.get('id'));
        var itemsContainer = this.$el.find('.ribbon__contents__items');

        var itemView = new eco.Views.EntititesView({collection: this.model.entities, category: this.model.get('name')});
        this.$el.append(itemView.render().$el);
        this.$el.find(".ribbon__contents__items").hide();

        return this;
    },
    onCategoryClick: function () {
        this.$el.find(".ribbon__contents__items").slideToggle();
    }
});


eco.Collections.Categories = Backbone.Collection.extend({
    model: eco.Models.Category,
    url: '/api/categories'
});

eco.Views.CategoriesView = Backbone.View.extend({
    initialize: function (opts) {
        var self = this;
        this.listenTo(this.collection, 'sync', this.render);
        this.onEntityClick = opts.onEntityClick;
        this.active = opts.active;
    },
    events: {
        'click .ribbon__contents__header': 'onClick',
        'click .entity': 'onEntityClick'
    },
    setActive: function (active) {
        this.active = active;
        this.render();
    },
    render: function () {
        var self = this;
        this.$el.html('');

        if (this.active){
            this.collection.each(function (category) {
                var categoryView = new eco.Views.CategoryView({model: category});
                self.$el.append(categoryView.render().el);

            }, this);
        }
        return this;
    },
    onClick: function (event) {
        console.log($(event.target).parent());
        console.log(this.collection.get($(event.target).parent().attr('data-categoryid')).get('name'));
    }

});