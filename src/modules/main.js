

eco.Views.MainBar = Backbone.View.extend({
    template: _.template($('#main_bar-template').html()),
    initialize: function (opts) {
        this.user = opts.user;
        this.render();
    },
    render: function () {
        this.$el.html(this.template());
    }

});