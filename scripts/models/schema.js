var app = app || {};

app.Schema = Backbone.Model.extend({
    urlRoot: '/api/schemas',
    defaults: {
        id: null,
        user_id: null,
        name: '',
        architecture: '',
        description: '',
        opened: false,
        // created: null,
        // colletion: null, //kolekce VHDL dat
        graph: new joint.dia.Graph(),
        paper: null,
        container: null,
    },
    parse: function (data) {
        return data; // in this case your model will be mixed with server response after sync was call
    },
    initialize: function (opts) {
        // console.log("schema url", this.url());
        // this.colletion = new app.VHDLs();
        // this.colletion.url = this.entitiesUrl();
        // // this.colletion.fetch();
        // console.log(this.colletion);
        // console.log(this);

        //this.loadGraph();
    },
    validateParams: function () {
        console.log("validateParams");
        return this.get('name').length > 0 && this.get('architecture').length > 0 && isVhdlName(this.get('name')) && isVhdlName(this.get('architecture'));
    },
    createPaper: function () {

        var self = this;
        var options = {
            container: $("#canvasWrapper"),
            canvas: {
                w: 2400,
                h: 1200,
                gs: 7
            }
        };

        console.log("%ccreatePaper", "color:red");
        var paperContainer = $('<div data-schema="' + this.get('name') + '"></div>');
        options.container.append(paperContainer);

        paperContainer.width(options.canvas.w);
        paperContainer.height(options.canvas.h);

        var paper = new joint.dia.Paper({

            el: paperContainer,
            model: this.get("graph"),
            width: options.canvas.w, height: options.canvas.h, gridSize: options.canvas.gs,
            snapLinks: true,
            linkPinning: false,
            defaultLink: new joint.shapes.mylib.Vodic,
            drawGrid: {
                color: '#333',
                thickness: 1
            },

            validateConnection: function (vs, ms, vt, mt, e, vl) {

                if (e === 'target') {
                    // target requires an input port to connect
                    if (!mt || !mt.getAttribute('class') || mt.getAttribute('class').indexOf('input') < 0) return false;

                    // check whether the port is being already used
                    var portUsed = _.find(this.model.getLinks(), function (link) {

                        return (link.id !== vl.model.id &&
                        link.get('target').id === vt.model.id &&
                        link.get('target').port === mt.getAttribute('port'));
                    });

                    return !portUsed;

                } else { // e === 'source'
                    // source requires an output port to connect
                    return ms && ms.getAttribute('class') && ms.getAttribute('class').indexOf('output') >= 0;
                }
            }
        });

        paper.on('cell:pointerclick', createCellDoubleclickHandler(function (cellView, evt, x, y) {
            console.log("dbclick");
            if (cellView.model instanceof joint.shapes.mylib.HradloIO) {
                cellView.model.switchSignal();
                broadcastSignal(cellView.model, cellView.model.signal, self);
                V(cellView.el).toggleClass('live', cellView.model.signal > 0);
            }
        }));
        paper.on('cell:pointerclick', function (cellView) {

            console.log("click");
            /**
             * Po kliknutí na hodiny je vypnout/zaponout
             */
            if (cellView.model instanceof joint.shapes.mylib.CLK) {
                console.log(cellView.model.tickOn);
                cellView.model.tickOn = !cellView.model.tickOn;
                V(cellView.el).toggleClass('running', cellView.model.tickOn);
            }
            // console.log(cellView.model.get('attrs'));
            // console.log(cellView.model.attr('.label/text'));
        });

        this.set("paper", paper);
        this.paper = paper;
    },

    initializeGraph: function () {
        var self = this;
        var graph = this.get("graph");

        console.log("_________________________","initializeGraph", graph);
        /**
         * Reinitialyze signals when wire was connected or disconnected.
         */
        graph.on('change:source change:target', function (model, end) {
            var e = 'target' in model.changed ? 'target' : 'source';
            if ((model.previous(e).id && !model.get(e).id) || (!model.previous(e).id && model.get(e).id)) {
                self.initializeSignal();
            }
        });

        graph.on('change:signal', function (wire, signal) {

            console.log("change:signal'");

            toggleLive(wire, signal, self);

            var magnitude = Math.abs(signal);

            // if a new signal has been generated stop transmitting the old one
//                if (magnitude !== current) return;

            var gate = graph.getCell(wire.get('target').id);

            if (gate) {

                if (gate instanceof joint.shapes.mylib.Hradlo) {
                    gate.onSignal(signal, function () {

                        // get an array of signals on all input ports
                        var inputs = _.chain(graph.getConnectedLinks(gate, {inbound: true}))
                            .groupBy(function (wire) {
                                return wire.get('target').port;
                            })
                            .map(function (wires) {
                                return Math.max.apply(this, _.invoke(wires, 'get', 'signal')) > 0;
                            })
                            .value();

                        var output = magnitude * (gate.operation.apply(gate, inputs) ? 1 : -1);
                        broadcastSignal(gate, output, self);
                    });
                }
            }
        });
        self.initializeSignal();
    },

    initializeSignal: function () {
        console.log("%cinitializeSignal", "color: #F58220", this);
        var graph = this.get("graph");
        var signal = Math.random();
        var self = this;
        // > 0 vodič s log. 1
        // < 0 vodič s log. 0

        // 0 none of the above - reset value

        // vynulování všech signálů
        _.invoke(graph.getLinks(), 'set', 'signal', 0);

        // odebrání všech aktivních tříd
        $('.live').each(function () {
            V(this).removeClass('live');
        });

        _.each(graph.getElements(), function (element) {
            // rozeslání signálů ze vstupů
            (element instanceof joint.shapes.mylib.INPUT) && broadcastSignal(element, element.signal, self);
            (element instanceof joint.shapes.mylib.VCC) && broadcastSignal(element, element.signal, self);
            (element instanceof joint.shapes.mylib.GND) && broadcastSignal(element, element.signal, self);
            (element instanceof joint.shapes.mylib.CLK) && startClock(element, element.signal, self);
        });

        return signal;
    },

    /**
     * Odebrání paperu
     */
    destroyPaper: function () {
        var paper = this.get('paper');
        if (paper) {
            paper.remove();
            this.set('paper', null);
        }
    },

    /**
     * Uložení aktuálního stavu grafu jako JSON do DB
     * Tabulka VHDL ale data jsou serializovany JSON
     */
    saveGraph: function () {
        console.log("saveGraph");
        var self = this;
        var graphstring = this.getGraphAsString();

        if (this.lastVHDL == null) {
            this.lastVHDL = new app.VHDL({
                schema_id: self.id,
                data: graphstring,
            });
        }

        this.lastVHDL.set("data",graphstring);
        this.lastVHDL.data = graphstring;
        this.lastVHDL.url = '/api/schemas/' + this.id + '/vhdls';

        console.log(this.lastVHDL.data, this.lastVHDL.url);
        this.lastVHDL.save();
    },

    /**
     * Uloží aktuální stav jako novou verzi = nepřepisuje původní data, ale vytvoří nový záznam v DB
     */
    saveGraphNewVersion: function () {
        var graphstring = this.getGraphAsString();

        this.lastVHDL = new app.VHDL({});

        this.lastVHDL.data = graphstring;
        this.lastVHDL.schema_id = this.id;
    },

    /**
     * Vrátí data grafu v JSON formátu jako string
     */
    getGraphAsString: function () {
        return JSON.stringify(this.get('graph').toJSON());
    },

    /**
     * Načte data Grafu z DB
     */
    loadGraph: function (callback) {
        console.log("loadGraph");
        // pokud data grafu nebyla načtena, tak vytvoří nový graf
        if (this.lastVHDL == null) {
            this.lastVHDL = new app.VHDL();
        }
        var vhdl = this.lastVHDL;
        var self = this;

        if (this.id) {
            // vhdl.set('url', '/api/schemas/' + this.id + '/vhdls/last');
            vhdl.url = '/api/schemas/' + this.id + '/vhdls/last';

            vhdl.fetch({
                success: function () {
                    var data = vhdl.get('data');
                    console.log('loadGraph fetch success');
                    console.log('data', data);
                    if (data.length>0){
                        self.get('graph').fromJSON(JSON.parse(data));
                    }
                    callback.apply(self);
                },
                error: function () {
                    console.log('loadGraph fetch error');
                }
            });
        } else {
            console.log("no ID");
        }
    },

    openSchema: function () {
        console.log("openSchema");
        this.loadGraph(this.initLoadedGraf);
        this.createPaper();
        this.initializeGraph();

        this.opened = true;
    },
    initLoadedGraf: function () {
        console.log("initLoadedGraf", this);
        this.initializeSignal();
    },
    closeSchema: function () {
        this.destroyPaper();
        // this.initializeSignal();
        this.opened = false;
    }
});

