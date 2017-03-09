
var app = app || {};

app.Schema = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "",
        architecture: ''
    }
});