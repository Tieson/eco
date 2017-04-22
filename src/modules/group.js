
eco.Models.Group = Backbone.Model.extend({
    urlRoot: '/api/groups',
    defaults: {
        id: null,
        subject: "",
        day: null,
        weeks: "both",
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
        Backbone.history.navigate('teacher/circles/'+this.model.get('id'), {trigger: true, replace: true});
    },

    render: function() {
        var data = {
            cid: this.model.cid,
            id: this.model.get('id'),
            subject: this.model.get('subject'),
            day: this.model.getDay(this.model.get('day')),
            weeks: this.model.getWeeks(this.model.get('weeks')),
            block: this.model.get('block'),
            teacher: this.model.get('name'),
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


eco.Views.StudentGroupItem = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#groupsDetailStudent-template').html()),

    events: {
        'click .remove-student': 'removeStudent'
    },
    removeStudent: function (e) {
        e.preventDefault();
        console.log('removeStudent');
    },
    render: function() {
        var data = this.model.toJSON();
        console.log(data);
        var html = this.template(data);
        this.$el.append(html);
        return this;
    }
});


eco.Views.GroupDetail = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#groupsDetail-template').html()),
    initialize: function (opts) {
        this.listenTo(this.collection, 'sync', this.render);
    },
    events: {
    },
    renderOne: function(student) {
        var itemView = new eco.Views.StudentGroupItem({model: student});
        eco.ViewGarbageCollector.add(itemView);
        this.$('.students-container').append(itemView.render().$el);
    },

    render: function() {
        console.log('eco.Views.GroupDetail:render', this.model, this.collection);
        var data = {
            id: this.model.get('id'),
            subject: this.model.get('subject'),
            day: this.model.getDay(this.model.get('day')),
            weeks: this.model.getWeeks(this.model.get('weeks')),
            block: this.model.get('block'),
            created: moment(this.model.get('created')).format('LLL')
        };
        console.log(data);
        var html = this.template(data);
        this.$el.append(html);

        this.collection.each(this.renderOne, this);

        return this;
    }
});

