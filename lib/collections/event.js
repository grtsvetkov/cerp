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
        autoValue: function(){ return new Date; }
    }
});

Event = new Mongo.Collection('event');
Event.attachSchema(Schema.event);