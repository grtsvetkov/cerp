Meteor.startup(function() {


    /**
     * USERS
     */

    Meteor.publish('usersPublic', function () {
        return Meteor.users.find({},{fields: {_id:1, profile:1}});
    }); //Публичные данные пользователей

    Meteor.publish('usersAdmin', function () {
        return Meteor.users.find({});
    }); //Данные пользователей (для администратора)



    /**
     * USERGROUP
     */

    Meteor.publish('userGroupList', function () {
        return UserGroup.find({});
    }); //Группы пользователей

    Meteor.publish('userGroup', function (_id) {
        return UserGroup.find(_id);
    }); //Группа пользователей

    /**
     * CLIENT
     */

    Meteor.publish('clientList', function () {
        return Client.find({});
    }); //Клиенты

    /**
     * EVENT
     */

    Meteor.publish('clientEvent', function (_id) {
        return Event.find({'data.client_id':_id});
    }); //События клиента

    Meteor.publish('eventFile', function () {
        return FileCollections['event'].find();
    }); //Файлы в событиях
});