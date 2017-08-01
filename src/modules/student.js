
eco.Models.Student = Backbone.Model.extend({
    // urlRoot: '/api/students'
});

eco.Collections.Students = Backbone.Collection.extend({
    model: eco.Models.Student,
});


eco.Views.StudentGroupItem = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#groupsDetailStudent-template').html()),
    initialize: function (options) {
        this.vent = options.vent;
        this.listenTo(this.model, 'remove', this.remove);
    },
    events: {
        'click .remove-student': 'removeStudent'
    },
    removeStudent: function (e) {
        e.preventDefault();
        console.log('removeStudent');
        // this.model.collection.remove(this.model);
        this.vent.trigger('student:remove', this.model);
        // this.model.destroy();
    },
    render: function() {
        console.log('render');
        var data = this.model.toJSON();
        console.log(data);
        var html = this.template(data);
        this.$el.append(html);
        return this;
    }
});
