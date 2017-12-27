eco.Models.User = Backbone.Model.extend({
    urlRoot: eco.basedir+'/api/users'
});

eco.Collections.Users = Backbone.Collection.extend({
    model: eco.Models.User,
    initialize: function (models, opts) {
        this.urlString = (opts && opts.url) || eco.basedir+'/api/users';
    },
    url: function(){
        return this.urlString;
    }
});

