Meteor.startup(function() {
    Meteor.setInterval(function () {
        Session.set('rightNow', new Date());
    }, 1000);
});