app.SchemaView = Backbone.View.extend({
    className: "schema_list__item",
    tagName: 'div',
    initialize: function () {

        this.template = _.template($('.template-schema-list').html());
        // this.listenTo(this.model.collection, 'sync', this.render);
    },
    events: {
        // 'click .schema_list__item': 'onSchemaClick'
    },
    render: function () {
        // console.log("rendering Schema", this.model, this.model.collection);
        var self = this;
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.attr('data-id', this.model.get('schema').id);
        if (this.model.get('active')) {
            this.$el.addClass('active');
        }
        console.log(this.model.toJSON());
        return this;
    }
});

app.Schemas = Backbone.Collection.extend({
    url: '/api/schemas',
    model: app.Schema
});

app.SchemaMenuItem = Backbone.Model.extend({
    defaults: {
        schema: null,
        active: false
    }
});

app.SchemasView = Backbone.View.extend({
    el: "#schema_list_container",
    activeSchema: null,
    initialize: function (opts) {
        console.log("schemas init");
        var self = this;
        this.collection.fetch({
            success: function () {
                console.log("DONE!!!!!!!");
            }
        });
        this.listenTo(this.collection, 'sync change', this.render);
        // this.collection = opts.collection;

    },
    events: {
        'click .schema_list__item__edit': 'editSchemaHandler',
        'click .schema_list__item': 'openSchemaHandler'
    },
    render: function () {
        console.log("%crender Schemas " + this.category, "color: #2C4");
        var self = this;
        this.$el.html("");
        this.collection.each(function (schema) {
            var m = new app.SchemaMenuItem({'schema': schema.toJSON()});
            if (self.activeSchema && _.isEqual(schema, self.activeSchema)) {
                m.set('active', true);
            }
            var schemaView = new app.SchemaView({model: m});
            self.$el.append(schemaView.render().$el);
        });
        return this;
    },
    editSchemaHandler: function (event) {
        console.log("editSchemaHandler");
        var model = this.collection.get($(event.currentTarget).parent().data('id'));
        this.trigger('editSchema', model);
    },
    openSchemaHandler: function (event) {
        console.log("openSchemaHandler",$(event.currentTarget));
        var model = this.collection.get($(event.currentTarget).data('id'));
        this.trigger('openSchema', model);
    },
    setActiveSchema: function (schema) {
        console.log('setActiveSchema', this, schema, "id:", schema.get('id'));
        this.$el.find(".schema_list__item").removeClass('active').find('[data-id=' + schema.get('id') + ']').removeClass('active');
        this.activeSchema = schema;
    }
});


app.VHDL = Backbone.Model.extend({
    // urlRoot: '/api/vhdls',
    defaults: {
        id: null,
        data: null,
        created: null,
        schema_id: null
    }
});

app.VHDLs = Backbone.Collection.extend({
    model: app.VHDL,
    initialize: function (opts) {
        // this.url = opts.url;
    }
});