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
    },

    /**
     * Обновить данные клиента
     * @param _id
     * @param data
     * @returns {*}
     */
    update: function(_id, data) {



        var old_client = Client.findOne(_id);

        if(!old_client) {

        }

        if(Client.update(_id, {$set: data})) {
            var eventData = {
                type: 'clientEdit',
                data: {
                    client_id: _id,
                    row : []
                }
            };

            for(var i in data) {
                eventData.data.row.push({
                    name: Schema.client._schema[i].label,
                    old: old_client[i],
                    new: data[i]
                });
            }

            EventModel.add(eventData);
        }
    },

    addEvent: function(_id, data) {


        console.log(data);

        var old_client = Client.findOne(_id);

        if(!old_client) {

        }

        if(data.status) {
            Client.update(_id, {$set: {status: data.status}})
        }

        var eventData = {
            type: 'clientEvent',
            dt: data.date,
            data: {
                client_id: _id,
                comment: data.comment,
                new_status: data.status,
                old_status: old_client.status

            }
        };

        EventModel.add(eventData);
    }
};

/**
 * Методы Client
 */
Meteor.methods({
    'client.add': ClientModel.add,
    'client.update': ClientModel.update,
    'client.addEvent': ClientModel.addEvent
});