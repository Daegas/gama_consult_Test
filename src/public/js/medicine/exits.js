/**************************** EVENTS *******************************************/
tableSearch = null;
tableAdd = null;
$(document).ready(function () {
    // ********* FUNCTIONALITY ***********
    // sessionStorage.clear();
    tabIndex = 0;
    // ********* SEARCH TABLE ***********
    tableSearch = $('#tbSearch').DataTable({
        dom: '<"top mt-4 row" f><"row" <"col-12"t>><"bottom row" <"col-sm-5 col-md-4"i><"col-sm-6 col-md-6"p>>',
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
        "order": [[ 1, 'asc' ], [ 0, 'asc' ]],
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
                "targets": [4,9,10,11,12,14,15],
                "searchable": false
            },
            {
                "targets": [ 9,13,14,15],
                "visible": false
            }
        ],
        "columns": [
            // 0-ID 
            {},
            // 1-SustanciaActiva
            {},
            // 2-NombreComercial
            { 
            },
            // 3-Presentacion
            {},
            // 4-Saldo
            {},
            // 5-Contenido
            {},
            // 6-Dosis
            {},
            // 7-Laboratorio
            {},
            // 8-Proveedor
            {},
            // 9-P_Proveedor
            {},
            // 10-P_Publico
            {},
            // 11-Descuento
            {},
            // 12-P_Descuento
            {},
            // 13-Caducidad
            {
                "render": function(data, type, row, meta) {
                    return formatDate(data);
                }
            },
            //14-Edit button
            { 
            },
            //15-Delete button
            {   
            }
        ]
    });
    // ************ ADD TABLE **************
    idList = ["0"]; //List of tableSearch selected elements, to show in tableAdd
    tableAdd = $('#tbAdd').DataTable({
        dom: '<"top mt-4 row"><"row" <"col-12"t>><"bottom row" <"col-sm-5 col-md-4"i><"col-sm-6 col-md-6"p>>',
        "pagingType": "full",
        "alengthMenu": ["All"],
        "paging": true,
        "responsive": true,
        "ordering": true,
        "info": true,
        // "autoWidth": false,
        "order": [[ 1, 'asc' ], [ 0, 'asc' ]],
        "serverSide": true,
        "ajax": "/meds/get-addTable/" +JSON.stringify(idList),
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
                "targets": [4,9,10,11,12,14,15],
                "searchable": false
            },
            {
                "targets": [ 9,13,14,15],
                "visible": false
            }
        ],
        "columns": [
            // 0-ID 
            {},
            // 1-SustanciaActiva
            {},
            // 2-NombreComercial
            {
            },
            // 3-Presentacion
            {},
            // 4-Cantidad
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    let entry_ = entries[data[0]];
                    return entry_.split(',')[0]; //Display 'Quantity'
                }
            },        
            // 5-Contenido
            {},
            // 6-DosisMG
            {},
            // 7-Laboratorio
            {},
            // 8-Proveedor
            {},
            // 9-P_Proveedor
            {
                "data": null,
                render: function (data, type, row, meta) {
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null) { //If the medicine had been locally modified
                        return item_.P_Proveedor;
                    } else {
                        return data[9];
                    }
                }
            },
            // 10-P_Publico
            {
                "data": null,
                render: function (data, type, row, meta) {
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null) { //If the medicine had been locally modified
                        return item_.P_Publico;
                    } else {
                        return data[10];
                    }
                }
            },
            // 11-Descuento
            {
                "data": null,
                render: function (data, type, row, meta) {
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null) { //If the medicine had been locally modified
                        return item_.Descuento;
                    } else {
                        return data[11];
                    }
                }
            },
            // 12-Descuento
            {
            },
            // 13-Caducidad
            {
                "data": null,
                render: function (data, type, row, meta) {
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null) { //If the medicine had been locally modified
                        return formatDate(item_.Caducidad);
                    } else {
                        return formatDate(data[13]);
                    }
                }
            },
            //14-Edit button Only change the current table   go
            {
                "data": null,
                "orderable": false,
                "className": 'details-control',
                "render": function (data, type, row, meta) {
                    let html = `
                            <i id="btnEdit" data-MedicamentoID=${data[14]}
                            class="fa fa-pencil text-info pointer" title="Editar">
                            </i>`;
                    return html;
                }
            },
            //15-Delete button This button should delete it only from the tbAdd table,
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    let html = `
                                <i id="btnDelete" data-MedicamentoID=${data[15]}
                                class="fa fa-close text-danger pointer" title="Eliminar">
                                </i>`;
                    return html;
                }
            }
        ]
    });
});

// ********************* MODAL ENTRIES EVENTS **************************
let entries = {};

// ********************* ADD TABLE EVENTS **************************
let _addSelectedRow;
$(document).on("click", "#btnEdit", function (e) {
    let rowSelected = _addSelectedRow.data();
    $("#formEntry").trigger("reset");
    $("#iID").val(rowSelected[0]);
    $("#iNombreE").val(rowSelected[2]);
    $("#iCantidad").val(entries[rowSelected[0]].split(",")[0]);
    $("#iSaldoAE").val(rowSelected[3]);

    $("#modalEntry").modal("show");
});

$('#tbAdd').on( 'click', 'tr', function () {
    _addSelectedRow = tableAdd.row(this);
} );