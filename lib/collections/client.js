client_type = ['Юридическое лицо', 'Физическое лицо'];

Schema.client = new SimpleSchema({

    type: {
        type: String,
        label: 'Тип клиента',
        allowedValues: client_type
    },

    name: {
        type: String,
        label: 'Название компании'
    },

    phone: {
        type: String,
        label: 'Телефон',
        optional: true
    },

    email:{
        type: String,
        label: 'E-mail',
        optional: true
    },

    url: {
        type: String,
        label: 'URL',
        optional: true
    },

    loyalty: {
        type: Number,
        label: 'Лояльность клиента',
        min: 0,
        max: 100
    }
});

Client = new Mongo.Collection('client');
Client.attachSchema(Schema.client);
