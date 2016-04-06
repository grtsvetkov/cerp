TaskModel = {

   /**
     * Добавление задачи
     * @param data данные задачи
     * @returns {*}
     */
    add: function (data) {

        data.user_id = Meteor.userId();

        return Task.insert(data);
    }

};

/**
 * Методы Task
 */
Meteor.methods({
    'task.add': TaskModel.add
});