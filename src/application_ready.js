/**
 * Created by Tom on 13.04.2017.
 */

eco.Router = Backbone.Router.extend({
    routes: {
        '': 'home',

        /** Schémata **/
        'schemas': 'showSchemas', //seznam schémat, která lze otevřít (pouze vlastní schémata)
        'schemas/new': 'schemaCreateNew', //vytvoření nového schema - pro konkrétního uživatele
        'schemas/:id/vhdl': 'schemaExportVhdl', //vytvoření nového schema - pro konkrétního uživatele
        'schemas/:id': 'openedSchema', //Pro editaci konkrétního schéma = otevření schéma (pouze jedno otevřené)
        'schemas/:id/edit': 'showSchemaEdit',

        'teacher/groups/:id/students/remove/:student_id': 'removeStudentFromGroup', //TODO: dodělat funkci pro odebrání studenta z kruhu
        // 'teachers/:id/tasks': 'showTasks', //přesunuto do teacher
        // 'teachers/:id/hw': 'showGroupHomeworks', /přesunuto do teacher


        //zadání - pro učitele...
        // 'tasks': 'showAllTasks',
        // 'tasks/:id': 'showTaskDetail',
        // 'tasks/:id/edit': 'editTask',


        /** Skupiny **/
        'groups': 'showGroups', // seznam všech skupin
        'groups/:id': 'showGroupDetail', // detail skupiny se seznamem studentů
        'groups/add' : 'addGroup', // formulář pro přidánjí nové skupiny

        /** Studenti **/
        'students': 'showStudents',
        'students/groups': 'showUserGroups', // zobrazí seznam skupin ve kterých student je
        'students/:id/groups/:id': 'showUserGroupDetail', // zobrazí detail skupiny ve které je student - jiný pohled pro studenta a ostatní
        'students/:id/homeworks': 'showStudentsHwList', // zobrazí všechny úkoly studenta

        'homeworks': 'showHwList', //zobrazí seznam úkolů
        'homeworks/:id': 'showHwDetail', //zobrazí detail úkolů se zadáním a dalšími informacemi

        '*path':  'defaultRoute',
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
