Template.notice.helpers({
    'notices': function() {
        return Notice.find({'user_id': Meteor.userId(), status: 0});
    }
});


Template.noticeItem.rendered = function() {
    var data = this.data;

    var gritter = {};

    switch (data.type) {
        case 'clientReminder':

            var link = new Spacebars.SafeString('<a class="red" href="' + Router.routes['clientCard'].path({_id:data.data.client_id}) + '"> Перейти</a>');

            gritter = {
                _id: data._id,
                title: 'Напоминание о клиенте',
                text: 'Напоминаем вам о клиенте "'+data.data.client_name+'"'
                +'<br/>Комментарий:<br/>'+data.data.comment
                +'<br/>' + link,
                sticky: true,
                class_name: 'gritter-info',
                before_close: function(e, manual_close){
                    console.log(e);
                    console.log(this);
                }
            };
            break;
    }

    $.gritter.add(gritter);
};