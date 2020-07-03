function editForm(med) {

    let activo = med.Activo ?
        '<input id="active" type="checkbox" name="Activo" value="1" checked>' :
        '<input id="active" type="checkbox" name="Activo" value="0">';

    let html =
        `
    <form action="/meds/edit/`+ med.MedicamentoID + `" method="POST"> 
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="text" class="form-control" name="SustanciaActiva"
                        placeholder="Sustancia Activa" title="Sustancia Activa"
                        value=" `+ med.SustanciaActiva + ` ">
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="text" class="form-control" name="Nombre" placeholder="Nombre" title="Nombre"
                    value=" `+ med.Nombre + ` ">
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" class="form-control" name="Saldo" placeholder="Saldo" title="Saldo"
                    value= `+ med.Saldo + ` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="text" class="form-control" name="Presentacion" title="Presentación"
                        placeholder="Presentación" value=" `+ med.Presentacion + ` ">
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" name="P_Proveedor" title="$ Proveedor"
                        placeholder="$ Proveedor" value= `+ med.P_Proveedor + ` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" name="P_Publico" title="$ Publico"
                        placeholder="$ Público" value= `+ med.P_Publico + ` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" name="P_Descuento" title="$ Descuento"
                        placeholder="$ Descuento" value= `+ med.P_Descuento + ` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <div class="align-center">
                        `+ activo + `
                        <label for="Activo">Activo</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <button class="btn btn-primary btn-block">Save</button>
        </div>
    </form>
    `;

    return html;
}



$(document).ready(function () {
    tableMeds = $('#tbMeds').DataTable({
        "dom": '<"top"fl<"toolbar mx-auto mb-2"> rt><"bottom"ip><"clear">',
        // dom: '<"top mt-4 row" l <"toolbar mx-auto mb-2"> frt><"bottom row" <"col-6 mx-auto"i> <"col-6 mx-auto"p>>', //Se agrega clase 'toolbar' a la plantilla
        fnInitComplete: function () { //Función para desplegar contenido (Botón 'Nuevo') en div.toolbar
            html = `
            <button id="btnNew" class="btn btn-info rounded">
                <i class="fa fa-plus-circle"></i> Nuevo
            </button>
            `;
            $('div.toolbar').html(html);
        },
        "pagingType": "full",
        "lengthMenu": [5, 10, 25, 50],
        "paging": true,
        "responsive":true,
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
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Ordenar ascendente",
                "sSortDescending": ": Ordenar descendente"
            },
        },
        "columnDefs": [
            {
                "targets": [2, 4, 5, 8, 9],
                "searchable": false
            },
            {
                "targets":[2,4,5,6,8,9],
                "sWidth":'6%'

          },
          {
            "targets":[0,1,3,7],
            "sWidth":'15%'

      }
        ],
        "columns": [
            // SustanciaActiva
            {},
            // Nombre
            {},
            // Saldo
            {},
            // Presentacion
            {},
            // P_Proveedor
            {},
            // P_Publico
            {},
            // Descuento
            {},
            // Caducidad
            {},
            {   //Edit button
                "data": null,
                "orderable": false,
                "className": 'details-control',
                "render": function (data, type, row, meta) {
                    let html = `
                        <i id="btnEdit" data-MedicamentoID=${data[8]}
                        class="fa fa-pencil text-info pointer" title="Editar">
                        </i>`;
                    return html;
                }
            },
            {   //Delete button
                "data": null,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    let html = `
                            <i id="btnDelete" data-MedicamentoID=${data[9]}
                            class="fa fa-trash text-danger pointer" title="Eliminar">
                            </i>`;
                    return html;
                }
            }
        ]
    });




    /* EDIT FORM */
    // Add event listener for opening and closing 'Edit form'
    // $('#tbMeds tbody').on('click', 'td.details-control', function () {
    //     let this_ = $(this);
    //     var tr = this_.closest('tr');
    //     var row = tableMeds.row( tr );

    //     let iconElement = this_.find('i');

    //     if ( row.child.isShown() ) {
    //         // This row is already open - close it
    //         row.child.hide();
    //         iconElement.attr('title','Editar').removeClass('fa-window-close').addClass('fa-pencil');
    //     }
    //     else {
    //         // Open this row
    //         let MedicamentoID = iconElement.attr('data-MedicamentoID');

    //         var xhttp = new XMLHttpRequest();
    //         xhttp.open('GET', '/meds/edit/'+MedicamentoID);
    //         xhttp.onload = function(){
    //             var med = xhttp.responseText;
    //             med = JSON.parse(med);

    //             //Show data in a new row(child)
    //             row.child( editForm(med.med) ).show();
    //         };
    //         xhttp.send();

    //         iconElement.attr('title', 'Cancelar').removeClass('fa-pencil').addClass('fa-window-close');
    //     }
    // });
});

