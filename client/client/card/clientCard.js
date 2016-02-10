var speechButton, speechRec = false, speechFinal = '', speechInput, recognition;

Template.clientCard.rendered = function() {

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
            recognition.onstart = function() {
                speechRec = true;
                speechButton.removeClass('fa-microphone-slash').addClass('fa-microphone'); // меняем вид кнопки
            };

            /* обработчик ошибок */
            recognition.onerror = function(event) {
                if (event.error == 'no-speech') {
                    speechButton.removeClass('fa-microphone').addClass('fa-microphone-slash');
                }
                if (event.error == 'audio-capture') {
                    speechButton.removeClass('fa-microphone').addClass('fa-microphone-slash');
                }
            };

            /* метод вызывается когда распознование закончено */
            recognition.onend = function() {
                speechRec = false;
                speechButton.removeClass('fa-microphone').addClass('fa-microphone-slash');
            };

            /* 
             метод вызывается после каждой сказанной фразы. Параметра event используем атрибуты:
             - resultIndex - нижний индекс в результирующем массиве
             - results - массив всех результатов в текущей сессии
             */
            recognition.onresult = function(event) {

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
        speechButton.click(function(event) {

            if (speechRec) { // если запись уже идет, тогда останавливаем
                recognition.stop();
                return;
            }

            recognition.start();

        });

        $('#clientCardEventList').ace_scroll({
            size: 300
        });

        $('#clientCardEventList .scroll-content').scrollTop(99999999);
    });
};

Template.clientCard.helpers({

    'client': function() {
        return Client.findOne();
    },

    'clientCardEventItems': function(){
        return Event.find();
    }
});

Template.clientCard.events({

    'keydown #clientCardEventAddMessage, paste #clientCardEventAddMessage, change #clientCardEventAddMessage': function(e, tpl){
        var code = e.keyCode || e.which;
        if (code == 13){
            e.preventDefault();
            tpl.find('#clientCardEventAdd').click();
            return false;
        }
    },

   'click #clientCardEventAdd': function(e, tpl){

       var text = tpl.find('#clientCardEventAddMessage').value;

       if(!text) {
           return false;
       }

       Meteor.call('event.add', { //data
           type: 'clientComment',
           data: {
               client_id: Router.current().params._id,
               text: text
           }
       }, function(e, data){
           tpl.find('#clientCardEventAddMessage').value = '';
           $('#clientCardEventList .scroll-content').scrollTop(99999999);
       });
   }

});

Template.clientCardEvent.helpers({
    'clientCardEventDynamicTemplate': function(){
        return 'clientCardEvent_'+ this.type;
    }
});

