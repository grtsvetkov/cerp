/**
 * Используемые переменные для наговаривания по микрофону
 */
var speechButton, speechRec = false, speechFinal = '', speechInput, recognition;

/**
 * Рендер страницы
 */
Template.userCard.rendered = function () {

    jQuery(function ($) {

        speechButton = $('#speechButton');
        speechInput = $('#userCardEventAddMessage');

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
        $('#userCardAddEventFile').ace_file_input({
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
                Meteor.call('user.update', _id, data);
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
        $(document).on('focus', '.userCardInputClass_phone', function () {
            $(this).mask('+7 (999) 999-99-99');
        });

        /**
         * Календарик в блоке добавления события
         */
        $('#userCardAddEventDate').datepicker({
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
        $('#userCardAddEventTime').timepicker({
            minuteStep: 10,
            showSeconds: false,
            showMeridian: false
        });


        /**
         * Красивый скролл в блоке списка событий
         */
        $('#userCardEventList').ace_scroll({
            size: 300
        });

        $('#userCardEventList .scroll-content').scrollTop(99999999);
    });
};

Template.userCard.helpers({
    'user': function () { //Возвращаем данные по клиенту
        return user.findOne();
    },

    'userCardEventItems': function () { //Возвращаем события по клиенту
        return Event.find({},{sort: {dt: 1}});
    },

    'userCardAddEventStatuses': function () { //Возвращаем возможные статусы для клиента
        var result = [];
        var user = user.findOne();
        for (var i in user_status) {
            result.push({name: user_status[i], selected: user_status[i] == user.status ? 'selected' : ''});
        }
        return result;
    }
});

var userEventAddFile;

Template.userCard.events({

    /**
     * Кнопка "отправить" (блок события)
     */
    'keydown #userCardEventAddMessage, paste #userCardEventAddMessage, change #userCardEventAddMessage': function (e, tpl) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            tpl.find('#userCardEventAdd').click();
            return false;
        }
    },

    /**
     * Поле ввода сообщения (блок события)
     */
    'click #userCardEventAdd': function (e, tpl) {

        var text = tpl.find('#userCardEventAddMessage').value;

        if (!text) {
            return false;
        }

        Meteor.call('event.add', { //data
            type: 'userComment',
            data: {
                user_id: Router.current().params._id,
                text: text
            }
        }, function (e, data) {
            tpl.find('#userCardEventAddMessage').value = '';
        });
    },

    /**
     * Кнопка "добавить новое событие"
     */
    'click #userCardAddEventButton': function (e, tpl) {

        var form = $(tpl.find('#userCardAddEvent'));

        var paramObj = {};
        $.each(form.serializeArray(), function(_, kv) {
            paramObj[kv.name] = kv.value;
        });

        var _id = Router.current().params._id;

        var data = {
            comment: paramObj.userCardAddEventComment,
            status: paramObj.userCardAddEventStatus
        };

        if(userEventAddFile) {
            FileCollections['event'].insert(userEventAddFile, function(err, fObj){

                var blob = _.clone(fObj.data.blob);

                data.file = {
                    _id: fObj._id,
                    name: blob.name,
                    url: 'event'+'/'+fObj._id+'/'+blob.name,
                    type: blob.type,
                    size: blob.size
                };

                Meteor.call('user.addEvent', _id, data);
                userEventAddFile = null;
                $(tpl.find('#userCardAddEventFile')).ace_file_input('reset_input');
            });
        } else {
            Meteor.call('user.addEvent', _id, data);
        }
    },

    'change #userCardAddEventFile': function(e, tpl) {
        FS.Utility.eachFile(e, function(file) {
            userEventAddFile = file;
        });
    }

});

/**
 * Ренедер элемента из списка событий
 */
Template.userCardEvent.rendered = function () {
    $('#userCardEventList .scroll-content').scrollTop(99999999);
};