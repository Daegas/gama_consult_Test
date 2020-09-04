function commonTable() {
    var table = {
        select: {
            style: 'single',
            blurable: false,
        },
        "order": [[1, 'asc'], [0, 'asc']],
        "pagingType": "full",
        "paging": true,
        "responsive": true,
        "ordering": true,
        "info": true,
        "serverSide": true,
        rowId: 0,
        "language": {
            "info": "Medicamentos _START_-_END_/_TOTAL_ ",
            "lengthMenu": "Mostrar   _MENU_   medicamentos",
            "sProcessing": "Procesando...",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfoEmpty": "Medicamentos 0/0",
            "sInfoFiltered": "(de _MAX_)",
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
            "select": {
                "rows": ""
            }
        },
        "columnDefs": [
            {
                "targets": [0, 5, 9, 10, 11, 12, 13],
                "width": 30,
            },
            {
                "targets": [1, 2],
                "width": 200,
            },
            {
                "targets": [15, 16],
                "orderable": false,
            },
            {
                "targets": [4,5,11,13],
                "className": "emphasize"
            },
            {
                "targets": [2],
                "className": "right-aligned-cell"
            },
            {
                "targets": [6, 8, 9, 10, 11, 12],
                "className": "center-aligned-cell"
            },
            {
                "targets": [4,5],
                "className": "left-aligned-cell"
            },
            {
                "targets": [17],
                "visible": false,
            }
            
        ],
        "columns": [
            // 0-ID 
            {},
            // 1-SustanciaActiva
            {},
            // 2-NombreComercial
            {},
            // 3-Presentacion
            {},
            // 4-Saldo Anterior (Oculto)
            {},
            // 5-Saldo
            {},
            // 6-Contenido
            {},
            // 7-Dosis
            {},
            // 8-Laboratorio
            {},
            // 9-Proveedor
            {},
            // 10-P_Proveedor
            {
                "render": function (data, type, row, meta) {
                    return '$'+ data;
                }
            },
            // 11-P_Publico
            {
                "render": function (data, type, row, meta) {
                    return '$'+ data;
                }
            },
            // 12-Descuento
            {
                "render": function (data, type, row, meta) {
                    return '%'+ data;
                }
            },
            // 13-P_Descuento
            {
                "render": function (data, type, row, meta) {
                    return '$'+ data;
                }
            },
            // 14-Caducidad
            {
                "render": function (data, type, row, meta) {
                    return formatDate(data);
                }
            },
            //15-Edit button
            {
                "data": null,
                "className": 'details-control',
                "render": function (data, type, row, meta) {
                    let html = `
                    <i id="btnEdit" data-MedicamentoID=${data[15]}
                    class="fa fa-pencil icontable text-info pointer" title="Editar">
                    </i>`;
                    return html;
                }
            },
            //16-Delete button
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    let html = `
                        <i id="btnDelete" data-MedicamentoID=${data[16]}
                        class="fa fa-trash icontable text-danger pointer" title="Eliminar">
                        </i>`;
                    return html;
                }
            },
            //17- Codigo
            {}
        ]
    };
    return table;
}