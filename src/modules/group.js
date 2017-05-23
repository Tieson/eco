
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
        return {
            id: data.id,
            subject: data.subject,
            day: data.day,
            weeks: data.weeks,
            name: data.name,
            mail: data.mail,
            block: data.block,
            created: data.created
        };
    },
    initialize: function (opts) {

    },
    getDay: function (key) {
        var days = {
            po: 'Pondělí',
            ut: 'Úterý',
            st: 'Středa',
            ct: 'Čtvrtek',
            pa: 'Pátek',
            so: 'Sobota',
            ne: 'Neděle'
        };
        return days[key];
    },
    getWeeks: function (key) {
        var weeks = {
            both: 'Každý',
            odd: 'Lichý',
            even: 'Sudý'
        };
        return weeks[key];
    }
});

eco.Collections.GroupCollection = Backbone.Collection.extend({
    model: eco.Models.Group,
    url: '/api/groups'
});

eco.Views.GroupView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#groupsListItem-template').html()),

    events: {
        'click': 'groupClick'
    },
    groupClick: function () {
        console.log('groupClick');
        // Backbone.history.navigate('teacher/circles/'+this.model.get('id'), {trigger: true, replace: true});
    },

    render: function() {
        var data = {
            cid: this.model.cid,
            id: this.model.get('id'),
            subject: this.model.get('subject'),
            day: this.model.getDay(this.model.get('day')),
            weeks: this.model.getWeeks(this.model.get('weeks')),
            block: this.model.get('block'),
            teacher: {name: this.model.get('name'), mail: this.model.get('mail')},
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

eco.Views.GroupList = Backbone.View.extend({
    template: _.template($('#groupsList-template').html()),
    initialize: function (opts) {
        this.listenTo(this.collection, 'sync', this.render);
    },
    events: {
    },
    renderOne: function(group) {
        var itemView = new eco.Views.GroupView({model: group});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.groups-container').append(itemView.render().$el);
    },
    render: function () {
        console.log('eco.Views.GroupList: render');

        var html = this.template();
        this.$el.html(html);

        this.collection.each(this.renderOne, this);

        return this;
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
            day: this.model.getDay(this.model.get('day')),
            weeks: this.model.getWeeks(this.model.get('weeks')),
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

