Schema.event = new SimpleSchema({

    type: {
        type: String,
        label: 'Тип события'
    },

    user_id: {
        type: String,
        label: 'Уникальный идентификатор пользователя'
    },

    data:{
        type: Object,
        label: 'Данные',
        optional: true,
        blackbox: true
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
    }
});

createFileCollection('event');
Event = new Mongo.Collection('event');
Event.attachSchema(Schema.event);