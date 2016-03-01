Schema.notice = new SimpleSchema({

    type: {
        type: String,
        label: 'Тип уведомления'
    },

    user_id: {
        type: String,
        label: 'Уникальный идентификатор пользователя, кому предназначено уведомление'
    },

    data:{
        type: Object,
        label: 'Данные уведомления',
        optional: true,
        blackbox: true
    },

    dt: {
        type: Date,
        label: 'Дата уведомления',
        autoValue: function(){ if (this.isInsert && !this.value) return new Date; }
    },

    status: {
        type: Number,
        label: 'Статус уведомления',
        autoValue: function(){ if (this.isInsert && !this.value) return 0; }
    }
});

Notice = new Mongo.Collection('notice');
Notice.attachSchema(Schema.notice);