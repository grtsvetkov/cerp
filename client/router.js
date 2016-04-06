if (Meteor.isClient) {

    Router.configure({
        //notFoundTemplate: '404',
        layoutTemplate: 'AppLayout',
        loadingTemplate: 'Loading',
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
        },

        waitOn: function() {
            return [
                Meteor.subscribe('userNotice')
            ]
        }

    });


    /**
     * Главная страница
     */

    Router.route('/', {
        name: 'index',
        bodyClass: 'no-skin',
        menuName: 'Главная',
        waitOn: function(){
            return [
                Meteor.subscribe('userReminder')
            ];
        }
    });


    /**
     * Задачи
     */
    Router.route('/task/list', {
        name: 'taskList',
        bodyClass: 'no-skin',
        menuName: 'Задачи',
        waitOn: function(){
            return [
                Meteor.subscribe('clientList')
            ];
        }
    });

    /**
     * Клиенты
     */

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
                Meteor.subscribe('clientList'),
                Meteor.subscribe('allEvent')
            ];
        }
    });

    Router.route('/client/card/:_id', {
        name: 'clientCard',
        bodyClass: 'no-skin',
        menuName: 'Карточка клиента',
        waitOn: function(){
            return [
                Meteor.subscribe('clientList'),
                Meteor.subscribe('clientEvent', this.params._id),
                Meteor.subscribe('usersPublic')
            ];
        }
    });


    /**
     * Пользователи
     */

    Router.route('/user/add', {
        name: 'userAdd',
        bodyClass: 'no-skin',
        menuName: 'Добавить пользователя',
        waitOn: function(){
            return [
                Meteor.subscribe('userGroupList')
            ];
        }
    });

    Router.route('/user/list', {
        name: 'userList',
        bodyClass: 'no-skin',
        menuName: 'Список пользователей',
        waitOn: function(){
            return [
                Meteor.subscribe('userGroupList'),
                Meteor.subscribe('usersAdmin')
            ];
        }
    });

    Router.route('/user/card/:_id', {
        name: 'userCard',
        bodyClass: 'no-skin',
        menuName: 'Карточка пользователя',
        waitOn: function(){
            return [
                Meteor.subscribe('usersAdmin')
            ];
        }
    });


    /**
     * Группы пользователей
     */

    Router.route('/userGroup/add', {
        name: 'userGroupAdd',
        bodyClass: 'no-skin',
        menuName: 'Добавить группу пользователей'
    });

    Router.route('/userGroup/list', {
        name: 'userGroupList',
        bodyClass: 'no-skin',
        menuName: 'Список групп пользователей',
        waitOn: function(){
            return [
                Meteor.subscribe('userGroupList')
            ];
        }
    });

    Router.route('/userGroup/card/:_id', {
        name: 'userGroupCard',
        bodyClass: 'no-skin',
        menuName: 'Карточка группы пользователей',
        waitOn: function(){
            return [
                Meteor.subscribe('userGroup', this.params._id)
            ];
        }
    });



    /**
     * Авторизация
     */

    Router.route('/login', {
        name: 'login',
        layoutTemplate: 'loginLayout',
        bodyClass: 'login-layout'

    });
}