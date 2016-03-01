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


        var old_client = Client.findOne(_id);

        if(!old_client) {

        }

        if(data.status) {
            Client.update(_id, {$set: {status: data.status}})
        }

        var eventData = {
            type: 'clientEvent',
            dt: new Date,
            data: {
                client_id: _id,
                comment: data.comment,
                new_status: data.status,
                old_status: old_client.status

            }
        };

        if(data.file) {
            eventData.data.file = data.file;
        }

        return EventModel.add(eventData);
    },

    addReminder: function(_id, data) {

        var client = Client.findOne(_id);

        var reminderData = {
            type: 'clientReminder',
            dt: data.date,
            data: {
                client_name: client.name,
                client_id: _id,
                comment: data.comment
            }
        };

        return ReminderModel.add(reminderData);
    }
};

/**
 * Методы Client
 */
Meteor.methods({
    'client.add': ClientModel.add,
    'client.update': ClientModel.update,
    'client.addEvent': ClientModel.addEvent, //Добавить новое событие для клиента
    'client.addReminder': ClientModel.addReminder //Добавить новое напоминание для клиента
});