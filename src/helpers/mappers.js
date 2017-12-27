

eco.Mappers.SolutionHomeworkMapper = function ($element) {
    return {
        'name': $element.find('#task_name').val(),
        'description': $element.find('#task_description').val(),
    }
};

eco.Mappers.schemaEditMapper = function ($element) {
    return {
        'name': $element.find('#schemasNew_name').val(),
    }
};