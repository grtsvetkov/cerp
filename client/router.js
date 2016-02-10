if (Meteor.isClient) {

    Router.configure({
        //notFoundTemplate: '404',
        layoutTemplate: 'AppLayout',
        //loadingTemplate: 'loading',
        controller: 'ApplicationController'
    });

    ApplicationController = RouteController.extend({
        action: function () {
            if (Meteor.isClient){
                if(this.options.route.options.name == 'login') {
                    Meteor.logout(function(err){});
                    this.render();
                }
                else if (Meteor.userId()) {
                    this.render();
                } else if (!Meteor.userId()) {
                    Router.go('login');
                } else {
                    this.render();
                }
            }
        },
        onBeforeAction: function() {
            if(this.options.route.options.bodyClass) {
                $('body').addClass(this.options.route.options.bodyClass);
                this.next();
            }
        },
        onStop: function() {
            if(this.options.route.options.bodyClass) {
                $('body').removeClass(this.options.route.options.bodyClass);
            }
        }

    });


    Router.route('/', {
        name: 'index',
        bodyClass: 'no-skin',
        menuName: 'Главная'
    });

    Router.route('/client/add', {
        name: 'clientAdd',
        bodyClass: 'no-skin',
        menuName: 'Добавить клиента'
    });

    Router.route('/client/list', {
        name: 'clientList',
        bodyClass: 'no-skin',
        menuName: 'Список клиентов',
        waitOn: function(){
            return [
                Meteor.subscribe('clientList')
            ];
        }
    });

    Router.route('/client/card/:_id', {
        name: 'clientCard',
        bodyClass: 'no-skin',
        menuName: 'Карточка клиента',
        waitOn: function(){
            return [
                Meteor.subscribe('client', this.params._id),
                Meteor.subscribe('clientEvent', this.params._id),
                Meteor.subscribe('usersPublic')
            ];
        }
    });

    Router.route('/login', {
        layoutTemplate: 'loginLayout',
        name: 'login',
        bodyClass: 'login-layout'

    });
}