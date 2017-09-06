/**
 * Created by Tom on 29.06.2017.
 */


eco.Formaters.GroupFormater = function (model) {
    var result = {
        cid: model.cid,
        id: model.get('id'),
        subject: model.get('subject'),
        dayKey: model.get('day'),
        day: model.dayFormat(),
        weeks: eco.Utils.getWeeks(model.get('weeks')),
        block: model.get('block'),
        teacher: {name: model.get('name'), mail: model.get('mail')},
        created: moment(model.get('created')).format('LLL')
    };
    return result;
};

eco.Formaters.StudentGroupFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        entered: moment(model.get('entered')).format('LLL'),
        dayKey: model.get('day'),
        day: model.dayFormat(),
        weeks: eco.Utils.getWeeks(model.get('weeks')),
        teacher: {name: model.get('name'), mail: model.get('mail')},
    });
    return result;
};

eco.Formaters.TasksFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        // id: model.get('id'),
        // name: model.get('name'),
        // description: model.get('description'),
        // etalon_file: model.get('etalon_file'),
        // test_file: model.get('test_file'),
        created: moment(model.get('created')).format('LLL')
    });
    return result;
};

eco.Formaters.HwTeacherFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        status: model.get('status'),
        created: moment(model.get('created')).format('LLL'),
        deadline: moment(model.get('deadline')).format('LLL'),
    });
    return result;
};

eco.Formaters.HomeworkFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        type: eco.Utils.fileTypes[model.get('type')],
        // name: model.get('name'),
        // file: model.get('file'),
        status: model.getStatus(),
        created: moment(model.get('created')).format('LLL'),
        deadline: moment(model.get('deadline')).format('LLL'),
        dayKey: model.get('day'),
        day: eco.Utils.getDay(model.get('day')),
        weeks: eco.Utils.getWeeks(model.get('weeks')),
        block: model.get('block')
    });
    return result;
};

eco.Formaters.FileFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        type: eco.Utils.fileTypes[model.get('type')],
        // name: model.get('name'),
        // file: model.get('file'),
    });
    return result;
};

eco.Formaters.SchemaSimpleFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        created: moment(model.get('created')).format('LLL'),
    });
    return result;
};

eco.Formaters.SolutionsFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        created: moment(model.get('created')).format('LLL'),
        statusTechnical: model.get('status'),
        status: eco.Utils.getSolutionStatus(model.get('status')),
    });
    return result;
};

eco.Formaters.GroupDetailFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        created: moment(model.get('created')).format('LLL'),
        dayKey: model.get('day'),
        day: eco.Utils.getDay(model.get('day')),
        weeks: eco.Utils.getWeeks(model.get('weeks')),
        block: model.get('block')
    });
    return result;
};

eco.Formaters.StudentFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
    });
    return result;
};

eco.Formaters.GenericFormater = function (x) {
    var result = _.extend({}, x.attributes, {cid: x.cid});
    console.log("_.......................................", x, result);
    return result  ;
};