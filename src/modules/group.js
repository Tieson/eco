eco.Models.Group = Backbone.Model.extend({
    urlRoot: eco.basedir+'/api/groups',
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

/**
 * repre studenta a jeho skupiny
 */
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
        instanceUrl: eco.basedir+'/api/groups/',
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
    initialize: function (models, opts) {
        this.urlString = opts.url;
    },
    url: function () {
        return this.urlString;
    }
});

eco.Collections.UserGroupCollection = Backbone.Collection.extend({
    model: eco.Models.UserGroup,
    initialize: function (models,opts) {
        this.urlString = opts.url;
    },
    url: function () {
        return this.urlString;
    }
});


var groups = new eco.Collections.GroupCollection(null, {
    url: eco.basedir+'/api/groups/'
});

// eco.Models.StudentGroup = Backbone.Model.extend({
//     defaults: {
//         group_id: null,
//         student_id: null,
//         entered: null,
//     }
// });
//
// eco.Collections.StudentGroup = Backbone.Collection.extend({
//     model: eco.Models.StudentGroup,
//     initialize: function (opts) {
//         this.urlString = opts.url;
//     },
//     url: function () {
//         return this.urlString;
//     }
// });

eco.Views.GroupDetail = Backbone.View.extend({
    tagName: 'div',
    initialize: function (opts) {
        this.model = opts.model;

        this.students = new eco.Collections.Students(null, {
            url: eco.basedir+'/api/groups/' + this.model.get('id') + '/students'
        });
        this.allStudents = new eco.Collections.Students(null, {
            url: eco.basedir+'/api/students'
        });
        this.tasks = new eco.Collections.Tasks(null, {
            url: eco.basedir+'/api/tasks/valid'
        });


        this.selectedStudents = {};
        this.selectedTasks = {};

        this.vent = _.extend({}, Backbone.Events);

        this.listenTo(this.vent, 'student:remove', this.removeStudent);
        // this.listenTo(this.students, 'sync', this.render);
        // this.listenTo(this.students, 'remove', this.removeStudent);

        this.studentsView = new eco.Views.GenericList({
            title: "Studenti ve skupině",
            noRecordsMessage: 'Zatím zde nejsou žádní studenti.',
            template: '#groupDetailStudents-template',
            itemTemplate: '#groupsDetailStudent-template',
            formater: eco.Formaters.StudentFormater,
            collection: this.students,
            searchNames: [
                'list-name',
                'list-mail',
            ],
            vent: this.vent,
            uniqueId: 'groupStudentsList',
        });

        this.allStudentsView = new eco.Views.GenericList({
            noRecordsMessage: 'Zatím nejsou načteni žádní uživatelé.',
            template: '#groupsDetailUsers-template',
            itemTemplate: '#groupsDetailUsersItem-template',
            formater: eco.Formaters.StudentFormater,
            collection: this.allStudents,
            searchNames: [
                'list-name',
                'list-mail',
            ],
            uniqueId: 'groupUsersList',
        });
        this.tasksView = new eco.Views.GenericList({
            noRecordsMessage: 'Zatím nejsou načtena žádná zadání.',
            template: '#tasksSimple-template',
            itemTemplate: '#tasksSimpleItem-template',
            formater: eco.Formaters.TasksFormater,
            collection: this.tasks,
            searchNames: [
                'list-name',
                'list-created',
            ],
            uniqueId: 'tasksList',
        });

        this.students.fetch({
            error: this.studentsView.render()
        });
        this.renderInit();
        this.render();
    },
    events: {
        'click #addStudentsToGroupBtn':'addStudentModal',
        'click #addTasksBtn':'addTasksForStudentsModal',
        'click .groupStudentsListItem':'groupStudentClick',
        'click .tasksListItem':'groupTaskClick',
        'click .add-student':'addStudentToGroup',
        'click .remove-student':'removeStudent',
        'click #taskToStudentSubmit':'createHomeworks',
    },
    addStudentModal: function () {
        this.allStudents.fetch();
        $("#studentsAddToGroupModal .modal-body").html(this.allStudentsView.$el);
        $("#studentsAddToGroupModal").modal('show');
    },
    addTasksForStudentsModal: function () {
        this.tasks.fetch();
        this.selectedTasks = {};
        $("#taskToStudentModal .modal-body").html(this.tasksView.$el);
        $("#taskToStudentModal .modal-body").append('<div class="alert alert-info">Zde jsou k dispozici pouze validní zadání.</div>');
        $("#taskToStudentModal").modal('show');
    },
    groupStudentClick: function (e) {
        var target = $(e.currentTarget);
        var cid = target.attr('data-cid');
        var item = this.students.get(cid);

        if(this.selectedStudents[cid]){
            delete (this.selectedStudents[cid]);
            target.removeClass('studentSelected');
        }else{
            target.addClass('studentSelected');
            this.selectedStudents[cid] = item;
        }
        console.log(this.selectedStudents);
    },
    groupTaskClick: function (e) {
        var target = $(e.currentTarget);
        var cid = target.attr('data-cid');
        var item = this.tasks.get(cid);

        if(this.selectedTasks[cid]){
            delete (this.selectedTasks[cid]);
            target.removeClass('taskSelected');
        }else{
            target.addClass('taskSelected');
            this.selectedTasks[cid] = item;
        }
    },
    addStudentToGroup: function (e) {
        var self = this;
        var target = $(e.currentTarget);
        var cid = target.attr('data-cid');
        var item = this.allStudents.get(cid);

        console.log('addStudentToGroup', cid, item, item.get('id'), this.students);

        var student = new eco.Models.Student({student_id: item.get('id')});
        if(!this.students.get(item.get('id'))){
            this.students.create({
                student_id: item.get('id')
            }, {
                success: function () {
                    self.selectedStudents = {};
                    showSnackbar('hotovo, student byl přidán.');
                    self.studentsView.render();
                }, error: function () {
                    self.studentsView.render();
                    showSnackbar('Studenta se nepodařilo přidat.');
                }
            });
        }else{
            showSnackbar('Student je již ve skupině.');
        }
    },
    removeStudent: function (e) {
        var self = this;
        swal({
                title: "Opravdu chtete odebrat studenta ze skupiny?",
                text: "Odebrání nelze vzít zpět, ale lze ho znovu přidat.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ano, odebrat!",
                cancelButtonText: "Ne",
                closeOnConfirm: true
            },
            function () {
                var target = $(e.currentTarget);
                var cid = target.attr('data-cid');
                var item = self.students.get(cid);
                self.selectedStudents = {};

                item.destroy({
                    success: function (model) {
                        showSnackbar('Student '+model.get('name')+' byl odebrán');
                        self.students.remove(item);
                        self.studentsView.render();
                    }
                });

                self.render();
            });
        return false;

    },
    renderInit: function () {
        var self = this;
        this.$el.empty();

        this.groupDetailView = new eco.Views.GenericDetail({
            template: '#groupsDetail-template',
            formater: eco.Formaters.GroupDetailFormater,
            model: this.model,
            afterRender : function () {
                self.$el.find('.datepicker').datepicker({
                    language: 'cs',
                    format: 'yyyy-mm-dd',
                    todayHighlight: true
                });
                try {
                    self.$el.find('.clockpicker').clockpicker({
                        donetext: 'Vybrat'
                    });
                }catch (e){
                }
            }
        });

        this.$el.append(this.groupDetailView.$el);
        this.$el.append(this.studentsView.$el);

        console.log("this.$el.find('.datepicker')", this.$el.find('.datepicker'));
        return this;
    },
    render: function () {
        return this;
    },
    groupStudentDoubleClick:function () {
        console.log('groupStudentDoubleClick');
    },
    /**
     * Vytvoří pro vybrané studenty úkoly s vybranými zadáními.
     */
    createHomeworks: function () {
        var self = this;
        var tasks = Object.values(this.selectedTasks);
        var students = Object.values(this.selectedStudents);

        var student_task = [];

        var createdHw = 0;

        if (tasks.length > 0 && students.length >0) {
            var date = $('#hw_form-deadline').val();
            if (date) {
                var time = $('#hw_form-deadline-time').val();
                var i;
                for (i = 0; i < students.length; i++) {
                    var homework_for_student = new eco.Models.StudentHomework({
                        student_id: students[i].get('id'),
                        task_id: tasks[i % (tasks.length)].get('id'),
                        deadline: date + ' ' + time,
                        group_id: self.model.get('id'),
                    }, {
                        url: eco.basedir+'/api/homework',
                    });
                    // console.log('student', student);
                    homework_for_student.save(null, {
                        success: function (model, response, options) {
                            createdHw++;
                            showSnackbar('Bylo přidáno '+createdHw+ ' úkolů');
                        }
                    });
                    // console.log(i,students[i].get('id'),i%(tasks.length),tasks[i%(tasks.length)].get('id'));
                }
            }else {
                showSnackbar('Musíte nastavit datum termínu.');
            }
        }else{
            showSnackbar('Vyberte studenty a alespoň jedno zadání.');
        }
        console.log(student_task);
    }
});

