
var app = app || {};


eco.Models.Task = Backbone.Model.extend({
    urlRoot: '/api/'
});

eco.Models.Homework = Backbone.Model.extend({
    defaults: {
        id: null,
        task_id: null,
        student_id: null,
        created: null,
        deadline: null,
        status: "open",
        teacher_id: null,
        name: "",
        description: ""
    },
    getStatus: function(){
        return " ahoj";
    }
});


eco.Collections.Homeworks = Backbone.Collection.extend({
    model: eco.Models.Homework,
    initialize: function (options) {
        this.student_id = options.student_id;
    },
    url: function(){
        return '/api/students/'+this.student_id + '/hw';
    }
});