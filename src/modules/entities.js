
eco.Models.Entity = Backbone.Model.extend({});

eco.Views.EntityView = Backbone.View.extend({
    tagName: "div",
    className: "entity noselect",
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        this.$el.html(this.model.get('name'));
        this.$el.attr('data-entityid', this.model.get('id'));
        this.$el.draggable({
            revert: true,
            appendTo: 'body',
            containment: '#canvasWrapper',
            scroll: false,
            helper: 'clone',
            grid: [ 7, 7 ],
            cursorAt:{top: 0, left: -14}
        });
        if(this.model.get('disabled')){
            this.$el.addClass('disabled');
            this.$el.draggable( "destroy" );
        }
        return this;
    }
});

eco.Collections.Entities = Backbone.Collection.extend({
    model: eco.Models.Entity,
    url: '/api/entities'
});

eco.Views.EntititesView = Backbone.View.extend({
    tagName: "div",
    className: "ribbon__contents__items",
    initialize: function (opts) {
        this.category = opts.category;
    },
    render: function () {
        var self = this;
        this.$el.html();
        _.each(this.collection, function (entity) {
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
        // entities: new eco.Collections.Entities()
    },
    // initialize: function (opts) {
    //     this.entities = new eco.Collections.Entities();
    //     this.entities.url = this.entitiesUrl();
    //     this.entities.fetch();
    // },
    // entitiesUrl: function () {
    //     return '/api/categories/' + this.id + '/entities';
    // }
});

eco.Views.CategoryView = Backbone.View.extend({
    className: 'ribbon__contents__category',
    initialize: function () {
        this.template = _.template($('#categoryItem-template').html());
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.attr('data-categoryid', this.model.get('id'));
        return this;
    },
    events: {
        'click .ribbon__contents__header': 'onCategoryClick'
    },
    onCategoryClick: function () {
        this.$el.find(".ribbon__contents__items").slideToggle();
    }
});


eco.Collections.Categories = Backbone.Collection.extend({
    model: eco.Models.Category,
    url: '/api/categories'
});

eco.Models.EntityPanel = Backbone.Model.extend({
    defaults: {
        visible: true,
        opened: true,
        categories: new eco.Collections.Categories(),
        entities: new eco.Collections.Entities()
    },
    initialize: function (opts) {
        this.categories = opts.categories;
        this.entities = opts.entities;
    },
    /**
     * Vrátí seznam entit
     * @param id_category Nepoviný parametr pro selektování entit kategorie
     */
    getEntities: function (id_category) {
        var result = this.get("entities");
        if (id_category){
            return result.filter(function (x) {
                return x.get('id_category') == id_category;
            });
        }
        return result;
    }
});

eco.Views.CategoriesView = Backbone.View.extend({
    el: "#ribbon",
    syncedAll: false,
    initialize: function (opts) {
        // this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model.get('categories'), 'sync', this.render);
        this.listenTo(this.model.get('entities'), 'sync', this.render);
        this.render();
    },
    events: {
        'click .entity': 'onEntityClick',
        'click .ribbon__toggle': function () {
            this.model.set('opened', !this.model.get('opened'));
            if (this.model.get('opened'))
                this.$el.removeClass('ribbon--hidden');
            else
                this.$el.addClass('ribbon--hidden');
        },
        // 'click ribbon__contents__header': 'onCategoryClick'
    },

    // onCategoryClick: function () {
    //     this.$el.find(".ribbon__contents__items").slideToggle();
    // },

    render: function () {
        var self = this;
        if (this.model.get('opened'))
            this.$el.removeClass('ribbon--hidden');
        else
            this.$el.addClass('ribbon--hidden');
        if (this.model.get('visible')){
            this.$el.show();
        }else{
            this.$el.hide();
        }
        var $container = $("#ribbonContent");
        $container.html('');

            this.model.get('categories').each(function (category) {
                var categoryView = new eco.Views.CategoryView({model: category });
                var $category = categoryView.render().$el;
                var catEntities = new eco.Views.EntititesView({collection: self.model.getEntities(category.id)});
                $category.append(catEntities.render().$el);
                $container.append($category);

            }, this);

        return this;
    },
    onEntityClick: function (event) {
        console.log($(event.target));

        // console.log(this.collection.get($(event.target).parent().attr('data-categoryid')).get('name'));
    }

});