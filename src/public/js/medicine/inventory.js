/**************************** FUNCTIONS *******************************************/
function reloadAJAX() {
    tableMeds.ajax.reload(null,false);
}

setInterval( function () {
    reloadAJAX();
}, 2000 );


function messageModal(modal_, blink, message){
    modal_.modal("show");
    $('.modal-backdrop').css("opacity", "0");

    if(blink){
        $(".message").text(message);
        setTimeout( ()=> {
            modal_.modal("hide");
        }, 3000);
    } else{
        $(".message-details").text(message);
    }
}


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


/**************************** EVENTS *******************************************/
$(document).ready(function () {
    tableMeds = $('#tbMeds').DataTable({
        dom: '<"top mt-4 row" l <"toolbar mx-auto mb-2"> frt><"bottom row" <"col-sm-12 col-md-5"i> <"col-sm-12 col-md-7"p>>', //Se agrega clase 'toolbar' a la plantilla
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
                "sNext": ">>",
                "sPrevious": "<<"
            },
            "oAria": {
                "sSortAscending": ": Ordenar ascendente",
                "sSortDescending": ": Ordenar descendente"
            },
        },
        "columnDefs":[
            {
                "targets": [3, 5, 6, 7, 9,10],
                "searchable": false
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
            {
                "render": function(data, type, row, meta) {
                    let formatData = data.split("T")[0].split("-").reverse().join("/");
                    return formatData
                }
            },
            //9-Edit button
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
            //10-Delete button
            {   
                "data": null,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    let html = `
                            <i id="btnDelete" data-MedicamentoID=${data[10]}
                            class="fa fa-trash text-danger pointer" title="Eliminar">
                            </i>`;
                    return html;
                }
            }
        ]
    });
});

$('.modal-message').on('show.bs.modal', function (e) {
    x = "bounce"
    $('.modal-message .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
});

$(document).on("click", "#btnNew", function () {
    $("#formMeds").trigger("reset");
    $(".modal-header").css("background-color", "#C0DE00");
    $(".modal-header").css("color", "white");
    $(".modal-title").text('Alta Medicamento');
    $(".modal-secret").val(-1);
    $("#modalCU").modal('show');
});

$(document).on("click", "#btnEdit", function (e) {
    var row = $(this).closest("tr");
    let MedicamentoID = $(row["prevObject"][0]).attr('data-MedicamentoId');

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/meds/getMed/' + MedicamentoID);
    xhttp.onload = function () {
        var res = xhttp.responseText;
        res = JSON.parse(res);

        var med = res.med;
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
        med.Activo == "1"? $("#ckActivo").prop("checked", true) : $("#ckActivo").prop("checked", false);
        $("#iCaducidad").val(med.Caducidad.split('T')[0]);
        priceBinding();

        opc = MedicamentoID;
    };
    xhttp.send();


    $(".modal-header").css("background-color", "#C0DE00");
    $(".modal-header").css("color", "white");
    $(".modal-title").text('Editar Medicamento');
    $(".modal-secret").val(MedicamentoID);
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
            success: function (res) {
                tableMeds.row(row_.parents('tr')).remove().draw();
                messageModal($("#modalMessageSuccess"), true, "ELIMINADO");  
            },
            error: function (res){
                let message = res.responseJSON.code + '\n' + res.responseJSON.sqlMessage;
                messageModal($("#modalMessageError"), false, message);
            }
        })
    }
})