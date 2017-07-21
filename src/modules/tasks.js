


eco.Models.Task = Backbone.Model.extend({
    urlRoot: '/api/tasks',
    // urlRoot: function () {
    //   return this._urlRoot;
    // },
    defaults: {
        id: null,
        teacher_id: null,
        name: "",
        description: "",
        created: null,
        etalon_file: "",
        test_file: ""
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
    initialize: function (opts) {
        this.urlString = opts.url;
    },
    url: function(){
        return this.urlString;
    }
});



eco.Views.Task = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#tasksListItem-template').html()),

    events: {
        'click .task_delete': 'taskDelete'
    },
    taskDelete: function () {
        console.log('taskDelete');
        // this.model.delete();
        // Backbone.history.navigate('teacher/circles/'+this.model.get('id'), {trigger: true, replace: true});
    },

    render: function() {
        var data = {
            cid: this.model.cid,
            id: this.model.get('id'),
            name: this.model.get('name'),
            description: this.model.get('description'),
            etalon_file: this.model.get('etalon_file'),
            test_file: this.model.get('test_file'),
            created: moment(this.model.get('created')).format('LLL')
        };
        console.log(data);
        var html = this.template(data);
        this.$el.append(html);
        this.$el.attr('data-id', data.id);
        this.$el.attr('data-cid', data.cid);
        return this;
    }
});


eco.Views.Tasks = Backbone.View.extend({
    initialize: function (opts) {
        this.listenTo(this.collection, 'sync', this.render);
        this.template = _.template($(opts.template).html());
    },
    events: {
    },
    renderOne: function(item) {
        var itemView = new eco.Views.Task({model: item});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.tasks-container').append(itemView.render().$el);
    },
    render: function () {

        var html = this.template();
        this.$el.html(html);

        this.collection.each(this.renderOne, this);

        return this;
    }
});

eco.Views.EditTask = eco.Views.GenericForm.extend({
   events: {
       'click .remove_file' : 'removeFile',
       'submit form': 'formSubmit',
   },
    removeFile: function (event) {
        console.log('click .remove_file', $(this), event);
        event.preventDefault();

        var target = $(event.currentTarget);
        var name = target.attr('data-name');

        this.model.set(name, null);

        return false;
    },
});