Template.userAdd.rendered = function () {
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

        $.mask.definitions['~'] = '[+-]'; //Настрока маски ввода
        $('.input-mask-phone').mask('+7 (999) 999-99-99'); //Маска ввода телефона

        $(".knob").knob(); //Элемент "Лояльность клиента"

        $('#add_user_form').validate({ //Валидация формы
            errorElement: 'div',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",
            rules: {
                'add_user_name': {
                    required: true
                },
                'add_user_email': {
                    required: true,
                    email: true
                },
                'add_user_password': {
                    required: true
                }
            },

            messages: {
                'add_user_name': {
                    required: 'Пожалуйста, укажите имя пользователя'
                },

                'add_user_email': {
                    required: 'Пожалуйста, укажите полное название компании',
                    email: 'Пожалуйста, введите корректный электронный адрес (e-mail)'
                },

                'add_user_password': {
                    required: 'Пожалуйста, укажите пароль для входа в систему'
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

        $('#add_user_reset_confirm').on('click', function(e) {
            e.preventDefault();

            $('#add_user_reset_confirm_dialog').removeClass('hide').dialog({
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
                            document.getElementById('add_user_form').reset();
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

Template.userAdd.helpers({
    'userGroup': function(){
        return UserGroup.find();
    }
});

Template.userAdd.events({
    'click #add_user_submit': function(e, tpl) { //Кнопка "Создать карточку клиента"

        var form = $(tpl.find('#add_user_form'));

        if(!form.valid()) {
            e.preventDefault();
            return false;
        }

        var paramObj = {};
        $.each(form.serializeArray(), function(_, kv) {
            paramObj[kv.name] = kv.value;
        });

        var data = {
            email: paramObj.add_user_email,
            password: paramObj.add_user_password,
            profile: {
                name: paramObj.add_user_name,
                phone: paramObj.add_user_phone,
                group: paramObj.add_user_group
            }
        };

        console.log(data);

        //Вызываем функцию добавления клиента
        Meteor.call('user.add', data, function(e, c) {
            Router.go('userCard', {_id: c});
        });
    }
});