var app = app || {};

app.BaseModalView = Backbone.View.extend({

    id: 'base-modal',
    className: 'modal fade',

    events: {
        'hidden': 'teardown',
        'click .btn-storno': 'hide',
        'click .btn-save': 'save'
    },

    initialize: function(options) {
        // this.eventAgg = options.eventAgg;

        this.title = "Create new schema";
        this.template = _.template($(options.template).html());
        _(this).bindAll();
        // this.render();
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
        var data = { title: this.title, schema:this.model.toJSON() };
        this.$el.html(this.template(data));
        this.$el.modal({ show:false }); // dont show modal on instantiation
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
    }
});