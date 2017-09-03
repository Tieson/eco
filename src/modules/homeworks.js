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
        return '/api/homework/';
    },
    haveSolution: function () {
        return false;
    }
});


eco.Collections.Homeworks = Backbone.Collection.extend({
    model: eco.Models.Homework,
    initialize: function (models, options) {
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
        schema_id: null,
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
        return '/api/homework/';
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


/**
 * Následující Modelay a pohley jsou pro zadávání úkolů studentům - pro učitele tedy
 */
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

/**
 * Zadávání úkolů studentům - pro učitele pouze
 */
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


eco.Views.HomeworkDetailSolution = eco.Views.GenericItem.extend({
    className: 'hwSchemaItem'
});


/**
 * Detail úkolu pro studenty
 */
eco.Models.HomeworkDetailSolution = Backbone.Model.extend({

});

eco.Models.Solution = Backbone.Model.extend({
    // urlRoot: '/api/solutions/',
    defaults: {
        id: null,
        architecture: '',
        name:'',
        homework_id: null,
        schema_id: null,
        schema_data_id: null,
        vhdl: '',
        created: null,
        status: 'waiting',
        test_result: null,
        test_message: null,
    }
});
eco.Collections.Solutions = Backbone.Collection.extend({
    model: eco.Models.Solution,
    initialize: function (models, opts) {
        this._url = opts.url;
    },
    url: function () {
        return this._url;
    }
});


eco.Views.HomeworkDetail = eco.Views.GenericDetail.extend({
    afterInitialization: function () {
        this.schemas = new eco.Collections.Schemas({});
        this.solutions = new eco.Collections.Solutions(null,{
            url: '/api/homework/'+this.model.get('id')+'/solutions',
        });
        this.solutionsView;
        this.renderInit();
        this.selectedSchema = null;
    },
    events: {
        'click .schemasSimpleListItem': 'hwSchemaItemClick',
        'click .showSubmitSolution': 'hwSolutionOpenClick',
        'click #homeworkSchemaModalSubmit': 'hwSubmitClick',
        'click .downloadVHDL': 'downloadVHDL',
        'click .delete-solution': 'deleteSolution'
    },
    hwSchemaItemClick: function (e) {
        $('.itemSelected').removeClass('itemSelected');
        $(e.currentTarget).addClass('itemSelected');
        var cid = $(e.currentTarget).attr('data-cid');
        var item = this.schemas.get(cid);
        this.selectedSchema = item;
        console.log(item);
    },
    hwSolutionOpenClick: function (e) {
        this.schemas.fetch();
        this.selectedSchema = null;
        // eco.ViewGarbageCollector.clear();
        var schemasView = new eco.Views.GenericList({
            title: "Zvolte schéma pro odevzdání:",
            template: '#schemasSimpleList-template',
            itemTemplate: '#schemasSimpleListItem-template',
            formater: eco.Formaters.SchemaSimpleFormater,
            collection: this.schemas,
            uniqueId: 'schemasSimpleList',
            searchNames: [
                'list-name',
                'list-architecture',
                'list-created',
            ]
        });
        eco.ViewGarbageCollector.add(schemasView);
        this.$el.find("#homeworkSchemaModalBody").html(schemasView.$el);
        $('#homeworkSchemaModal').modal('show');
        // $(e.currentTarget).hide();
    },
    hwSubmitClick: function (e) {
        var self = this;
        var vhdlEdporter = new VhdExporter();

        if (self.selectedSchema !== null) {
            this.selectedSchema.loadGraph(function () {
                var vhdl = vhdlEdporter.exportSchema(
                    self.selectedSchema.get('name'),
                    self.selectedSchema.get('architecture'),
                    self.selectedSchema.get('graph')
                );

                console.log("Odevzdávám", self.selectedSchema, vhdl);
                self.solutions.create({
                    homework_id: self.model.get('id'),
                    schema_id: self.selectedSchema.get('id'),
                    vhdl: vhdl,
                }, {
                    success: function () {
                        showSnackbar('Hotovo, úkol byl odevzdán.');
                    },
                    error: function () {
                        showSnackbar('Něco se pokazilo. Úkol nebyl odevzdán.');
                    }
                });
            });
        } else {
            showSnackbar('Jejda, nevybrali jste žádné schéma. Zkuste to znovu.');
            e.preventDefault();
            return false;
        }

    },
    downloadVHDL:function (e) {
      console.log("downloadVHDL", this.solutions);
        var cid = $(e.currentTarget).attr('data-cid');
        var item = this.solutions.get(cid);
    },
    deleteSolution: function (e) {
        var self = this;
        swal({
                title: "Opravdu chtete odevzdané řešení odstranit?",
                text: "Akci nelze vzít zpět!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ano, smazat!",
                cancelButtonText: "Ne",
                closeOnConfirm: true
            },
            function () {
                var cid = $(e.currentTarget).attr('data-cid');
                var model = self.solutions.get(cid);
                model.destroy({
                    success: function () {
                        self.solutions.remove(model);
                        (self.solutionsView && self.solutionsView.render());
                        console.log(self.solutions);
                        showSnackbar('Řešenbí bylo navždy ztaceno.');
                    },
                    error: function () {
                        showSnackbar('Řešení nešlo smazat z neznámého důvodu.');
                    }
                });

            });
    },
    renderInit: function () {
        var self = this;
        this.$el.empty();
        var detailView = new eco.Views.GenericDetail({
            template: '#homeworkDetail-template',
            formater: eco.Formaters.HomeworkFormater,
            model: this.model,
        });

        var solutionFormView = new eco.Views.GenericForm({
            mapper: eco.Mapper.SolutionHomeworkMapper
        });

        this.solutionsView = new eco.Views.GenericList({
            title: "Odevzdaná řešení k tomuto úkolu",
            noRecordsMessage: 'Zatím jste neodevzdali žádné řešení.',
            template: '#solutionsList-template',
            itemTemplate: '#solutionsListItem-template',
            formater: eco.Formaters.SolutionsFormater,
            collection: this.solutions,
            searchNames: [
                'list-name',
                'list-created',
                'list-status',
                'list-result',
            ]
        });
        this.solutions.fetch();

        this.$el.append(detailView.$el);
        this.$el.append(solutionFormView.$el);
        this.$el.append(this.solutionsView.$el);

        return this;
    },
    render: function () {
        return this;
    }

});

eco.Views.HomeworkTeacherDetail = eco.Views.HomeworkDetail.extend({

    renderInit: function () {
        var self = this;
        this.$el.empty();
        var detailView = new eco.Views.GenericDetail({
            title: 'Úkol: ',
            template: '#homeworkTeacherDetail-template',
            formater: eco.Formaters.HomeworkFormater,
            model: this.model,
        });

        this.solutionsView = new eco.Views.GenericList({
            title: "Odevzdaná řešení k tomuto úkolu",
            noRecordsMessage: 'Zatím nic nebylo odevzdáno.',
            template: '#solutionsList-template',
            itemTemplate: '#solutionsListItem-template',
            formater: eco.Formaters.SolutionsFormater,
            collection: this.solutions,
            searchNames: [
                'list-name',
                'list-created',
                'list-status',
                'list-result',
            ]
        });
        this.solutions.fetch();

        this.$el.append(detailView.$el);
        this.$el.append(this.solutionsView.$el);

        return this;
    },
});

eco.Views.GroupHomeworkList = eco.Views.GenericList.extend({
    events: {
        'click .homework-delete': 'deleteHomework'
    },
    deleteHomework: function (e) {

        var self = this;
        swal({
                title: "Opravdu chtete zrušit úkol?",
                text: "Odebrání nelze vzít zpět.",
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
                var item = self.collection.get(cid);

                item.destroy({
                    success: function (model) {
                        showSnackbar('Úkol byl odebrán');
                        // self.collection.remove(item);
                        self.render();
                    }
                });

                self.render();
            });
    }
});