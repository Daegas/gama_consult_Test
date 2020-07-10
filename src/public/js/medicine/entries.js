    /**************************** FUNCTIONS *******************************************/
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

async function reloadAddTable(){
    url_ = "/meds/get-addTable/"+JSON.stringify(idList); //Build a new url with the actual idList
    await tableAdd.ajax.url(url_).load(null,false); //Reaload AJAX query
}

async function reloadEntry(MedicamentoID, isDelete){
    //Update idList
    if(MedicamentoID) {
        const index = idList.indexOf(MedicamentoID);
        if (index > -1) 
            idList.splice(index, 1);
    } else {
        idList=["0"];
    }
    reloadAddTable();
    //Update 'entries' Object
    if(MedicamentoID) {
        delete entries[MedicamentoID];
    } else {
        entries = {};
    }

    //Reload tableSearch
    if(!isDelete)
        tableSearch.ajax.reload(null,false);
}

/**************************** EVENTS *******************************************/

$(document).ready(function () {

    // ********* SEARCH TABLE ***********
    tableSearch = $('#tbSearch').DataTable({
        dom: '<"top mt-4 row" frt><"bottom row" <"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        select: {
            style: 'single'
        },
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
                "targets": [ 9, 10],
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
    idList=["0"]; //List of tableSearch selected elements, to show in tableAdd
    tableAdd = $('#tbAdd').DataTable({
        dom: '<"top mt-4 row" rt><"bottom row" <"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        "pagingType": "full",
        "lengthMenu": [7],
        "paging": true,
        "responsive": true,
        "ordering": true,
        "info": true,
        // "autoWidth": false,
        "serverSide": true,
        "ajax": "/meds/get-addTable/"+JSON.stringify(idList),
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
            // 3-Cantidad
            {   
                "data": null,
                "render": function (data, type, row, meta){
                    let entry_ = entries[data[0]];
                    return entry_.split(',')[0]; //Display 'Quantity'
                }
            },
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

// ********************* SEARH TABLE EVENTS **************************
//Manage selected Items
$('#tbSearch').on( 'click', 'tr', function () {
} );

$(document).on('keyup', function(e) {
    let rowSelected = tableSearch.row( { selected: true } ).data();
    if (e.keyCode == 13 && rowSelected){ //When a row is Selected and 'Enter' pressed
        $("#formEntry").trigger("reset");
        $("#iID").val(rowSelected[0]);
        $("#iNombreE").val(rowSelected[1]);
        $("#iSaldoAE").val(rowSelected[3]);
        $("#modalEntry").modal("show");
    }
});

$(document).on("click", "#btnAdd", function(e){
    let rowSelected = tableSearch.row( { selected: true } ).data();
    if (rowSelected){
        $("#formEntry").trigger("reset");
        $("#iID").val(rowSelected[0]);
        $("#iNombreE").val(rowSelected[1]);
        $("#iSaldoAE").val(rowSelected[3]);
        $("#modalEntry").modal("show");
    }
});

// ********************* MODAL ENTRIES EVENTS **************************
let entries={};
$(document).on('click', "#btnAddEntry", function(e) {
    e.preventDefault();

    let id = $("#iID").val();
    entries[id] = $("#iCantidad").val()+','+$("#iSaldoAE").val();
    idList.push(id); //Add MedicineID into idList

    $("#modalEntry").modal("hide");

    reloadAddTable();
});

// ********************* ADD TABLE EVENTS **************************
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
        $("#iQuantity").val(entries[MedicamentoID].split(',')[0]);
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
        reloadEntry(MedicamentoID, true);
    }
});

$(document).on("click", "#btnCompleteEntry", function () {
    $.ajax({
        url: "/meds/entriesUpdate",
        type: "POST",
        datatype: "json",
        data: entries,
        success: function (res) {
            // req.flash('success', 'Med updated successfully');
            let message = " EDITADO ";
            messageModal($("#modalMessageSuccess"), true, message);  
            reloadEntry();
        },
        error: function(res){
            let message = res.responseJSON.code + '\n' + res.responseJSON.sqlMessage;
            messageModal($("#modalMessageError"), false, message);
        }
    });
    // reloadEntry();
});

//************************ MESSAGE EVENTS ***************************/
$('.modal-message').on('show.bs.modal', function (e) {
    x = "bounce"
    $('.modal-message .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
});