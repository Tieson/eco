/**
 * Created by Tom on 13.04.2017.
 */

eco.Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        'schema/:id': 'openedSchema',

        'schemas': 'showSchemas', //seznam schémat, která lze otevřít (pouze vlastní schémata)
        'schemas/new': 'schemaCreateNew', //vytvoření nového schema
        'schemas/:id': 'showSchemaDetail', //Pro editaci konkrétního schéma = otevření schéma (pouze jedno otevřené)
        'schemas/:id/saveas': 'showSchemaSaveAs',

        // adresy začínající na teacher zobrazí pouze vyučující s patřičným oprávněním
        'teacher': 'teacherDashboard',
        'teacher/circles': 'showCircles',
        'teacher/circles/new' : 'newCircle',
        'teacher/circles/:id': 'circleDetail',
        'teacher/circles/:id/students/remove/:student_id': 'removeStudentFromGroup', //TODO: dodělat funkci pro odebrání studenta z kruhu


        'students/:id/homeworks': 'showStudentsHwList', // zobrazí všechny úkoly studenta

        'homeworks': 'showHwList', //zobrazí seznam úkolů
        'homeworks/:id': 'showHwDetail', //zobrazí detail pkolů se zadáním a dalšími informacemi

    }
});


$(document).ready(function() {


    // eco.templates = new eco.Models.TemplatesHolderContainer();

    // eco.appView = new eco.AppView();

    eco.start();
});
