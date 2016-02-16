function trueFunc() {
    return true;
}

function falseFunc() {
    return false;
}

Meteor.users.allow({
    insert: function () { return true; },
    update: function () { return true; },
    remove: function () { return true; }
});

for(var key in FileCollections) {

    if(FileCollections[key]._validators.download.allow.length == 0) {
        FileCollections[key].allow({
            insert: trueFunc,
            update: trueFunc,
            remove: trueFunc,
            download: trueFunc
        });
    }
}

for(var key in ImgCollections) {

    if(ImgCollections[key]._validators.download.allow.length == 0) {
        ImgCollections[key].allow({
            insert: trueFunc,
            update: trueFunc,
            remove: trueFunc,
            download: trueFunc
        });
    }
}