setInterval( function () {
    tableMeds.ajax.reload(null,false);
}, 2000 );



var opc = -1;
$("#formMeds").submit(function (e) {
    e.preventDefault();
    SustanciaActiva = $.trim($("#iSustanciaActiva").val());
    Nombre = $.trim($("#iNombre").val());
    Saldo = $.trim($("#iSaldo").val());
    Presentacion = $.trim($("#iPresentacion").val());
    P_Proveedor = $.trim($("#iPProveedor").val());
    P_Publico = $.trim($("#iPPublico").val());
    P_Descuento = $.trim($("#iPDescuento").val());
    Descuento = $.trim($("#iDescuento").val());
    Gramaje = $.trim($("#iGramaje").val());
    DosisMG = $.trim($("#iDosis").val());
    Laboratorio = $.trim($("#iLaboratorio").val());
    Proveedor = $.trim($("#iProveedor").val());
    Activo = $.trim($("#ckActive").val());
    Caducidad = $.trim($("#iCaducidad").val());

    let url_ = opc == -1 ? "/meds/add" : "/meds/edit/" + opc;
    console.log(url_)

    $.ajax({
        url: url_,
        type: "POST",
        datatype: "json",
        data: {
            SustanciaActiva, Nombre,
            Saldo, Presentacion,
            P_Proveedor, P_Publico,
            P_Descuento, Descuento,
            Gramaje, DosisMG,
            Laboratorio, Proveedor,
            Caducidad, Activo
        },
        success: function (data) {
            tableMeds.ajax.reload(null, false);
        }
    });
    $('#modalCU').modal('hide');
})

$(document).on("click", "#btnNew", function () {
    opcion = -1;
    $("#formMeds").trigger("reset");
    $(".modal-header").css("background-color", "#C0DE00");
    $(".modal-header").css("color", "white");
    $(".modal-title").text('Alta Medicamento');
    $("#modalCU").modal('show');
});

$(document).on("click", "#btnEdit", function (e) {
    var row = $(this).closest("tr");
    let MedicamentoID = $(row["prevObject"][0]).attr('data-MedicamentoId');

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/meds/edit/' + MedicamentoID);
    xhttp.onload = function () {
        var res = xhttp.responseText;
        res = JSON.parse(res);

        var med = res.med;
        console.log(med)
        // Display on Modal
        $("#iSustanciaActiva").val(med.SustanciaActiva);
        $("#iNombre").val(med.Nombre);
        $("#iSaldo").val(med.Saldo);
        $("#iPresentacion").val(med.Presentacion);
        $("#iPProveedor").val(med.P_Proveedor);
        $("#iPPublico").val(med.P_Publico);
        $("#iDescuento").val(med.Descuento);
        $("#iPDescuento").val(med.P_Descuento);
        $("#iGramaje").val(med.Gramaje);
        $("#iDosis").val(med.DosisMG);
        $("#iLaboratorio").val(med.Laboratorio);
        $("#iProveedor").val(med.Proveedor);
        $("#ckActivo").val(med.Activo);
        $("#iCaducidad").val(med.Caducidad.split('T')[0]);
        priceBinding();

        opc = MedicamentoID;
    };
    xhttp.send();


    $(".modal-header").css("background-color", "#C0DE00");
    $(".modal-header").css("color", "white");
    $(".modal-title").text('Editar Medicamento');
    $("#modalCU").modal('show');
});

$(document).on("click", "#btnDelete", function () {
    var row_ = $(this).closest("tr");
    let MedicamentoID = $(row_["prevObject"][0]).attr('data-MedicamentoId');

    var answer = confirm("¿Está seguro de quere eliminar?");

    if (answer) {
        $.ajax({
            url: "/meds/delete/" + MedicamentoID,
            type: "POST",
            success: function () {
                tableMeds.row(row_.parents('tr')).remove().draw();
            }
        })
    }
})