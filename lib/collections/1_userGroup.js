Schema.userGroup = new SimpleSchema({

    name: {
        type: String,
        label: 'Название группы'
    }
});

UserGroup = new Mongo.Collection('userGroup');
UserGroup.attachSchema(Schema.userGroup);
