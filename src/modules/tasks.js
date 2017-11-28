


eco.Mappers.TaskEditMapper = function ($element) {
    return {
        'name': $element.find('#task_name').val(),
        'description': $element.find('#task_description').val(),
        'entity': $element.find('#task_entity').val(),
    }
};


eco.Models.Task = Backbone.Model.extend({
    urlRoot: eco.basedir+'/api/tasks',
    // urlRoot: function () {
    //   return this._urlRoot;
    // },
    defaults: {
        id: null,
        teacher_id: null,
        name: "",
        description: "",
        entity: "",
        created: null,
        // etalon_file: null,
        // test_file: null,
        // files: {}
    },
    initialize: function (opts) {
        if (opts) {
            if (opts.urlRoot)
                this._urlRoot = opts.urlRoot;
            if (opts.url)
                this.url = opts.url;
        }
    },
});

eco.Collections.Tasks = Backbone.Collection.extend({
    model: eco.Models.Task,
    initialize: function (models, opts) {
        this.urlString = (opts && opts.url);
    },
    url: function(){
        return this.urlString;
    }
});



eco.Views.Task = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#tasksListItem-template').html()),

    events: {
        // 'click .task_delete': 'taskDelete'
    },
    taskDelete: function (e) {
        e.preventDefault();
        return false;
        // this.model.delete();
        // Backbone.history.navigate('teacher/circles/'+this.model.get('id'), {trigger: true, replace: true});
    },

    render: function() {
        var data = _.extend({}, this.model.toJSON(), {
            created: moment(this.model.get('created')).format('LLL')
        });
        console.log(data);
        var html = this.template(data);
        this.$el.append(html);
        this.$el.attr('data-id', data.id);
        this.$el.attr('data-cid', data.cid);
        return this;
    }
});


eco.Views.Tasks = eco.Views.GenericList.extend({
    // afterInitialization: function (opts) {
    //     this.listenTo(this.collection, 'sync', this.render);
    //     this.template = _.template($(opts.template).html());
    // },
    events: {
        'click .task_delete': 'itemDelete',
    },
    // renderOne: function(item) {
    //     var itemView = new eco.Views.Task({model: item});
    //     eco.ViewGarbageCollector.add(itemView);
    //     this.$('.tasks-container').append(itemView.render().$el);
    // },
    // render: function () {
    //     var html = this.template();
    //     this.$el.html(html);
    //
    //     this.collection.each(this.renderOne, this);
    //
    //     return this;
    // },
    itemDelete: function (event) {
        event.preventDefault();
        var self = this;
        swal({
                title: "Opravdu chtete zadání úkolu odstranit?",
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

eco.Views.EditTask = eco.Views.GenericForm.extend({
    afterInitialization: function () {
        this.origTitle = this.title;
        this.listenTo(this.model, 'sync', this.updateTitle);
    },
    updateTitle: function () {
        console.log("updateTitle");
        this.title = this.origTitle + ": " + this.model.get('name');
        this.render();
    },
    onSuccess:function (schema, model) {
        console.log("saved", schema, model);
        this.model = model;
        this.updateTitle();
    },
   events: {
       'submit form': 'formSubmit',
   },
    render: function () {
        var data = this.formater(this.model);
        var html = this.template({error: this.error, title: this.title, model: data});
        this.$el.html(html);

        return this;
    },
});