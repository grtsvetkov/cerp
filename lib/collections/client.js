client_type = ['Юридическое лицо', 'Физическое лицо'];
client_status = ['Новый', 'Аудит', 'Звонили', 'Запрошено КП', 'Отправлено КП', 'Получен ответ'];
//client_status = ['Новый', 'Аудит', 'Звонили', 'Запрошено КП', 'Отправлено КП', 'Получен ответ'];

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

    description: {
        type: String,
        label: 'Описание',
        optional: true
    },

    loyalty: {
        type: Number,
        label: 'Лояльность клиента',
        min: 0,
        max: 100
    },

    status: {
        type: String,
        label: 'Статус компании',
        allowedValues: client_status,
        optional: true
    }
});

Client = new Mongo.Collection('client');
Client.attachSchema(Schema.client);
