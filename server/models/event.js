EventModel = {

    /**
     * clientAdd - добавление клиента
     * clientComment - добавление комментария к клиенту
     * clientEdit - изменение информации о клиенте
     * clientEvent - событиие для колиента
     */

    /**
     * Добавление события
     * @param data данные события
     * @returns {*}
     */
    add: function (data) {

        data.user_id = Meteor.userId();

        return Event.insert(data);
    }

};

/**
 * Методы Event
 */
Meteor.methods({
    'event.add': EventModel.add
});