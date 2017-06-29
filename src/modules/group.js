
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
    }
});

eco.Models.UserGroup = Backbone.Model.extend({
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

eco.Collections.GroupCollection = Backbone.Collection.extend({
    model: eco.Models.Group,
    initialize: function (opts) {
        this.urlString = opts.url;
    },
    url: function(){
        return this.urlString;
    }
});

eco.Collections.UserGroupCollection = Backbone.Collection.extend({
    model: eco.Models.UserGroup,
    initialize: function (opts) {
        this.urlString = opts.url;
    },
    url: function(){
        return this.urlString;
    }
});



eco.Views.GroupDetail = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#groupsDetail-template').html()),
    initialize: function (opts) {
        this.listenTo(this.model, 'sync', this.render);

        this.students = new eco.Collections.Students();
        this.students.url = '/api/groups/'+this.model.get('id')+'/students';
        this.students.fetch();

        // this.listenTo(this.students, 'sync', this.render);
        // this.listenTo(this.students, 'remove', this.removeStudent);
    },
    renderOne: function(student) {
        var itemView = new eco.Views.StudentGroupItem({model: student});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.students-container').append(itemView.render().$el);
    },
    render: function() {
        var self = this;

        var data = {
            id: this.model.get('id'),
            subject: this.model.get('subject'),
            day: eco.Utils.getDay(this.model.get('day')),
            weeks: eco.Utils.getWeeks(this.model.get('weeks')),
            block: this.model.get('block'),
            teacher: {name: this.model.get('name'), mail: this.model.get('mail')},
            created: moment(this.model.get('created')).format('LLL')
        };
        var html = this.template(data);
        this.$el.html(html);

        if(self.students.length>0){
            self.students.each(self.renderOne, self);
        }

        return this;
    },
    removeStudent:function (model) {
        model.url = '/api/groups/'+this.model.get('id')+'/students/'+model.get('id');
        model.destroy();
    }
});

