Template.userGroupAdd.rendered = function () {
    jQuery(function ($) {

        //override dialog's title function to allow for HTML titles
        $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
            _title: function(title) {
                var $title = this.options.title || '&nbsp;';
                if( ("title_html" in this.options) && this.options.title_html == true )
                    title.html($title);
                else title.text($title);
            }
        }));

        $('[data-rel=tooltip]').tooltip({container: 'body'}); //Подсказки

        $('#add_userGroup_form').validate({ //Валидация формы
            errorElement: 'div',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",
            rules: {
                'add_userGroup_name': {
                    required: true
                }
            },

            messages: {
                'add_userGroup_name': {
                    required: 'Пожалуйста, укажите полное название компании',
                }
            },


            highlight: function (e) {
                $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
            },

            success: function (e) {
                $(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
                $(e).remove();
            },

            errorPlacement: function (error, element) {
                if (element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
                    var controls = element.closest('div[class*="col-"]');
                    if (controls.find(':checkbox,:radio').length > 1) controls.append(error);
                    else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
                }
                else if (element.is('.select2')) {
                    error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
                }
                else if (element.is('.chosen-select')) {
                    error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
                }
                else error.insertAfter(element.parent());
            },

            submitHandler: function (form) {
            },
            invalidHandler: function (form) {
            }
        });

        $('#add_userGroup_reset_confirm').on('click', function(e) {
            e.preventDefault();

            $('#add_userGroup_reset_confirm_dialog').removeClass('hide').dialog({
                resizable: false,
                width: '320',
                modal: true,
                title: "<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle red'></i> Сбросить введённые данные?</h4></div>",
                title_html: true,
                buttons: [
                    {
                        html: "<i class='ace-icon fa fa-undo bigger-110'></i>&#160; Cбросить данные",
                        'class' : 'btn btn-danger btn-minier',
                        click: function() {
                            document.getElementById('add_userGroup_form').reset();
                            $( this ).dialog('close');
                        }
                    }
                    ,
                    {
                        html: "<i class='ace-icon fa fa-times bigger-110'></i>&#160; Отмена",
                        'class' : 'btn btn-minier',
                        click: function() {
                            $( this ).dialog('close');
                        }
                    }
                ]
            });
        });


    });
};

Template.userGroupAdd.events({
    'click #add_userGroup_submit': function(e, tpl) {

        var form = $(tpl.find('#add_userGroup_form'));

        if(!form.valid()) {
            e.preventDefault();
            return false;
        }

        var paramObj = {};
        $.each(form.serializeArray(), function(_, kv) {
            paramObj[kv.name] = kv.value;
        });

        var data = {
            name: paramObj.add_userGroup_name
        };

        //Вызываем функцию добавления группы пользователя
        Meteor.call('userGroup.add', data, function(e, c) {
            Router.go('userGroupList');
        });
    }
});