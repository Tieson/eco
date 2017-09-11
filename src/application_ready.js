/**
 * Created by Tom on 13.04.2017.
 */

eco.Router = Backbone.Router.extend({
    routes: {
'': 'home',

'schemas': 'showSchemas', //seznam schémat uživatele
'schemas/new': 'schemaCreateNew', //vytvoření nového schema
'schemas/:id/vhdl': 'schemaExportVhdl', //exportuje schéma do hdl souboru
'schemas/:id': 'openedSchema', //otevře schéma
'schemas/:id/edit': 'showSchemaEdit', //upraví údaje schéma

'students/groups': 'showUserGroups', //seznam skupin studenta

'homeworks': 'showHwList', //seznam úkolů
'homeworks/:id': 'showHwDetail', //detail úkolů

'*path':  'defaultRoute', // defaultní: error 404
    },
    route: function(route, name, callback) {
        var router = this;
        if (!callback) callback = this[name];

        var f = function () {
            $(document).off('keydown');
            callback && callback.apply(router, arguments);
        };
        return Backbone.Router.prototype.route.call(this, route, name, f);
    }
});


$(document).ready(function() {
    eco.start();
});
