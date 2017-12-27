/**
 * Created by Tom on 30.06.2017.
 */


eco.Validators.NoValidator = function (model) {
    return true;
};

eco.Validators.SchemaValidator = function (model) {
    return (isVhdlName(model.get('name')) && isVhdlName(model.get('architecture')))
};