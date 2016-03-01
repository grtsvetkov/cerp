Schema.reminder = new SimpleSchema({

    type: {
        type: String,
        label: 'Тип напоминания'
    },

    user_id: {
        type: String,
        label: 'Уникальный идентификатор пользователя, кому предназначено напоминание'
    },

    data:{
        type: Object,
        label: 'Данные напоминания',
        optional: true,
        blackbox: true
    },

    dt: {
        type: Date,
        label: 'Дата напоминания',
        autoValue: function(){ if (this.isInsert && !this.value) return new Date; }
    },

    status: {
        type: Number,
        label: 'Статус напоминания',
        autoValue: function(){ if (this.isInsert && !this.value) return 0; }
    }
});

Reminder = new Mongo.Collection('reminder');
Reminder.attachSchema(Schema.reminder);