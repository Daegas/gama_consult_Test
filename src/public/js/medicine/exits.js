/**************************** EVENTS *******************************************/

$(document).ready(function () {

    // ********* SEARCH TABLE ***********
    tableSearch = $('#tbSearch').DataTable({
        dom: '<"top mt-4 row" f><"row" <"col-12"t>><"bottom row" <"col-sm-4 col-lg-3"i> <"col-sm-5 col-lg-3"p>>',
        select: {
            style: 'single'
        },
        "pagingType": "full",
        "lengthMenu": [7],
        "paging": true,
        "responsive": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "serverSide": true,
        "ajax": "/meds/get-dt",
        "language": {
            "info": "Medicamentos _START_-_END_/_TOTAL_ ",
            "lengthMenu": "Mostrar   _MENU_   medicamentos",
            "sProcessing": "Procesando...",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfoEmpty": "Medicamentos 0/0",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": ">>",
                "sPrevious": "<<"
            },
            "oAria": {
                "sSortAscending": ": Ordenar ascendente",
                "sSortDescending": ": Ordenar descendente"
            },
        },
        "columnDefs": [
            {
                "targets": [3, 5, 6, 7, 9, 10],
                "searchable": false,
                "targets": [ 1,3,5,8,9, 10],
                "visible": false
            }
        ],
        "columns": [
            // 0-ID 
            {},
            // 1-SustanciaActiva
            {},
            // 2-Nombre
            {},
            // 3-Saldo
            {},
            // 4-Presentacion
            {},
            // 5-P_Proveedor
            {},
            // 6-P_Publico
            {},
            // 7-Descuento
            {},
            // 8-Caducidad
            {},
            //9-Edit button
            {},
            //10-Delete button
            {}
        ]
    });
    // ************ ADD TABLE **************
    tableAdd = $('#tbAdd').DataTable({
        dom: '<"top mt-4 row" fr><"row" <"col-12"t>><"bottom row" <"col-sm-5 col-md-4"i><"col-sm-6 col-md-6"p>>',
        "pagingType": "full",
        "lengthMenu": [7],
        "paging": true,
        "responsive": true,
        "ordering": true,
        "info": true,
        // "autoWidth": false,
        "serverSide": true,
        "ajax": "/meds/get-dt",
        "language": {
            "info": "Medicamentos _START_-_END_/_TOTAL_ ",
            "lengthMenu": "Mostrar   _MENU_   medicamentos",
            "sProcessing": "Procesando...",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfoEmpty": "Medicamentos 0/0",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": ">>",
                "sPrevious": "<<"
            },
            "oAria": {
                "sSortAscending": ": Ordenar ascendente",
                "sSortDescending": ": Ordenar descendente"
            },
        },
        "columnDefs": [
            {
                "targets": [3, 5, 6, 7, 9, 10],
                "searchable": false,
                "targets": [ 1,5,8,9, 10],
                "visible": false
            }
        ],
        "columns": [
            // 0-ID 
            {},
            // 1-SustanciaActiva
            {},
            // 2-Nombre
            {},
            // 3-Saldo
            {},
            // 4-Presentacion
            {},
            // 5-P_Proveedor
            {},
            // 6-P_Publico
            {},
            // 7-Descuento
            {},
            // 8-Caducidad
            {},
            //9-Edit button Only change the current table   go
            {
                "data": null,
                "orderable": false,
                "className": 'details-control',
                "render": function (data, type, row, meta) {
                    let html = `
                            <i id="btnEdit" data-MedicamentoID=${data[9]}
                            class="fa fa-pencil text-info pointer" title="Editar">
                            </i>`;
                    return html;
                }
            },
            //10-Delete button This button should delete it only from the tbAdd table,
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    let html = `
                                <i id="btnDelete" data-MedicamentoID=${data[10]}
                                class="fa fa-close text-danger pointer" title="Eliminar">
                                </i>`;
                    return html;
                }
            }
        ]
    });

});
