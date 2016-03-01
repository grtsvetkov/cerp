ReminderModel = {

    /**
     * Добавление напоминания
     * @param data Данные напоминания
     * @returns {*}
     */
    add: function (data) {

        data.user_id = Meteor.userId();

        return Reminder.insert(data);
    },

    tick: function() {
        _.each(Reminder.find({'dt': {$lt: new Date}, status: 0}).fetch(), function(item){
            NoticeModel.add(item);
            ReminderModel.remove(item._id);
        });
    },

    remove: function(_id) {
        Reminder.remove(_id);
    }

};

Meteor.setInterval(ReminderModel.tick, 30000);

/**
 * Методы Reminder
 */
Meteor.methods({
    'reminder.add': ReminderModel.add
});