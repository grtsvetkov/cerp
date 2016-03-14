
Template.widgetReminder.helpers({
    'widgetReminderItems': function () {
        return Reminder.find({user_id: Meteor.userId(), status:0}).fetch();
    }
});

/**
 * Динамическая подгрузка шаблона в зависимости от типа апоминания
 */
Template.widgetReminderItem.helpers({
    'widgetReminderDynamicTemplate': function () {
        return 'widgetReminder_' + this.type;
    }
});