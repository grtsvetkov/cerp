Meteor.startup(function() {

    Meteor.publish('usersPublic', function () {
        return Meteor.users.find({},{fields: {_id:1, profile:1}});
    }); //Клиенты

    Meteor.publish('clientList', function () {
        return Client.find({});
    }); //Клиенты

    Meteor.publish('client', function (_id) {
        return Client.find(_id);
    }); //Клиент

    Meteor.publish('clientEvent', function (_id) {
        return Event.find({'data.client_id':_id});
    }); //События клиента
});