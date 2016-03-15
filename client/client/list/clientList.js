
var oTable1;

Template.clientList.rendered = function () {

    var rusLng = {
        "processing": "Подождите...",
        "search": "Поиск:",
        "lengthMenu": "Показать _MENU_ записей",
        "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
        "infoEmpty": "Записи с 0 до 0 из 0 записей",
        "infoFiltered": "(отфильтровано из _MAX_ записей)",
        "infoPostFix": "",
        "loadingRecords": "Загрузка записей...",
        "zeroRecords": "Записи отсутствуют.",
        "emptyTable": "В таблице отсутствуют данные",
        "paginate": {
            "first": "Первая",
            "previous": "Предыдущая",
            "next": "Следующая",
            "last": "Последняя"
        },
        "aria": {
            "sortAscending": ": активировать для сортировки столбца по возрастанию",
            "sortDescending": ": активировать для сортировки столбца по убыванию"
        }
    };

    jQuery(function ($) {

        //initiate dataTables plugin
        oTable1 =
            $('#dynamic-table')
                //.wrap("<div class='dataTables_borderWrap' />")   //if you are applying horizontal scrolling (sScrollX)
                .dataTable({
                    language: rusLng,
                    bAutoWidth: false,
                    "aoColumns": [
                        //{"bSortable": false},
                        null, null, {"bSortable": false}, null, null, null, null,
                        {"bSortable": false}
                    ],
                    "aaSorting": [],

                    //,
                    //"sScrollY": "200px",
                    //"bPaginate": false,

                    //"sScrollX": "100%",
                    //"sScrollXInner": "120%",
                    //"bScrollCollapse": true,
                    //Note: if you are applying horizontal scrolling (sScrollX) on a ".table-bordered"
                    //you may want to wrap the table inside a "div.dataTables_borderWrap" element


                    bPaginate: false,
                    bInfo: false,
                    retrieve: true
                    //"iDisplayLength": 50 //Показывать результатов по-умолчанию
                });
        //oTable1.fnAdjustColumnSizing();



        //TableTools settings
        TableTools.classes.container = "btn-group btn-overlap";
        TableTools.classes.print = {
            "body": "DTTT_Print",
            "info": "tableTools-alert gritter-item-wrapper gritter-info gritter-center white",
            "message": "tableTools-print-navbar"
        };

        //initiate TableTools extension
        var tableTools_obj = new $.fn.dataTable.TableTools(oTable1, {
            "sSwfPath": "/swf/copy_csv_xls_pdf.swf",

            "sRowSelector": "td:not(:last-child)",
            "sRowSelect": "multi",
            "fnRowSelected": function (row) {
                //check checkbox when row is selected
                try {
                    $(row).find('input[type=checkbox]').get(0).checked = true
                }
                catch (e) {
                }
            },
            "fnRowDeselected": function (row) {
                //uncheck checkbox
                try {
                    $(row).find('input[type=checkbox]').get(0).checked = false
                }
                catch (e) {
                }
            },

            "sSelectedClass": "success",
            "aButtons": [
                {
                    "sExtends": "copy",
                    "sToolTip": "Копировать в буфер",
                    "sButtonClass": "btn btn-white btn-primary btn-bold",
                    "sButtonText": "<i class='fa fa-copy bigger-110 pink'></i>",
                    "fnComplete": function () {
                        this.fnInfo('<h3 class="no-margin-top smaller">Таблица скопирована</h3>\
									<p>Скопировано ' + (oTable1.fnSettings().fnRecordsTotal()) + ' записей в буфер.</p>',
                            1500
                        );
                    }
                },

                {
                    "sExtends": "csv",
                    "sToolTip": "Экспорт в CSV",
                    "sButtonClass": "btn btn-white btn-primary  btn-bold",
                    "sButtonText": "<i class='fa fa-file-excel-o bigger-110 green'></i>"
                },

                {
                    "sExtends": "pdf",
                    "sToolTip": "Экспорт в PDF",
                    "sButtonClass": "btn btn-white btn-primary  btn-bold",
                    "sButtonText": "<i class='fa fa-file-pdf-o bigger-110 red'></i>"
                },

                {
                    "sExtends": "print",
                    "sToolTip": "Печать таблицы",
                    "sButtonClass": "btn btn-white btn-primary  btn-bold",
                    "sButtonText": "<i class='fa fa-print bigger-110 grey'></i>",

                    "sMessage": "<div class='navbar navbar-default'><div class='navbar-header pull-left'><a class='navbar-brand' href='#'><small>Клиенты компании</small></a></div></div>",

                    "sInfo": "<h3 class='no-margin-top'>Печать таблицы</h3>\
									  <p>Пожалуйста, используйте функции браузера\
									  чтобы напечатать эту страницу.\
									  <br />Нажмите <b>escape</b> после окончания печати.</p>",
                }
            ]
        });
        //we put a container before our table and append TableTools element to it
        $(tableTools_obj.fnContainer()).appendTo($('.tableTools-container'));

        //also add tooltips to table tools buttons
        //addding tooltips directly to "A" buttons results in buttons disappearing (weired! don't know why!)
        //so we add tooltips to the "DIV" child after it becomes inserted
        //flash objects inside table tools buttons are inserted with some delay (100ms) (for some reason)
        setTimeout(function () {
            $(tableTools_obj.fnContainer()).find('a.DTTT_button').each(function () {
                var div = $(this).find('> div');
                if (div.length > 0) div.tooltip({container: 'body'});
                else $(this).tooltip({container: 'body'});
            });
        }, 200);


        //ColVis extension
        var colvis = new $.fn.dataTable.ColVis(oTable1, {
            "buttonText": "<i class='fa fa-search'></i>",
            "aiExclude": [0, 6],
            "bShowAll": true,
            //"bRestore": true,
            "sAlign": "right",
            "fnLabel": function (i, title, th) {
                return $(th).text();//remove icons, etc
            }

        });

        //style it
        $(colvis.button()).addClass('btn-group').find('button').addClass('btn btn-white btn-info btn-bold');


        //and append it to our table tools btn-group, also add tooltip
        $(colvis.button())
            .prependTo('.tableTools-container .btn-group')
            .attr('title', 'показать/скрыть колонки').tooltip({container: 'body'});

        //and make the list, buttons and checkboxed Ace-like
        $(colvis.dom.collection)
            .addClass('dropdown-menu dropdown-light dropdown-caret dropdown-caret-right')
            .find('li').wrapInner('<a href="javascript:void(0)" />') //'A' tag is required for better styling
            .find('input[type=checkbox]').addClass('ace').next().addClass('lbl padding-8');


        /*$(document).on('click', '#dynamic-table .dropdown-toggle', function (e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
        });*/

    });

};

Template.clientList.helpers({
    'clientList': function() {
        return  Client.find().fetch();
    }
});

Template.clientListItem.helpers({
    'lastEvent': function(_id) {

        var ev =  Event.find({'data.client_id': _id}, {sort: {'dt': -1}}).fetch()[0];

        switch (ev.type) {
            case 'clientAdd':
                return 'Добавление карточки';
                break;

            case 'clientComment':
                return 'Добавление комментария: "'+ev.data.text+'"';
                break;

            case 'clientEdit':
                return 'Редактирование данных';
                break;

            case 'clientEvent':
                return 'Добавление события. Статус: "'+ev.data.new_status+'". Комментарий: "'+ev.data.comment+'"';
                break;
        }
    },

    'lastEvent_date': function(_id) {

        return moment(Event.find({'data.client_id': _id}, {sort: {'dt': -1}}).fetch()[0].dt).format('DD.MM.YYYY hh:mm');
    }


});

Template.clientListItem.rendered = function() {
    if(oTable1) {
        oTable1.api().row.add($(this.firstNode));
    }
};
