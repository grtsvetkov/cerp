if (Meteor.users.find().count() == 0) {

    var testUsers = [
        {email : 'cm@test.ru', name: 'Cold Manager', group: 'ColdManager'},
        {email : 'hm@test.ru', name: 'Hot Manager', group: 'HotManager'},
        {email : 'tm@test.ru', name: 'Top Manager', group: 'TopManager'},
        {email : 'admin@test.ru', name: 'Admin', group: 'Admin'}
    ];

    for(var i in testUsers) {
        var _id = UserModel.add({
            emails: [{
                address: testUsers[i].email,
                verified: true
            }],
            profile: {
                name: testUsers[i].name,
                group: testUsers[i].group
            }
        });

        Meteor.users.update(_id, {$set: {"emails.0.verified": true}});
    }
}