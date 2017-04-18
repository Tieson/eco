
var app = app || {};


eco.Group = Backbone.Model.extend({
    urlRoot: '/api/groups',
    defaults: {
        id: null,
        subject: "",
        day: null,
        weeks: "both",
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
            created: datal.created
        };
    },
    initialize: function (opts) {

    }
});
eco.GroupCollection = Backbone.Collection.extend({
    model: eco.Group
});