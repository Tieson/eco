eco.Models.Users = Backbone.Model.extend({
    // urlRoot: '/api/users'
});

eco.Collections.Users = Backbone.Collection.extend({
    model: eco.Models.Users,
    initialize: function (models, opts) {
        this.urlString = (opts && opts.url) || '/api/users';
    },
    url: function(){
        return this.urlString;
    }
});

