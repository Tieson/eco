/**
 * Created by Tom on 13.04.2017.
 */

var eco = eco || {};
eco.helpers = eco.helpers || {};

eco.helpers.TemplateHolder = Backbone.Model.extend({
    idAttribute: "key",
    defaults: {
        key: null,
        html: ""
    }
});

eco.helpers.TemplatesHolder = Backbone.Collection.extend({
    model: eco.helpers.TemplateHolder
});

eco.helpers.TemplatesHolderContainer = Backbone.Model.extend({
    opts: {
        autoload: true,
        removeTemplates: true
    },
    initialize: function (options) {
        this.opts = $.extend({}, this.opts, options);
        this.collection = new eco.helpers.TemplatesHolder();
        if (this.opts.autoload){
            this.loadTemplates();
        }
    },

    getTemplates: function () {
        return this.collection;
    },

    getTemplateHTML:function (key) {
        console.log("getTemplateHTML", key);
        return this.collection.get(key).get('html');
    },

    /**
     * Najde šablonu s id = key  a získá její HTML
     * @param key klíč (id) s hashem
     * @returns {*}
     */
    addTemplate:function (key) {
        var html = $(key).html();
        this.collection.add(new eco.helpers.TemplateHolder({ key: key, html: html }));
    },

    hasTemplate: function (key) {
        return !!this.collection.get(key);
    },

    loadTemplates: function () {
        var id, self = this;
        var templates = $("script[type='text/template']");
        templates.each(function () {
            id = '#' + $(this).attr('id');
            self.addTemplate(id);
            if (self.opts.removeTemplates){
                self.removeTemplateFromDom($(this));
            }
        });
    },

    removeTemplateFromDom: function ($element) {
        $element.remove();
    }
});