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


eco.Views.UsersAdminList = eco.Views.GenericList.extend({
    events: {
        'click .user_set-teacher': 'setRole',
        'click .user_set-student': 'setRole',
        'click .user_set-guest': 'setRole',
    },
    setRole: function (e) {
        var btn = $(e.currentTarget);
        var role = btn.attr('data-setRole');
        var userCid = btn.attr('data-cid');
        var user = this.collection.get(userCid);
        user.set('type_uctu', role);
        user.save();
        // this.collection.sync();
    }
});