if (Meteor.isServer) {
    Meteor.startup(function () {


        /**
         * STMP (настройка для почты)
         * @type {{username: string, password: string, server: string, port: number}}
         */
        smtp = {
            username: 'seoland.ru@gmail.com',
            password: 'Ffhbyrf1!',
            server:   'smtp.gmail.com',
            port: 465
        };

        process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;


        /**
         * Проверяем, есть ли пустые коллекции.
         * Если необходимо - заполняем их начальными данными
         */

        if (Client.find().count() == 0) {
            var data_client = JSON.parse(Assets.getText('client.json'));
            for (i in data_client) {
                Client.insert(data_client[i]);
            }
            delete data_client;
        }

        if (UserGroup.find().count() == 0) {
            var data_userGroup = JSON.parse(Assets.getText('userGroup.json'));
            for (i in data_userGroup) {
                UserGroup.insert({name: data_userGroup[i].name});
            }
            delete data_userGroup;
        }

        if (Meteor.users.find().count() == 0) {

            var group_id = UserGroup.findOne({name: 'Admin'})._id;

            var _id = UserModel.add({
                emails: [{
                    address: 'admin@test.ru',
                    verified: true
                }],
                profile: {
                    name: 'Admin',
                    group: group_id
                }
            });

            Meteor.users.update(_id, {$set: {"emails.0.verified": true}});

            delete group_id;
            delete _id;
        }

    })
}