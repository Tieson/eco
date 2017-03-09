
var app = app || {};

app.Settings = Backbone.Model.extend({
    defaults: {
        selCard: 0,
        selSchema: 0,
        schemaCounter: 0
    }
});