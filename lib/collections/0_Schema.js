ImgCollections = {};
FileCollections = {};
Schema = {};

/**
 * Create FS.Collection Stores
 */
Stores = {};
Stores['original'] = new FS.Store.FileSystem('original'); //Оригинальный

FileStores = {};
FileStores['original'] = new FS.Store.FileSystem('files');

/**
 * Функция для автоматического создания FS Collection изображений и store к ним
 * @param name название коллекции К КОТОРОЙ создается FS Collection (например review, users)
 * @param array_of_resize массив ресайзов вида ['60x60','120x120']
 *
 */
createImgCollection = function(name, array_of_resize) {

    //Хранилища, которые будут будут в оной коллекции
    var localStore = [Stores['original']];

    for(var i in array_of_resize) { //Записываем сторы с ресайзами
        var store = array_of_resize[i];
        var resizeName = 'resize' + store;

        if(!(resizeName in Stores)) {

            var resize = store.split('x');

            Stores[resizeName] = new FS.Store.FileSystem(resizeName, {

                transformWrite: function (fileObj, readStream, writeStream) {
                    var resize = Object.keys(fileObj.copies)[0].replace('resize', '').split('x');
                    gm(readStream).autoOrient().resize(resize[0], resize[1] + '^').gravity('Center').extent(resize[0], resize[1]).stream().pipe(writeStream);
                }
            });
        }

        localStore.push(Stores[resizeName]);
    }

    //Создаем коллекцию FS для хранения картинок
    ImgCollections[name] = new FS.Collection(name, {
        stores: localStore,
        filter: {
            maxSize: 1024 * 1024 * 1024, //in bytes
            allow: { contentTypes: ['image/*'] },
            onInvalid: function(message) { Meteor.isClient && alert(message); }
        },
        name: {
            type: String
        },
        image: {
            type: String,
            autoform: {
                type: "cfs-file",
                collection: name
            }
        }
    });
};



/**
 * Функция для автоматического создания FS Collection файлов и store к ним
 * @param name название коллекции К КОТОРОЙ создается FS Collection (например review, users)
 * @param array_of_resize массив ресайзов вида ['60x60','120x120']
 */
createFileCollection = function(name, array_of_resize_for_images) {

    //Хранилища, которые будут будут в оной коллекции
    var localStore = [FileStores['original']];

    for(var i in array_of_resize_for_images) { //Записываем сторы с ресайзами
        var store = array_of_resize_for_images[i];
        var resizeName = 'resize' + store;

        if(!(resizeName in FileStores)) {

            var resize = store.split('x');

            FileStores[resizeName] = new FS.Store.FileSystem(resizeName, {
                transformWrite: function (fileObj, readStream, writeStream) {

                    if(fileObj.original.type.split('/')[0] == 'image') {

                        var resize = Object.keys(fileObj.copies)[0].replace('resize', '').split('x');
                        gm(readStream).autoOrient().resize(resize[0], resize[1] + '^').gravity('Center').extent(resize[0], resize[1]).stream().pipe(writeStream);
                    }
                }
            });
        }

        localStore.push(FileStores[resizeName]);
    }

    //Создаем коллекцию FS для хранения картинок
    FileCollections[name] = new FS.Collection(name, {
        stores: localStore,
        filter: {
            maxSize: 1024 * 1024 * 1024, //in bytes
            allow: {
                extensions : ['pdf','doc','docx','odf','xls','xlsx','png','jpg','jpeg','bmp']
            },
            onInvalid: function(message) { Meteor.isClient && alert(message); }
        },
        name: {
            type: String
        },
        file: {
            type: String,
            autoform: {
                type: "cfs-file",
                collection: name
            }
        }
    });
};