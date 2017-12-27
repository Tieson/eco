eco = {
    Models: {},
    Collections: {},
    Views: {},
    Formaters: {},
    Validators: {},
    Mappers: {},
    Utils: {},
    basedir: '',
    ViewGarbageCollector: {
        items: [],
        clear: function () {
            _.each(this.items, function (item) {
                if (item && item.remove) {
                    item.stopListening();
                    item.remove();
                }
            });
            this.items = [];
        },
        add: function (item) {
            this.items.push(item)
        },
        getItems: function () {
            return this.items;
        }
    },
    buttons: {
        'saveSchema': ".saveSchemaButton",
        'undo': ".undoButton",
        'redo': ".redoButton",
        'exportSchema': ".vhdlExportSchemaButton",
        'libDownload': "#menu-file-download_lib",
    },
    selectors: {
        'main': '#page_main_content',
        'main_bar': '#main_bar',
        'pages': '#container--pages',
        'schemas': '#container--schemas',
        'canvasWrapper': '#canvasWrapper',
    },
    start: function () {
        var msg = "Start methode is not implemented";
        console.console.log(msg);
        alert(msg);
    }
};

