/**
 * Created by Tom on 22.04.2017.
 */


eco.Models.Homework = Backbone.Model.extend({
    defaults: {
        id: null,
        task_id: null,
        student_id: null, /* odkaz do tabulky user*/
        teacher_id: null,
        created: null,
        deadline: null,
        status: "open",
        name: "",
        description: "",
        solutions_count: "",
        entity: ""
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
        return eco.basedir+'/api/homework/';
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
        student_mail: ""
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
        return eco.basedir+'/api/homework/';
    },
    haveSolution: function () {
        return false;
    }
});

/**
 * Deprecated
 */
eco.Collections.HomeworksTeacher = Backbone.Collection.extend({
    model: eco.Models.HomeworkTeacher,
    initialize: function (models, opts) {
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
        deadline: null,
        entity: "",
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
        // console.log("submit form");
        this.model = new eco.Models.TaskStudent();
    },
    selectStudent: function (e) {
        var elem = this.$el.find("#hw_form-student");
        var target = e.currentTarget;
        var cid = $(target).attr('data-cid');
        elem.html($(target).find('.list-name').text()+" ("+$(target).find('.list-mail').text()+")");
        var model = this.students_collection.get(cid);
        this.model.set({student_id: model.get('id')});
        // console.log(this.model);
    },
    selectTask: function (e) {
        var elem = this.$el.find("#hw_form-task");
        var target = e.currentTarget;
        elem.html($(target).find('.list-name').text());
        var cid = $(target).attr('data-cid');
        var model = this.tasks_collection.get(cid);
        this.model.set({task_id: model.get('id')});
        // console.log(this.model);
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
    // urlRoot: eco.basedir+'/api/solutions/',
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
        test_message: '',
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
            url: eco.basedir+'/api/homework/'+this.model.get('id')+'/solutions',
        });
        this.solutionsView;
        this.renderInit();
        this.selectedSchema = null;
        this.selectedVhdl = null;

        var self = this;
        //TODO: testovat jestli došlo ke změně dat a jestli není zobrazen popup pro potvrzení smazání.
        // setInterval(function(){
        //     self.solutions.fetch();
        // }, 5000);
    },
    events: {
        'click .schemasSimpleListItem': 'hwSchemaItemClick',
        'click .showSubmitSolution': 'hwSolutionOpenClick',
        'click #showSubmitVhdl': 'vhdlFileUploadOpen',
        'click #homeworkSchemaModalSubmit': 'hwSubmitClick',
        'click #homeworkVhdlModalSubmit': 'hwVhdlSubmitClick',
        'click .delete-solution': 'deleteSolution',
        'click .refresh-solutions': 'refreshSolutionsList',
        'click .showVHDL': 'showVHDL',
        'click .downloadVHDL': 'downloadVHDL',
        'click .showErrorMessage': 'showErrorMessage',
        'change #vhdl_file_name': 'selectedVhdFileChanged'
    },

    refreshSolutionsList: function() {
        this.solutions.fetch();
    },

    disableVhdlFileSubmit: function () {
        this.$("#homeworkVhdlModalSubmit").attr("disabled", true);
        $("#vhdlSchemaName").text("");
        $("#vhdlSchemaArch").text("");
    },

    selectedVhdFileChanged: function (e) {
        var file = e.currentTarget.files[0];
        this.disableVhdlFileSubmit();
        var self = this;
        eco.Utils.getVhdlFileContent(file, function (name, arch, content) {
            if (name && arch) {
                $("#vhdlSchemaName").text(name);
                $("#vhdlSchemaArch").text(arch);
                self.selectedVhdl = {name:name, arch: arch, content: content};
                this.$("#homeworkVhdlModalSubmit").attr("disabled", false);
            }
        });
    },

    hwSchemaItemClick: function (e) {
        $('.itemSelected').removeClass('itemSelected');
        $(e.currentTarget).addClass('itemSelected');
        var cid = $(e.currentTarget).attr('data-cid');
        var item = this.schemas.get(cid);
        this.selectedSchema = item;
        // console.log(item);
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
    vhdlFileUploadOpen: function (e) {
        e.stopPropagation();
        // showSnackbar("Tato funkce bude brzy dostupná");
        // return false;
        this.$("#vhdlFileForm")[0].reset();
        this.disableVhdlFileSubmit();

        // eco.ViewGarbageCollector.add(schemasView);
        // this.$el.find("#homeworkSchemaModalBody").html(schemasView.$el);
        $('#homeworkVHDLModal').modal('show');
        // $(e.currentTarget).hide();
    },
    hwVhdlSubmitClick: function (e) {

        //TODO: nutnost vytvořit schéma, nebo to nějak jinak obejít
        var self = this;
        var vhdlEdporter = new VhdExporter();

        if (self.selectedVhdl !== null) {

                self.solutions.create({
                    homework_id: self.model.get('id'),
                    schema_id: null,
                    vhdl: self.selectedVhdl.content,
                    name: self.selectedVhdl.name,
                    architecture: self.selectedVhdl.architecture,
                }, {
                    at: 0,
                    success: function () {
                        showSnackbar('Hotovo, úkol byl odevzdán ze souboru');
                    },
                    error: function (err) {
                        showSnackbar('Úkol nebyl odevzdán. '+ err.error.text);
                    }
                });
        } else {
            showSnackbar('Jejda, není vybrán soubor s VHDL.');
            e.preventDefault();
            return false;
        }

    },
    hwSubmitClick: function (e) {
        var self = this;
        var vhdlEdporter = new VhdExporter();

        if (self.selectedSchema !== null) {
            this.selectedSchema.loadGraph(function () {
                var vhdl = vhdlEdporter.exportSchema(
                    self.model.get('entity')?self.model.get('entity'):self.selectedSchema.get('name'),
                    self.selectedSchema.get('architecture'),
                    self.selectedSchema.get('graph')
                );

                // console.log("Odevzdávám", self.selectedSchema, vhdl, self.model.get('entity'));
                self.solutions.create({
                    homework_id: self.model.get('id'),
                    schema_id: self.selectedSchema.get('id'),
                    vhdl: vhdl,
                }, {
                    at: 0,
                    success: function () {
                        showSnackbar('Hotovo, úkol byl odevzdán.');
                    },
                    error: function (obj,result) {
                        showSnackbar('Úkol nebyl odevzdán. '+result.responseJSON.error.text);
                    }
                });
            });
        } else {
            showSnackbar('Vyberte prosím schéma. Žádné jsem neoznačili.');
            e.preventDefault();
            return false;
        }

    },
    showVHDL:function (e) {
        var cid = $(e.currentTarget).attr('data-cid');
        var item = this.solutions.get(cid);
        var vhdl = item.get('vhdl');

        var name = item.get('name') || item.get('entity');

        this.$el.find("#vhdlViewModalBody").text(vhdl);
        $('#vhdlViewModal').find('.modal-title').text("VHDL odevzdaného schéma: " + name);
        $('#vhdlViewModal').modal('show');

    },
    showErrorMessage:function (e) {
        var cid = $(e.currentTarget).attr('data-cid');
        var item = this.solutions.get(cid);
        var message = item.get('test_message');

        this.$el.find("#vhdlViewModalBody").text(message);
        $('#vhdlViewModal').find('.modal-title').text("Chybová zpráva (ze simulace Vivado)");
        $('#vhdlViewModal').modal('show');

    },
    downloadVHDL: function (e) {
        var cid = $(e.currentTarget).attr('data-cid');
        var item = this.solutions.get(cid);
        var vhdl = item.get('vhdl');
        var name = item.get('name') || item.get('entity');
        var file_name = name + ".vhd";
        eco.Utils.downloadAsFile(vhdl, file_name);
    },
    deleteSolution: function (e) {
        this.solutionsView.deleteItem(e);
    },
    renderInit: function () {
        var self = this;
        this.$el.empty();
        var detailView = new eco.Views.HomeworkInfoDetail({
            template: '#homeworkDetail-template',
            formater: eco.Formaters.HomeworkFormater,
            model: this.model,
        });

        var solutionFormView = new eco.Views.GenericForm({
            mapper: eco.Mappers.SolutionHomeworkMapper
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



eco.Views.HomeworkInfoDetail = eco.Views.GenericDetail.extend({
    afterInitialization: function () {
        this.listenTo(this.model, 'sync change', this.initRenderTaskFiles);
    },
    initRenderTaskFiles: function () {
        var self = this;

        var files = new eco.Collections.Files(null,{
            url: eco.basedir+'/api/tasks/'+self.model.get('task_id')+'/files_normal',
        });
        files.fetch();

        this.filesView = new eco.Views.GenericList({
            el: "#taskFilesContainer",
            title: "Přiložené soubory",
            noRecordsMessage: 'Žádné soubory nejsou přiloženy',
            template: '#homeworkFilesList-template',
            itemTemplate: '#homeworkFilesItem-template',
            formater: eco.Formaters.FileFormater,
            collection: files,
            searchNames: [
                'list-file',
            ]
        });
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
            noRecordsMessage: 'Zatím nebylo nic odevzdáno.',
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