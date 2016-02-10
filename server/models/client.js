ClientModel = {


    /**
     * Добавление клиента
     * @param data данные клиента
     * @returns {*}
     */
    add: function (data) {
        var _id = Client.insert(data);

        EventModel.add({
            type: 'clientAdd',
            data: {
                client_id: _id
            }
        });

        return _id;
    }

};

/**
 * Методы Client
 */
Meteor.methods({
    'client.add': ClientModel.add
});