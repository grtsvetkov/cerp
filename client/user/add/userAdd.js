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

        $('textarea[class*=autosize]').autosize({append: "\n"}); //Авторазмер текстового поля

        $.mask.definitions['~'] = '[+-]'; //Настрока маски ввода
        $('.input-mask-phone').mask('+7 (999) 999-99-99'); //Маска ввода телефона

        $(".knob").knob(); //Элемент "Лояльность клиента"

        jQuery.validator.addMethod('add_user_url', function (val, elem) { //Валидация введенного адреса сайта
            if (val.length == 0) {
                return true;
            }

            if (!/^(https?|ftp):\/\//i.test(val)) {
                val = 'http://' + val;
                $(elem).val(val);
            }
            return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(val);
        });

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
                    required: false,
                    email: true
                },
                'add_user_url': {
                    required: false,
                    'add_user_url': true
                }
            },

            messages: {
                'add_user_name': {
                    required: 'Пожалуйста, укажите полное название компании',
                },

                'add_user_url': {
                    'add_user_url': 'Пожалуйста, введите корректный url сайта'
                },

                'add_user_email': {
                    email: 'Пожалуйста, введите корректный электронный адрес (e-mail)'
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

Template.userAdd.events({
    'click #add_user_submit': function(e, tpl) {

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
            name: paramObj.add_user_name,
            phone: paramObj.add_user_phone,
            email: paramObj.add_user_email,
            url: paramObj.add_user_url,
            loyalty: paramObj.add_user_loyalty,
            description: paramObj.add_user_description
        };

        //Вызываем функцию добавления клиента
        Meteor.call('user.add', data, function(e, c) {
            console.log(e);
            console.log(c);
            Router.go('userCard', {_id: c});
            //Router.go('/chat/'+c.chat_id+'/'); //редиректим его на страницу с активным чатом
        });
    }
});