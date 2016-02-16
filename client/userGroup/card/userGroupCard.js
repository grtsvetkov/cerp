/**
 * Рендер страницы
 */
Template.userGroupCard.rendered = function () {

    jQuery(function ($) {

        /**
         * Редактируемые поля
         */
        $.fn.editable.defaults.mode = 'inline';
        $.fn.editableform.loading = '';
        $.fn.editableform.buttons = '<button type="submit" class="btn btn-info editable-submit"><i class="ace-icon fa fa-check"></i></button>' +
            '<button type="button" class="btn editable-cancel"><i class="ace-icon fa fa-times"></i></button>';

        $('.editable').editable({
            success: function (response, newValue) {
                var _id = Router.current().params._id;
                var data = {};
                data[$(this).attr('data-name')] = newValue;
                Meteor.call('userGroup.update', _id, data);
            },
            validate: function (value) {

                if ($(this).attr('data-required') == 1 && $.trim(value) == '') {
                    return 'Это поле обязательно для заполнения';
                }
            }
        });
    });
};

Template.userGroupCard.helpers({
    'userGroup': function () { //Возвращаем данные по клиенту
        return UserGroup.findOne();
    }
});