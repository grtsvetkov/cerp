Template.registerHelper('currentUser', function(){
    return Meteor.user();
});

Template.registerHelper('currentTemplate', function(){
    return Router.current() && Router.current().route.options;
});

Template.registerHelper('isActive', function(name){
    return Router.current() && Router.current().route.options.name == name ? 'active' : '';
});

Template.registerHelper('timeAgo', function(dt, update){
    if(update) {
        Session.get('rightNow');
    }
    return moment(dt).fromNow();
});

Template.registerHelper('timeString', function(dt){
    return moment(dt).format('DD.MM.YYYY');
});

Template.registerHelper('userProfile', function(uID, params){
    var p = (params ? ('profile.'+params) : 'profile').split('.'),
        prf = Meteor.users.findOne(uID);
    if (prf){ _.each(p, function(t){ prf = prf[t] || ''; }); }

    return prf;
});

Template.registerHelper('eq', function(op1, op2){
    return op1 == op2;
});
Template.registerHelper('eqq', function(op1, op2){
    return op1 === op2;
});
Template.registerHelper('not', function(op){
    return !op;
});

Template.registerHelper('filesize', function(size){
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
});