eco.Views.GroupDetailSimple = Backbone.View.extend({

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

        if (this.validator(data)) {
            schema.save(data.toJSON(), {
                success: function (model, response) {
                    console.log("GroupAddForm formSubmit success", self.collection);
                    if (self.collection) {
                        self.collection.add(model);
                        self.model = new eco.Models.Group();
                        self.render();
                    }
                },
                error: function (model, response) {
                    if (self.collection) {
                        self.collection.remove(schema);
                    }
                    self.render();
                },
                wait: true
            });

            this.trigger("formSubmited", schema);
        }
        return false;
    }
});


eco.Views.GroupsList = eco.Views.GenericList.extend({
    events: {
        'click .group-delete': 'deleteItem',
    },
    afterInitialization: function () {
        this.listenTo(this.collection, 'add change', this.render);
    },
});


eco.Views.StudentAssignGroupsList = eco.Views.GenericList.extend({
    events: {
        // 'click .leaveGroup': 'leaveGroup',
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
                confirmButtonText: "Ano, odejít!",
                cancelButtonText: "Ne, zůstat.",
                closeOnConfirm: true
            },
            function () {
                var cid = $(event.currentTarget).attr('data-cid'),
                    model = self.collection.get(cid);
                model.set({instanceUrl:eco.basedir+'/api/groups/'+model.get('group_id')+'/students/'+model.get('student_id')});
                model.destroy();

                self.render();
                // swal("Smazáno!", "Skupina byla smazána.", "success");
            });
        return false;
    },
});



eco.Views.EditGroup = eco.Views.GenericForm.extend({
    afterInitialization: function () {
        this.origTitle = this.title;
        this.listenTo(this.model, 'sync', this.updateTitle);
    },
    updateTitle: function () {
        this.title = this.origTitle + ": " + this.model.get('subject');
        this.render();
    },
    onSuccess:function (schema, model) {
        this.model = model;
        this.updateTitle();
    },
    events: {
        'submit form': 'formSubmit',
    },
    // render: function () {
    //     var data = this.formater(this.model);
    //     var html = this.template({error: this.error, title: this.title, model: data});
    //     this.$el.html(html);
    //
    //     return this;
    // },
});