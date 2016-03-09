
Template.widgetNotice.helpers({
    'widgetNoticeItems': function () {
        return Notice.find({user_id: Meteor.userId(), status:0}).fetch();
    }
});

/**
 * Динамическая подгрузка шаблона в зависимости от типа апоминания
 */
Template.widgetNoticeItem.helpers({
    'widgetNoticeDynamicTemplate': function () {
        return 'widgetNotice_' + this.type;
    }
});

Template.widgetNoticeItem.events({
    'click a.removeNotice': function(e, tpl){
        Meteor.call('notice.delete', tpl.data._id);
    }
});