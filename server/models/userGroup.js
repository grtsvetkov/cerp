UserGroupModel = {

    /**
     * Добавление группы пользователей
     * @param data данные клиента
     * @returns {*}
     */
    add: function (data) {
        var _id = UserGroup.insert(data);

        EventModel.add({
            type: 'userGroupAdd',
            data: {
                userGroup_id: _id
            }
        });

        return _id;
    },

    /**
     * Обновить данные о группе пользователей
     * @param _id
     * @param data
     * @returns {*}
     */
    update: function(_id, data) {

        var old_userGroup = UserGroup.findOne(_id);

        if(!old_userGroup) {

        }

        if(UserGroup.update(_id, {$set: data})) {
            var eventData = {
                type: 'userGroupEdit',
                data: {
                    userGroup_id: _id,
                    row : []
                }
            };

            for(var i in data) {
                eventData.data.row.push({
                    name: Schema.userGroup._schema[i].label,
                    old: old_userGroup[i],
                    new: data[i]
                });
            }

            EventModel.add(eventData);
        }
    }
};

/**
 * Методы UserGroup
 */
Meteor.methods({
    'userGroup.add': UserGroupModel.add,
    'userGroup.update': UserGroupModel.update
});