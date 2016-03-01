/**
 * Используемые переменные для наговаривания по микрофону
 */
var speechButton, speechRec = false, speechFinal = '', speechInput, recognition;

/**
 * Рендер страницы
 */
Template.clientCard.rendered = function () {

    jQuery(function ($) {

        speechButton = $('#speechButton');
        speechInput = $('#clientCardEventAddMessage');

        if (!('webkitSpeechRecognition' in window)) { // проверяем поддержку speach api
            speechButton.hide();
        } else {

            /* создаем объект 	*/
            recognition = new webkitSpeechRecognition();

            /* базовые настройки объекта */
            recognition.lang = 'ru'; // язык, который будет распозноваться. Значение - lang code
            recognition.continuous = true; // не хотим чтобы когда пользователь прикратил говорить, распознование закончилось
            recognition.interimResults = false;  // не хотим видеть промежуточные результаты. Т.е. мы можем некоторое время видеть слова, которые еще не были откорректированы

            /* метод вызывается когда начинается распознование */
            recognition.onstart = function () {
                speechRec = true;
                speechButton.removeClass('fa-microphone-slash').addClass('fa-microphone'); // меняем вид кнопки
            };

            /* обработчик ошибок */
            recognition.onerror = function (event) {
                if (event.error == 'no-speech') {
                    speechButton.removeClass('fa-microphone').addClass('fa-microphone-slash');
                }
                if (event.error == 'audio-capture') {
                    speechButton.removeClass('fa-microphone').addClass('fa-microphone-slash');
                }
            };

            /* метод вызывается когда распознование закончено */
            recognition.onend = function () {
                speechRec = false;
                speechButton.removeClass('fa-microphone').addClass('fa-microphone-slash');
            };

            /* 
             метод вызывается после каждой сказанной фразы. Параметра event используем атрибуты:
             - resultIndex - нижний индекс в результирующем массиве
             - results - массив всех результатов в текущей сессии
             */
            recognition.onresult = function (event) {

                var interim_transcript = '';

                //обход результирующего массива
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    /* если фраза финальная (уже откорректированная) сохраняем в конечный результат */
                    if (event.results[i].isFinal) {
                        speechFinal += event.results[i][0].transcript;
                        //} else { /* иначе сохраянем в промежуточный */
                        //    interim_transcript += event.results[i][0].transcript;
                    }
                }

                speechInput.val(speechFinal);
            };

        }

        /* обработчик клика по микрофону */
        speechButton.click(function (event) {

            if (speechRec) { // если запись уже идет, тогда останавливаем
                recognition.stop();
                return;
            }

            recognition.start();

        });

        /**
         * Добавить файл к событию
         */
        $('#clientCardAddEventFile').ace_file_input({
            no_file:'Не выбран файл ...',
            btn_choose:'Выбрать',
            btn_change:'Изменить',
            droppable:false,
            onchange:null,
            thumbnail:false //| true | large
            //whitelist:'gif|png|jpg|jpeg'
            //blacklist:'exe|php'
            //onchange:''
            //
        });

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
                Meteor.call('client.update', _id, data);
            },
            validate: function (value) {

                if ($(this).attr('data-required') == 1 && $.trim(value) == '') {
                    return 'Это поле обязательно для заполнения';
                }
            }
        });

        /**
         * Маска ввода для телефона
         */
        $(document).on('focus', '.clientCardInputClass_phone', function () {
            $(this).mask('+7 (999) 999-99-99');
        });

        /**
         * Календарик в блоке добавления события
         */
        $('.date-picker').datepicker({
            dateFormat: 'dd.mm.yy',
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель',
                'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь',
                'Октябрь', 'Ноябрь', 'Декабрь'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            firstDay: 1,
            autoclose: true,
            todayHighlight: true
        }).datepicker('setDate', new Date);

        /**
         * Вывод времени в поле добавления события
         */
        $('.date-picker-time').timepicker({
            minuteStep: 10,
            showSeconds: false,
            showMeridian: false
        });


        /**
         * Красивый скролл в блоке списка событий
         */
        $('#clientCardEventList').ace_scroll({
            size: 300
        });

        $('#clientCardEventList .scroll-content').scrollTop(99999999);
    });
};

