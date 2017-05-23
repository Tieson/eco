/**
 * Created by Tom on 22.04.2017.
 */


eco.Models.Homework = Backbone.Model.extend({
    defaults: {
        id: null,
        task_id: null,
        student_id: null,
        created: null,
        deadline: null,
        status: "open",
        teacher_id: null,
        name: "",
        description: ""
    },
    statuses: {
        open: 'Nové / zadáno',
        done: 'Hotovo',
        sended: 'Odesláno'
    },
    getStatus: function(){
        return this.statuses[this.get('status')];
    },
    urlRoot: function(){
        return '/api/students/'+this.get('student_id') + '/hw';
    }
});


eco.Collections.Homeworks = Backbone.Collection.extend({
    model: eco.Models.Homework,
    initialize: function (options) {
        this.student_id = options.student_id;
    },
    url: function(){
        return '/api/students/'+this.student_id + '/hw';
    }
});

eco.Views.Homework = Backbone.View.extend({
    tagName: 'tr',

    initialize: function (opts) {
        //TODO: dodělat načítání učitele jako uživatele:
        //this.teacher = new eco.User
        if (opts.template) {
            this.template = _.template($(opts.template).html());
        }else {
            this.template = _.template($('#homeworkListItem-template').html());
        }
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
            status: this.model.getStatus(),
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



eco.Views.HomeworkDetail = Backbone.View.extend({

    template: _.template($('#homeworkDetail-template').html()),
    initialize: function (opts) {
        //TODO: dodělat načítání učitele jako uživatele:
        //this.teacher = new eco.User
        this.listenTo(this.model, 'sync', this.render);
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
            status: this.model.getStatus(),
            name: this.model.get('name'),
            description: this.model.get('description'),
            created: moment(this.model.get('created')).format('LLL'),
            deadline: moment(this.model.get('deadline')).format('LLL'),
        };
        console.log(data);
        var html = this.template(data);
        this.$el.html(html);
        // this.$el.attr('data-id', data.id);
        // this.$el.attr('data-cid', data.cid);
        return this;
    }

});


