Schema.task = new SimpleSchema({


    user_id: {
        type: String,
        label: 'Уникальный идентификатор пользователя'
    },

    client_id:{
        type: String,
        label: 'Уникальный идентификатор клиента'
    },

    text: {
        type: String,
        label: 'Текст задачи'
    },

    time: {
        type: String,
        label: 'Количество затраченного времени на задачу'
    },

    dt: {
        type: Date,
        label: 'Дата события',
        autoValue: function(){ if (this.isInsert && !this.value) return new Date; }
    },

    file: {
        type: Object,
        label: 'Файл',
        blackbox: true,
        optional: true
    },

    status: {
        type: Boolean,
        label: "Статус задачи",
        autoValue: function(){ if (this.isInsert && !this.value) return false; }
    }
});

createFileCollection('task');
Task = new Mongo.Collection('task');
Task.attachSchema(Schema.task);