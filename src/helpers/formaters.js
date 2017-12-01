/**
 * Created by Tom on 29.06.2017.
 */


eco.Formaters.GroupFormater = function (model) {
    var result = {
        cid: model.cid,
        id: model.get('id'),
        subject: model.escape('subject'),
        dayKey: model.escape('day'),
        day: model.dayFormat(),
        weeks: eco.Utils.getWeeks(model.get('weeks')),
        block: model.escape('block'),
        teacher: {name: model.escape('name'), mail: model.escape('mail')},
        created: moment(model.get('created')).format('LLL')
    };
    return result;
};

eco.Formaters.StudentGroupFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        subject: model.escape('subject'),
        block: model.escape('block'),
        entered: moment(model.get('entered')).format('LLL'),
        dayKey: model.escape('day'),
        day: model.dayFormat(),
        weeks: eco.Utils.getWeeks(model.get('weeks')),
        teacher: {name: model.escape('name'), mail: model.escape('mail')},
    });
    return result;
};

eco.Formaters.TasksFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        // id: model.get('id'),
        name: model.escape('name'),
        description: model.get('description'),
        // etalon_file: model.escape('etalon_file'),
        // test_file: model.escape('test_file'),
        entity: model.get('entity'),
        valid: eco.Utils.getTaskValid(model.get('valid')),
        validOriginal: model.get('valid'),
        created: moment(model.get('created')).format('LLL')
    });
    return result;
};

eco.Formaters.HwTeacherFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        status: eco.Utils.getTaskStatus(model.escape('status')),
        created: moment(model.get('created')).format('LLL'),
        deadline: moment(model.get('deadline')).format('LLL'),
        valid: model.get('valid'),
        validFormated: eco.Utils.getTaskValid(model.get('valid')),
    });
    return result;
};

eco.Formaters.HomeworkFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        id: model.id,
        type: eco.Utils.fileTypes[model.get('type')],
        // name: model.get('name'),
        // file: model.get('file'),
        // id: model.get('id'),
        subject: model.escape('subject'),
        status: eco.Utils.getTaskStatus(model.get('status')),
        created: moment(model.get('created')).format('LLL'),
        deadline: moment(model.get('deadline')).format('LLL'),
        dayKey: model.escape('day'),
        day: eco.Utils.getDay(model.get('day')),
        weeks: eco.Utils.getWeeks(model.get('weeks')),
        block: model.escape('block'),
        valid: model.get('valid'),
        validFormated: eco.Utils.getTaskValid(model.get('valid')),
    });
    return result;
};

eco.Formaters.FileFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        type: eco.Utils.fileTypes[model.get('type')],
        typeOriginal: model.get('type'),
        filename: model.getFilename(),
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
        test_message: model.get('test_message')?model.get('test_message'):"",
        test_result_str: eco.Utils.getSolutionResults(model.get('test_result')),
    });
    return result;
};

eco.Formaters.GroupDetailFormater = function (model) {
    var result = _.extend({},model.toJSON(),{
        cid: model.cid,
        created: moment(model.get('created')).format('LLL'),
        dayKey: model.escape('day'),
        day: eco.Utils.getDay(model.get('day')),
        weeks: eco.Utils.getWeeks(model.get('weeks')),
        block: model.escape('block')
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