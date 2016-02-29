Schema.user_profile = new SimpleSchema({

    group: {
        type: String,
        label: 'Группа пользователя'
    },

    name: {
        type: String,
        label: 'Имя',
        min: 2,
        max: 50
    },

    phone: {
        type: String,
        label: 'Телефон',
        optional: true
    },

    avatar: {
        type: Object,
        label: 'Аватар',
        blackbox: true,
        optional: true
    },

    lastLogin:{
        type: Date,
        label: 'Время последней авторизации',
        optional: true,
        autoValue: function(){ if (this.isInsert && !this.value){ return new Date; } }
    }
});

Schema.users = new SimpleSchema({

    username: {
        type: String,
        label: 'Логин',
        regEx: /^[a-z0-9A-Z_]{3,15}$/,
        optional: true
    },
    emails: {
        type: [Object],
        label: 'E-mail адреса'
    },
    "emails.$.address": {
        type: String,
        label:'E-mail',
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean,
        label:'проверенный'
    },
    createdAt: {
        label: 'Дата регистации',
        type: Date
    },
    profile: {
        type: Schema.user_profile,
        label: 'Профиль пользователя',
        optional: true
    },
    services: {
        type: Object,
        label: 'Аккаунты соц. сетей',
        optional: true,
        blackbox: true
    },
    status: {
        type: Object,
        label: 'status',
        optional: true,
        blackbox: true
    }
});

Meteor.users.attachSchema(Schema.users);