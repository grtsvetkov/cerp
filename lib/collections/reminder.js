Schema.reminder = new SimpleSchema({

    type: {
        type: String,
        label: '��� �����������'
    },

    user_id: {
        type: String,
        label: '���������� ������������� ������������'
    },

    data:{
        type: Object,
        label: '������',
        optional: true,
        blackbox: true
    },

    dt: {
        type: Date,
        label: '���� �����������',
        autoValue: function(){ if (this.isInsert && !this.value) return new Date; }
    },

    status: {
        type: Number,
        label: '������ �����������',
        autoValue: function(){ if (this.isInsert && !this.value) return 0; }
    }
});

Reminder = new Mongo.Collection('reminder');
Reminder.attachSchema(Schema.reminder);