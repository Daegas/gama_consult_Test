/**************************** FUNCTIONS *******************************************/
hiddenColsMeds = []
showActive = true;
function tableDefinition(tableRef = "tableMeds") {
    var table = commonTable();

    /******** PERSONALIZE ********/
    table.dom = '<"top mt-4 row" f<"toolbar mx-auto mb-2">prt><"bottom row" <"col-sm-12 col-md-5"i> <"col-sm-12 col-md-2"l>>';
    /*Function to display content in 'toolbar' class*/
    table.fnInitComplete = function () {
        html = `
        <button id="btnNew" class="btn btn-info rounded">
            <i class="fa fa-plus-circle"></i> Nuevo
        </button>
        `;
        $('div.toolbar').html(html);
    };
    table.ajax = "/meds/get-dt/"+ showActive;
    table.lengthMenu = [5, 10, 25, 50];
    table.order = [[1, 'asc'], [0, 'asc']];
    table.columnDefs.push({
        "targets": [4],
        "visible": false
    },
        {
            "targets": hiddenColsMeds,
            "visible": false
        },
        {
            "targets": [10, 11, 12, 13, 15, 16],
            "searchable": false
        }
    );

    /******** INITIALIZE ********/
    tableMeds = $('#tbMeds').DataTable(table);
}

/******** InventoryTable ********/
function reloadInventoryTable() {/*Columns*/
    url_ = "/meds/get-dt/" + JSON.stringify(showActive); 
    tableMeds.ajax.url(url_).load(null, false);
}

setInterval(function () {
    reloadInventoryTable();
}, 10000);

/**************************** EVENTS *******************************************/
$(document).ready(function () {
    tableDefinition();
});


$('.modal-message').on('show.bs.modal', function (e) {
    x = "bounce"
    $('.modal-message .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
});
/******** FOCUS ********/
var inputSearch="#tbMeds_filter input"

window.onload = function () {
    $(inputSearch).focus();
};
document.getElementById('Inventario_item').style.color = '#333333';

$(document).on('keyup', function (e) {
    if (e.keyCode == 27) {
        $(inputSearch).focus().select();
    }
});
$(document).on('click', inputSearch, function (e) {
        $(inputSearch).select();
  
});

/******** BTN_NEW ********/
$(document).on("click", "#btnNew", function () {
    $("#formMeds").trigger("reset");
    $(".modal-header").css("background-color", "#C0DE00");
    $(".modal-header").css("color", "white");
    $(".modal-title").text('Alta Medicamento');
    $(".modal-option").val(-1);
    $("#modalCU").modal('show');
});

/******** BTN_EDIT ********/
$(document).on("click", "#btnEdit", function (e) {
    $("#formMeds").trigger("reset");

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
        med.Activo == "1" ? $("#ckActivo").prop("checked", true) : $("#ckActivo").prop("checked", false);
        $("#iCaducidad").val(med.Caducidad.split('T')[0]);
        $("#iCodigo").val(med.Codigo=="-POR ASIGNAR-"?"":med.Codigo);
        priceBinding();

    };
    xhttp.send();


    $(".modal-header").css("background-color", "#C0DE00");
    $(".modal-header").css("color", "white");
    $(".modal-title").text('Editar Medicamento');
    $(".modal-option").val(MedicamentoID);
    $("#modalCU").modal('show');
});

/******** BTN_DELETE ********/
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
                reloadInventoryTable();
            },
            error: function (res) {
                let message = res.responseJSON.code + '\n' + res.responseJSON.sqlMessage;
                messageModal($("#modalMessageError"), false, message);
            }
        })
    }
})