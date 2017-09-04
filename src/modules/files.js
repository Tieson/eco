/**
 * Created by Tom on 01.08.2017.
 */

eco.Mapper.FileMapper = function ($element) {
    return {
        'name': $element.find('#file_label').val(),
        'type': $element.find('#file_type').val(),
        'file': $element.find('#file_name').val(),
    }
};


eco.Models.File = Backbone.Model.extend({
    urlRoot: eco.basedir+'/api/files',
    // url: function () {
    //     return this._url;
    // },
    // urlRoot: function () {
    //     return this._urlRoot;
    // },
    defatults: {
        id: null,
        name: '',
        file: "",
        type: "normal",
        task_id: null,
    },
    initialize: function (data, options) {
        if (options) {
            if (options.urlRoot)
                this._urlRoot = options.urlRoot;
            if (options.url)
                this.url = options.url;
            this.task_id = options.task_id;
        }
    },
});

eco.Collections.Files = Backbone.Collection.extend({
    model: eco.Models.File,
    url: function () {
        return this.urlString;
    },
    initialize: function (models, options) {
        this.urlString = options.url || eco.basedir+'/api/files';
    }
});

eco.Views.AddFileForm = Backbone.View.extend({
    tagName: 'div',
    initialize: function (opts) {
        this.title = opts.title || "";
        this.template = _.template($(opts.template).html());
        this.vent = opts.vent;
        this.model = opts.model;
        this.task_id = opts.task_id;
    },
    events: {
        'submit form': 'formSubmit',
    },
    render: function () {
        var html = this.template({task:{id:this.task_id}});
        this.$el.html(html);

        return this;
    },
    formSubmit: function (e) {
        console.log("FORM file upload SUBMIT");
    }
});

eco.Views.Files = eco.Views.GenericList.extend({
    events: {
        'click .file_delete': 'itemDelete',
    },
    itemDelete: function (event) {
        event.preventDefault();
        var self = this;
        swal({
                title: "Opravdu chtete soubor odstranit?",
                text: "Odebrání nelze vzít zpět!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ano, smazat!",
                cancelButtonText: "Ne",
                closeOnConfirm: true
            },
            function () {
                var cid = $(event.currentTarget).attr('data-cid'),
                    model = self.collection.get(cid);
                console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK k k k k k k", cid, self.collection, model);

                model.destroy({
                    success: function () {
                        console.log("succes");
                    }
                });

                self.render();
            });
        return false;
    }

});