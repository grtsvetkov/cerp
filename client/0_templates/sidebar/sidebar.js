Template.sidebar.helpers({

    'menuItem': function() {

        return [
            {name: 'index', text: 'Главная', icon: 'fa-tachometer'},
            {name: 'taskList', text: 'Задачи', icon: 'fa-tasks'},
            {name: 'clientList', text: 'Холодные клиенты', icon: 'fa-list'},
            {name: 'clientAdd', text: 'Добавить клиента', icon: 'fa-file-o'}
        ]
    }
});