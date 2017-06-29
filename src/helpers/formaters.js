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
    var result = {
        cid: model.cid,
        id: model.get('id'),
        student_id: model.get('student_id'),
        entered: moment(model.get('entered')).format('LLL'),
        approved: model.get('approved'),
        subject: model.get('subject'),
        dayKey: model.get('day'),
        day: model.dayFormat(),
        weeks: eco.Utils.getWeeks(model.get('weeks')),
        block: model.get('block'),
        teacher: {name: model.get('name'), mail: model.get('mail')},
    };
    return result;
};

eco.Formaters.TaksFormater = function (model) {
    var result = {
        cid: model.cid,
        id: model.get('id'),
        name: model.get('name'),
        description: model.get('description'),
        etalon_file: model.get('etalon_file'),
        test_file: model.get('test_file'),
        created: moment(model.get('created')).format('LLL')
    };
    return result;
};

eco.Formaters.HomeworkFormater = function (model) {
    var result = {
        cid: model.cid,
        id: model.get('id'),
        student_id: model.get('student_id'),
        teacher_id: model.get('teacher_id'),
        status: model.getStatus(),
        name: model.get('name'),
        description: model.get('description'),
        created: moment(model.get('created')).format('LLL'),
        deadline: moment(model.get('deadline')).format('LLL'),
    };
    return result;
};


eco.Formaters.GenericFormater = function (x) {
    return x.toJSON();
};