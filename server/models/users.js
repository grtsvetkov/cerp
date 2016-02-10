UserModel = {

    /**
     * Добавление пользователя
     * @param data данные пользователя
     * @returns {*}
     */
    add: function (data) {

        if (!data.email && data.emails !== undefined && data.emails.length > 0) {
            data.email = data.emails[0].address;
        }

        if (!data.email) {
            throw new Meteor.Error(404, 'Не указан Email');
        }

        if (data.services == undefined && !data.password) {
            data.password = '123';
        }

        if (!data.profile.name) {
            throw new Meteor.Error(404, 'Не указано Имя');
        }
        if (!data.profile.group) {
            throw new Meteor.Error(404, 'Ошибка при создании пользователя');
        }


        var result = {};
        var user_id = Accounts.createUser(data);

        return user_id;
    },

    /**
     * Обновление данных пользователя
     * @param _id уникальный идентификатор пользователя
     * @param data
     */
    update: function (_id, data) {
        Meteor.users.update(_id, {$set: data});
    }
};


/**
 * Методы Users
 */
Meteor.methods({
    'user.add': UserModel.add,
    'user.update': UserModel.update
});