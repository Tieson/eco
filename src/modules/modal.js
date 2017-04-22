
eco.Views.BaseModalView = Backbone.View.extend({

    id: 'base-modal',
    className: 'modal fade',

    events: {
        'hidden': 'teardown',
        'click .btn-storno': 'hide',
        'click .btn-save': 'save'
    },

    initialize: function(options) {
        // this.eventAgg = options.eventAgg;

        this.title = options.title;
        this.template = _.template($(options.template).html());
        _(this).bindAll();
        // this.render();
        this.inputValidator = options.inputValidator;
        this.onSuccess = options.onSuccess;
        this.onCancel = options.onCancel;
    },

    show: function(options) {
        this.model = options.model;
        this.title = options.title;
        this.render();
        this.$el.modal('show');
    },

    hide: function() {
        this.$el.modal('hide');
    },

    teardown: function() {
        this.$el.data('modal', null);
        this.remove();
    },

    render: function() {
        var data = { title: this.title, model:this.model.toJSON() };
        this.$el.html(this.template(data));
        this.$el.modal({ show:false }); // dont show modal on instantiation
        this.$el.find('[data-toggle="tooltip"]').tooltip();
        return this;
    },

    save: function (event) {
        console.log("saving");
    },

});

eco.Views.SchemaModalView = eco.Views.BaseModalView.extend({

    events: {
        'hidden': 'teardown',
        'click .btn-storno': 'hide',
        'click .btn-save': 'save',
        'keypress input': 'keypress'
    },

    initialize: function(options) {
        // this.eventAgg = options.eventAgg;

        this.title = "Create new schema";
        this.template = _.template($(options.template).html());
        _(this).bindAll();
        // this.render();
        this.inputValidator = options.inputValidator;
    },

    render: function() {
        var data = { title: this.title, schema:this.model.toJSON() };
        this.$el.html(this.template(data));
        this.$el.modal({ show:false }); // dont show modal on instantiation
        this.$el.find('[data-toggle="tooltip"]').tooltip();
        return this;
    },

    save: function (event) {
        console.log("saving");
        this.model.set('name', this.$el.find("#schema_name").val());
        this.model.set('architecture', this.$el.find("#schema_architecture").val());
        if (this.model.validateParams()) {
            this.trigger("save", this.model);
            this.hide();
        }
        // this.model.save();
    },

    /**
     * Validuje název při stisku tlačítka
     * @param event
     * @returns {boolean}
     */
    keypress: function (event) {
        console.log($(event.target));
        if (this.inputValidator) {
            this.inputValidator(this, event);
        }
    }
});

eco.Views.SchemaOpenListModalView = eco.Views.BaseModalView.extend({

    events: {
        'hidden': 'teardown',
        'click .btn-storno': 'hide',
        'click .schema_open_list__item': 'itemClick',
    },

    show: function(options) {
        this.collection.fetch();
        this.render();
        this.$el.modal('show');
    },

    initialize: function(options) {
        // this.eventAgg = options.eventAgg;

        this.title = options.title?options.title:"";
        this.template = _.template($(options.template).html());
        _(this).bindAll();
        // this.render();
        this.inputValidator = options.inputValidator;
        this.listenTo(this.collection,"sync", this.render);
    },

    render: function() {
        this.$el.html(this.template({
            title: this.title,
            collection: this.collection.toJSON()
        }));
        this.$el.modal({ show:false }); // dont show modal on instantiation
        this.$el.find('[data-toggle="tooltip"]').tooltip();
        return this;
    },
    itemClick: function (event) {
        this.trigger("itemClick", this.collection.get($(event.currentTarget).attr("data-schema-id")));
        this.hide();
    }
});
