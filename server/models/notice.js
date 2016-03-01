NoticeModel = {

    /**
     * Добавление уведомления
     * @param data данные уведосилмения
     * @returns {*}
     */
    add: function (data) {

        if(!data.user_id) {
            if(Meteor.userId()) {
                data.user_id = Meteor.userId();
            } else {
                throw new Meteor.Error(500, 'Не указан user_id при создании уведомления');
            }
        }

        return Notice.insert(data);
    }

};

/**
 * Методы Notice
 */
Meteor.methods({
    'notice.add': NoticeModel.add
});