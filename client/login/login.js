Template.login.events({

    'click #loginButton': function(event, template) {
        template.$('#loginForm').submit();
    },

    'keydown #loginLogin, paste #loginLogin, change #loginLogin': function (e, tpl) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            $(tpl.$('#loginForm')).submit();
            return false;
        }
    },

    'keydown #loginPassword, paste #loginPassword, change #loginPassword': function (e, tpl) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            tpl.$('#loginForm').submit();
            return false;
        }
    },

    'submit #loginForm': function(event, template) {
        event.preventDefault();

        var login = event.target['loginLogin'].value;
        var password = event.target['loginPassword'].value;

        if(login == 0 || password == 0) {
            return;
        }

        Meteor.loginWithPassword(login, password, function (error, result) {
            if (error) {
                console.log(error);

            } else {
                Router.go('/');
            }
        });

        return false;
    }
});