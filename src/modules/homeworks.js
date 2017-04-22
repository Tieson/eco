/**
 * Created by Tom on 22.04.2017.
 */


eco.Views.Homework = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#homeworkListItem-template').html()),

    initialize: function (opts) {
        //TODO: dodělat načítání učitele jako uživatele:
        //this.teacher = new eco.User
    },
    events: {
        'click': 'itemClick'
    },
    itemClick: function () {
        console.log('Homework click');
        // Backbone.history.navigate('teacher/circles/'+this.model.get('id'), {trigger: true, replace: true});
    },

    render: function() {
        var data = {
            cid: this.model.cid,
            id: this.model.get('id'),
            student_id: this.model.get('student_id'),
            teacher_id: this.model.get('teacher_id'),
            status: this.model.get('status'),
            name: this.model.get('name'),
            description: this.model.get('description'),
            created: moment(this.model.get('created')).format('LLL'),
            deadline: moment(this.model.get('deadline')).format('LLL'),
        };
        console.log(data);
        var html = this.template(data);
        this.$el.append(html);
        // this.$el.attr('data-id', data.id);
        // this.$el.attr('data-cid', data.cid);
        return this;
    }
});

eco.Views.HomeworkList = Backbone.View.extend({
    template: _.template($('#homeworkList-template').html()),
    initialize: function (opts) {
        this.listenTo(this.collection, 'sync', this.render);
    },
    events: {
    },
    renderOne: function(item) {
        var itemView = new eco.Views.Homework({model: item});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.homeworks-container').append(itemView.render().$el);
    },
    render: function () {
        console.log('HomeworkList: render');
        var html = this.template();
        this.$el.html(html);
        this.collection.each(this.renderOne, this);
        return this;
    }

});


