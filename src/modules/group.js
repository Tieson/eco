eco.Models.Group = Backbone.Model.extend({
    urlRoot: '/api/groups',
    defaults: {
        id: null,
        subject: "",
        day: null,
        weeks: "both",
        name: "",
        mail: "",
        block: null,
        created: null
    },
    parse: function (data) {
        return data;
    },
    initialize: function (opts) {

    },
    dayFormat: function () {
        var self = this;
        return eco.Utils.getDay(self.get('day'));
    },
    getDayList: function () {
        return eco.Utils.days;
    },
    getWeeksList: function () {
        return eco.Utils.weeks;
    }
});

eco.Models.UserGroup = Backbone.Model.extend({
    url:function(){
        return this.instanceUrl;
    },
    defaults: {
        id: null,
        student_id: null,
        group_id: null,
        entered: null,
        approved: false,
        subject: "",
        name: "",
        mail: "",
        day: null,
        weeks: null,
        block: null,
        instanceUrl: '/api/groups/',
    },
    parse: function (data) {
        return {
            id: data.group_id + '_' + data.student_id,
            group_id: data.group_id,
            student_id: data.student_id,
            entered: data.entered,
            approved: data.approved,
            subject: data.subject,
            name: data.name,
            mail: data.mail,
            day: data.day,
            weeks: data.weeks,
            block: data.block,
        };
    },
    initialize: function (opts) {

    },
    dayFormat: function () {
        var self = this;
        return eco.Utils.getDay(self.get('day'));
    },
    getDayList: function () {
        return eco.Utils.days;
    },
    getWeeksList: function () {
        return eco.Utils.weeks;
    }
});

eco.Collections.GroupCollection = Backbone.Collection.extend({
    model: eco.Models.Group,
    initialize: function (opts) {
        this.urlString = opts.url;
    },
    url: function () {
        return this.urlString;
    }
});

eco.Collections.UserGroupCollection = Backbone.Collection.extend({
    model: eco.Models.UserGroup,
    initialize: function (opts) {
        this.urlString = opts.url;
    },
    url: function () {
        return this.urlString;
    }
});


eco.Views.GroupDetail = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#groupsDetail-template').html()),
    initialize: function (opts) {
        this.listenTo(this.model, 'sync', this.render);

        this.students = new eco.Collections.Students();
        this.students.url = '/api/groups/' + this.model.get('id') + '/students';
        this.students.fetch();

        this.vent = _.extend({}, Backbone.Events);

        this.listenTo(this.vent, 'student:remove', this.removeStudent);
        // this.listenTo(this.students, 'sync', this.render);
        // this.listenTo(this.students, 'remove', this.removeStudent);
    },
    renderOne: function (student) {
        var itemView = new eco.Views.StudentGroupItem({model: student, vent: this.vent});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.students-container').append(itemView.render().$el);
    },
    render: function () {
        var self = this;
        var data = _.extend({}, this.model.toJSON(), {
            day: eco.Utils.getDay(this.model.get('day')),
            weeks: eco.Utils.getWeeks(this.model.get('weeks')),
            teacher: {name: this.model.get('name'), mail: this.model.get('mail')},
            created: moment(this.model.get('created')).format('LLL')
        });
        var html = this.template(data);
        this.$el.html(html);

        if (self.students.length > 0) {
            self.students.each(self.renderOne, self);
        }

        return this;
    },
    removeStudent: function (model) {
        model.url = '/api/groups/' + this.model.get('id') + '/students/' + model.get('id');
        model.destroy();
    }
});

eco.Views.GroupAddForm = eco.Views.GenericForm.extend({

    initialize: function (opts) {
        eco.Views.GroupAddForm.__super__.initialize.apply(this, arguments);
        this.collection = opts.collection;
    },
    formSubmit: function (e) {
        e.preventDefault();
        var self = this;
        var schema = this.model;

        var data = this.model.clone();
        data.set(this.mapper(self.$el));

        this.collection.add(schema);

        if (this.validator(data)) {
            schema.save(data.toJSON(), {
                success: function (model, response) {
                    schema.fetch();
                    self.model = new eco.Models.Group();
                    self.render();
                },
                error: function (model, response) {
                    this.collection.remove(schema);
                    self.render();
                },
                wait: true
            });

            // this.trigger("formSubmited", schema);
        }
        return false;
    }
});


eco.Views.GroupsList = eco.Views.GenericList.extend({
    events: {
        'click .group-delete': 'groupDelete',
    },
    groupDelete: function (event) {
        event.preventDefault();
        var self = this;
        swal({
                title: "Opravdu chtete skupinu odstranit?",
                text: "Odebrání nelze vzít zpět!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ano, smazat!",
                cancelButtonText: "Ne",
                closeOnConfirm: true
            },
            function () {
                var cid = $(event.currentTarget).attr('data-cid'),
                    model = self.collection.get(cid);
                console.log(cid, self.collection, model);

                model.destroy({
                    success: function () {
                        console.log("succes");
                    }
                });

                self.render();
                // swal("Smazáno!", "Skupina byla smazána.", "success");
            });
        return false;
    }
});


eco.Views.StudentAssignGroupsList = eco.Views.GenericList.extend({
    events: {
        'click .leaveGroup': 'leaveGroup',
    },
    afterInitialization:  function () {
        console.log("AFTER INIT");
        this.initSortable();
    },
    leaveGroup: function (event) {
        event.preventDefault();
        var self = this;
        swal({
                title: "Opravdu chtete opustit skupinu?",
                text: "Nebudou vám přidělovány žádné úkoly pocházející z této skupiny.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ano, odejít! (Yes)",
                cancelButtonText: "Ne, zůstat. (No)",
                closeOnConfirm: true
            },
            function () {
                var cid = $(event.currentTarget).attr('data-cid'),
                    model = self.collection.get(cid);
                console.log(cid, self.collection, model);

                model.set({instanceUrl:'/api/groups/'+model.get('group_id')+'/students/'+model.get('student_id')});

                console.log("_-_-_-_-_", model, cid);

                model.destroy();

                self.render();
                // swal("Smazáno!", "Skupina byla smazána.", "success");
            });
        return false;
    },
    initSortable: function () {
    }
});


eco.Models.UserInGroup = Backbone.Model.extend({
    urlRoot: '/api/groups',
    defaults: {
        id: null,
        student_id: null,
        entered: null,
        approved: false,
        subject: "",
        name: "",
        mail: "",
        day: null,
        weeks: null,
        block: null,
    },
    parse: function (data) {
        return {
            id: data.group_id,
            student_id: data.student_id,
            entered: data.entered,
            approved: data.approved,
            subject: data.subject,
            name: data.name,
            mail: data.mail,
            day: data.day,
            weeks: data.weeks,
            block: data.block,
        };
    },
    initialize: function (opts) {

    },
});