Template.clientCard.helpers({
    'client': function () { //Возвращаем данные по клиенту
        return Client.findOne(Router.current().params._id);
    },

    'clientCardEventItems': function () { //Возвращаем события по клиенту
        return Event.find({},{sort: {dt: 1}});
    },

    'clientCardAddEventStatuses': function () { //Возвращаем возможные статусы для клиента
        var result = [];
        var client = Client.findOne(Router.current().params._id);
        for (var i in client_status) {
            result.push({name: client_status[i], selected: client_status[i] == client.status ? 'selected' : ''});
        }
        return result;
    }
});

var clientEventAddFile;

Template.clientCard.events({

    /**
     * Кнопка "отправить" (блок события)
     */
    'keydown #clientCardEventAddMessage, paste #clientCardEventAddMessage, change #clientCardEventAddMessage': function (e, tpl) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            tpl.find('#clientCardEventAdd').click();
            return false;
        }
    },

    /**
     * Поле ввода сообщения (блок события)
     */
    'click #clientCardEventAdd': function (e, tpl) {

        var text = tpl.find('#clientCardEventAddMessage').value;

        if (!text) {
            return false;
        }

        Meteor.call('event.add', { //data
            type: 'clientComment',
            data: {
                client_id: Router.current().params._id,
                text: text
            }
        }, function (e, data) {
            tpl.find('#clientCardEventAddMessage').value = '';
        });
    },

    /**
     * Кнопка "добавить новое событие"
     */
    'click #clientCardAddEventButton': function (e, tpl) {

        var form = $(tpl.find('#clientCardAddEvent'));

        var paramObj = {};
        $.each(form.serializeArray(), function(_, kv) {
            paramObj[kv.name] = kv.value;
        });

        var _id = Router.current().params._id;

        var data = {
            comment: paramObj.clientCardAddEventComment,
            status: paramObj.clientCardAddEventStatus
        };

        if(clientEventAddFile) {
            FileCollections['event'].insert(clientEventAddFile, function(err, fObj){

                var blob = _.clone(fObj.data.blob);

                data.file = {
                    _id: fObj._id,
                    name: blob.name,
                    url: 'event'+'/'+fObj._id+'/'+blob.name,
                    type: blob.type,
                    size: blob.size
                };

                Meteor.call('client.addEvent', _id, data);
                clientEventAddFile = null;
                $(tpl.find('#clientCardAddEventFile')).ace_file_input('reset_input');
            });
        } else {
            Meteor.call('client.addEvent', _id, data);
        }
    },

    'change #clientCardAddEventFile': function(e, tpl) {
        FS.Utility.eachFile(e, function(file) {
            clientEventAddFile = file;
        });
    },


    /**
     * Кнопка "добавить новое напоминание"
     */
    'click #clientCardAddReminderButton': function (e, tpl) {

        var form = $(tpl.find('#clientCardAddReminder'));

        var paramObj = {};
        $.each(form.serializeArray(), function(_, kv) {
            paramObj[kv.name] = kv.value;
        });

        var _id = Router.current().params._id;

        var data = {
            date: moment(paramObj.clientCardAddReminderDate + ' ' + paramObj.clientCardAddReminderTime, 'DD.MM.YYYY HH:mm').valueOf(),
            comment: paramObj.clientCardAddReminderComment
        };

        Meteor.call('client.addReminder', _id, data, function(e) {
            $.gritter.add({
                title: 'Напоминание для компании добавлено',
                text: 'Для данной компании добавлено напоминание. В назначенное время придёт уведомление.',
                class_name: 'gritter-info gritter-center',
                time:3000
            });

            document.getElementById('clientCardAddReminderComment').value = '';
        });
    }

});

/**
 * Ренедер элемента из списка событий
 */
Template.clientCardEvent.rendered = function () {
    $('#clientCardEventList .scroll-content').scrollTop(99999999);
};

/**
 * Динамическая подгрузка шаблона в зависимости от типа события
 */
Template.clientCardEvent.helpers({
    'clientCardEventDynamicTemplate': function () {
        return 'clientCardEvent_' + this.type;
    }
});