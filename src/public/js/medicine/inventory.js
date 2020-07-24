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

/**************************** EVENTS *******************************************/
$(document).ready(function () {
    tableMeds = $('#tbMeds').DataTable({
        dom: '<"top mt-4 row" l <"toolbar mx-auto mb-2"> frt><"bottom row" <"col-sm-12 col-md-5"i> <"col-sm-12 col-md-7"p>>', //Se agrega clase 'toolbar' a la plantilla
        fnInitComplete: function () { //Function to display content in 'toolbar' class
            html = `
            <button id="btnNew" class="btn btn-info rounded">
                <i class="fa fa-plus-circle"></i> Nuevo
            </button>
            `;
            $('div.toolbar').html(html);
        },
        select: {
            style: 'single'
        },
        "pagingType": "full",
        "lengthMenu": [5, 10, 25, 50],
        "paging": true,
        "responsive":true,
        "ordering": true,
        "info": true,
        // "autoWidth": false,
        "order": [[ 1, 'asc' ], [ 0, 'asc' ]],
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
                "targets": [1,2],
                "width":200,
                "targets": [0,3, 5,6 ,7],
                "width":30,
                "targets": [3, 5, 6, 7, 9,10],
                "searchable": false,
                "targets": [4],
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
                "data": null,
                "render": function(data, type, row, meta) {
                    return formatName(data);
                }
            },
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
                    return formatDate(data);
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
window.onload = function () {
    $("#tbMeds_filter input").focus();
};
$(document).on ('keyup', function(e){
    if(e.keyCode == 27){
        $("#tbMeds_filter input").focus();
    }
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
    $(".modal-option").val(-1);
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
        $("#iNombreComercial").val(med.NombreComercial);
        $("#iSaldo").val(med.Saldo);
        $("#iPresentacion").val(med.Presentacion);
        $("#iPProveedor").val(med.P_Proveedor);
        $("#iPPublico").val(med.P_Publico);
        $("#iDescuento").val(med.Descuento);
        $("#iPDescuento").val(med.P_Descuento);
        $("#iContenido").val(med.Contenido);
        $("#iDosis").val(med.DosisMG);
        $("#iLaboratorio").val(med.Laboratorio);
        $("#iProveedor").val(med.Proveedor);
        $("#ckActivo").val(med.Activo);
        med.Activo == "1"? $("#ckActivo").prop("checked", true) : $("#ckActivo").prop("checked", false);
        $("#iCaducidad").val(med.Caducidad.split('T')[0]);
        priceBinding();

    };
    xhttp.send();


    $(".modal-header").css("background-color", "#C0DE00");
    $(".modal-header").css("color", "white");
    $(".modal-title").text('Editar Medicamento');
    $(".modal-option").val(MedicamentoID);
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