ReminderModel = {

    /**
     * Добавление напоминания
     * @param data данные напоминания
     * @returns {*}
     */
    add: function (data) {

        data.user_id = Meteor.userId();

        return Reminder.insert(data);
    },

    tick: function() {
        _.each(Reminder.find({'dt': {$lt: new Date}, status: 0}).fetch(), function(item){
            Reminder.update(item._id, {status: 1});
        });
    }

};

Meteor.setInterval(ReminderModel.tick, 30000);

/**
 * Методы Event
 */
Meteor.methods({
    'reminder.add': ReminderModel.add
});