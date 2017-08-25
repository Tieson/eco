/**
 * Created by Tom on 22.04.2017.
 */


eco.Models.Homework = Backbone.Model.extend({
    defaults: {
        id: null,
        task_id: null,
        student_id: null,
        teacher_id: null,
        created: null,
        deadline: null,
        status: "open",
        name: "",
        description: ""
    },
    statuses: {
        open: 'Nové / zadáno',
        done: 'Hotovo',
        sended: 'Odesláno'
    },
    getStatus: function () {
        return this.statuses[this.get('status')];
    },
    urlRoot: function () {
        return '/api/students/' + this.get('student_id') + '/hw';
    },
    haveSolution: function () {
        return false;
    }
});


eco.Collections.Homeworks = Backbone.Collection.extend({
    model: eco.Models.Homework,
    initialize: function (options) {
        this._url = options.url;
    },
    url: function () {
        return this._url;
    }
});


eco.Models.HomeworkTeacher = Backbone.Model.extend({
    defaults: {
        id: null,
        task_id: null,
        student_id: null,
        teacher_id: null,
        created: null,
        deadline: null,
        status: "open",
        name: "",
        description: "",
        student_name: "",
        student_mail: "",
        student_number: "",
    },
    statuses: {
        open: 'Nové / zadáno',
        done: 'Hotovo',
        sended: 'Odesláno'
    },
    getStatus: function () {
        return this.statuses[this.get('status')];
    },
    urlRoot: function () {
        return '/api/students/' + this.get('student_id') + '/hw';
    },
    haveSolution: function () {
        return false;
    }
});

eco.Collections.HomeworksTeacher = Backbone.Collection.extend({
    model: eco.Models.HomeworkTeacher,
    initialize: function (opts) {
        this._url = opts.url;
    },
    url: function () {
        return this._url;
    }
});


eco.Views.Homework = Backbone.View.extend({
    tagName: 'tr',

    initialize: function (opts) {
        //TODO: dodělat načítání učitele jako uživatele:
        //this.teacher = new eco.User
        if (opts.template) {
            this.template = _.template($(opts.template).html());
        } else {
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

    render: function () {
        var data = eco.Formaters.HomeworkFormater(this.model);
        console.log(data);
        var html = this.template(data);
        this.$el.append(html);
        // this.$el.attr('data-id', data.id);
        // this.$el.attr('data-cid', data.cid);
        return this;
    }
});

eco.Models.TaskStudent = Backbone.Model.extend({
    defaults: {
        task_id: null,
        student_id: null,
        deadline:null
        // user_id: null,
    },
    validate: function () {
        return (this.task_id !== null && this.student_id!==null && this.deadline !== null);
    }
});

eco.Views.StudentListItem = eco.Views.GenericItem.extend({
    className: 'studentForTask'
});

eco.Views.TaskListItem = eco.Views.GenericItem.extend({
    className: 'taskForStudent'
});


eco.Views.TaskStudent = Backbone.View.extend({
    template: _.template($('#homeworkAssigment-template').html()),
    initialize: function (opts) {
        this.tasks_collection = opts.tasks_collection;
        this.students_collection = opts.students_collection;
        // this.listenTo(this.tasks_collection, 'sync', this.render);
        // this.listenTo(this.students_collection, 'sync', this.render);
        this.students_collection.fetch();
        this.model = new eco.Models.TaskStudent();
        this.renderInit();
    },
    events: {
        'click .studentForTask': 'selectStudent',
        'click .taskForStudent': 'selectTask',
        'submit #homeworkAssigment-form': 'formSubmit',
    },
    formSubmit: function (e) {
        e.preventDefault();
        console.log("submit form");
        this.model = new eco.Models.TaskStudent();
        var elem = this.$el.find("#hw_form-student");
        elem.html("");
        elem = this.$el.find("#hw_form-task");
        elem.html("");
    },
    selectStudent: function (e) {
        var elem = this.$el.find("#hw_form-student");
        var target = e.currentTarget;
        var cid = $(target).attr('data-cid');
        elem.html($(target).find('.list-name').text()+" ("+$(target).find('.list-mail').text()+")");
        var model = this.students_collection.get(cid);
        this.model.set({student_id: model.get('id')});
        console.log(this.model);
    },
    selectTask: function (e) {
        var elem = this.$el.find("#hw_form-task");
        var target = e.currentTarget;
        elem.html($(target).find('.list-name').text());
        var cid = $(target).attr('data-cid');
        var model = this.tasks_collection.get(cid);
        this.model.set({task_id: model.get('id')});
        console.log(this.model);
    },
    renderOne: function (item) {
        var itemView = new eco.Views.Homework({model: item});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.items-container').append(itemView.render().$el);
    },
    renderInit: function () {
        var html = this.template();
        var self = this;
        this.$el.html(html);

        var studentList = this.$el.find("#studentsList");
        var tasksList = this.$el.find("#tasksList");

        var studentsView = new eco.Views.GenericList({
            title: "Úkoly",
            uniqueId: 'studentsList_genericList',
            template: '#studentsList-template', //TODO: změnit šablony -- bude to D&D
            itemTemplate: '#studentsListItem-template',
            itemView: eco.Views.StudentListItem,
            collection: self.students_collection,
            searchNames: [
                'list-name',
                'list-mail',
            ],
        });
        eco.ViewGarbageCollector.add(studentsView);
        studentList.html(studentsView.$el);

        var tasksView = new eco.Views.GenericList({
            title: "Zadání",
            uniqueId: 'tasksList_genericList',
            template: '#tasksList-template', //TODO: změnit šablony -- bude to D&D
            itemTemplate: '#tasksListItem-template',
            itemView: eco.Views.TaskListItem,
            formater: eco.Formaters.TasksFormater,
            collection: self.tasks_collection,
            searchNames: [
                'list-name',
                'list-created',
            ],
        });
        eco.ViewGarbageCollector.add(tasksView);
        tasksList.html(tasksView.$el);
        return this;
    },
    render: function () {

        return this;
    }
});

eco.Views.HomeworkList = Backbone.View.extend({
    template: _.template($('#homeworkList-template').html()),
    initialize: function (opts) {
        this.listenTo(this.collection, 'sync', this.render);
    },
    events: {},
    renderOne: function (item) {
        var itemView = new eco.Views.Homework({model: item});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.items-container').append(itemView.render().$el);
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

    render: function () {
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