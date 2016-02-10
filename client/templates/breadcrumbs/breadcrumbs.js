var breadCrumbsList = {
    'clientAdd' : [
        {name: 'clientList', text: 'Список клиентов'}
    ]
};

Template.breadcrumbs.helpers({
    'bcPath': function(name, menuName) {

        result = (breadCrumbsList[name]) ? _.clone(breadCrumbsList[name]) : [];

        result.push({text: menuName});
        return result;
    }
});