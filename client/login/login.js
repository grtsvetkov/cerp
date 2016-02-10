Template.login.events({

    'click #login-button': function(event, template) {
        template.$('#login-form').submit();
    },

    'submit #login-form': function(event, template) {
        event.preventDefault();

        var login = event.target['login-login'].value;
        var password = event.target['login-password'].value;

        if(login == 0 || password == 0) {
            return;
        }

        Meteor.loginWithPassword(login, password, function (error, result) {
            if (error) {
                console.log(error);
                //throw new Meteor.Error(error.error, '������������ ���� e-mail - ������! �������������� �� �������. ��������� ��������� ����������, �� ������ �� ������� "Caps Lock" � ���������� ������ ���� ����� � ������ ��� ���')
            } else {
                Router.go('/');
            }
        });
    }
});