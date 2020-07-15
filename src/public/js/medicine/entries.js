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

function fillModalCU(med, MedicamentoID) {
    $("#iSustanciaActiva").val(med.SustanciaActiva).prop("disabled", true);
    $("#iNombre").val(med.Nombre).prop("disabled", true);
    $("#iSaldo").val(entries[MedicamentoID].split(',')[1]).prop("disabled", true);
    $("#iQuantity").val(entries[MedicamentoID].split(',')[0]);
    $("#iPresentacion").val(med.Presentacion).prop("disabled", true);
    $("#iPProveedor").val(med.P_Proveedor);
    $("#iPPublico").val(med.P_Publico);
    $("#iDescuento").val(med.Descuento);
    $("#iPDescuento").val(med.P_Descuento);
    $("#iGramaje").val(med.Gramaje).prop("disabled", true);
    $("#iDosis").val(med.DosisMG).prop("disabled", true);
    $("#iLaboratorio").val(med.Laboratorio).prop("disabled", true);
    $("#iProveedor").val(med.Proveedor).prop("disabled", true);
    $("#ckActivo").val(med.Activo);
    med.Activo == "1"? $("#ckActivo").prop("checked", true) : $("#ckActivo").prop("checked", false);
    $("#iCaducidad").val(med.Caducidad.split('T')[0]);
    priceBinding();
}

function localEntryUpdate(MedicamentoID, data_, quantity, saldo_){
    sessionStorage.setItem(MedicamentoID, JSON.stringify(data_));
    if(quantity){ //Covers case where quantity field has been updated in ModalCreateUpdate
        entries[MedicamentoID] = quantity+","+saldo_;
    }
    reloadAddTable();
}

async function reloadAddTable(){
    url_ = "/meds/get-addTable/"+JSON.stringify(idList); //Build a new url with the actual idList
    await tableAdd.ajax.url(url_).load(null,false); //Reaload AJAX query
}

async function removeEntry(MedicamentoID, isDelete){
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
        sessionStorage.removeItem(MedicamentoID);
    } else {
        entries = {};
        sessionStorage.clear();
    }

    //Reload tableSearch
    if(!isDelete)
        tableSearch.ajax.reload(null,false);
}

/**************************** EVENTS *******************************************/

$(document).ready(function () {
    sessionStorage.clear();
    tabIndex = 0;
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
            {
                "data": null,
                render: function(data, type, row, meta){
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null){ //If the medicine had been locally modified
                        return item_.P_Proveedor;
                    } else {
                        return data[5];
                    }
                }
            },
            // 6-P_Publico
            {
                "data": null,
                render: function(data, type, row, meta){
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null){ //If the medicine had been locally modified
                        return item_.P_Publico;
                    } else {
                        return data[6];
                    }
                }
            },
            // 7-Descuento
            {
                "data": null,
                render: function(data, type, row, meta){
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null){ //If the medicine had been locally modified
                        return item_.Descuento;
                    } else {
                        return data[7];
                    }
                }
            },
            // 8-Caducidad
            {
                "data": null,
                render: function(data, type, row, meta){
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null){ //If the medicine had been locally modified
                        return item_.Caducidad;
                    } else {
                        return data[8];
                    }
                }
            },
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

    //FOCUS EVENT
    let busqueda = $("#tbSearch_filter input").val();
    if (e.keyCode == 9 && busqueda){
        row_ = tableSearch.row( tabIndex );
        row_.select();
        tabIndex += 1;
    }
});

$("body").on('focus.spf', "*", function(e) {
    console.log('foc', e)
    e.stopPropagation();
    e.preventDefault();
    if(e.currentTarget != $("#tbSearch_filter input")[0]){
        
        if(!$("#modalEntry").hasClass("show") && !$("#modalCU").hasClass("show")){
            $(this).blur();
        }
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
    if (idList.indexOf(id.toString()) == -1){
        idList.push(id); //Add MedicineID into idList
    } else {
        sessionStorage.removeItem(id); //If searchTable clicked on an item already stored on addTable, all changes will be reset.
    }

    $("#modalEntry").modal("hide");

    reloadAddTable();
});


// ********************* ADD TABLE EVENTS **************************
$(document).on("click", "#btnEdit", function (e) {
    var row = $(this).closest("tr");
    let MedicamentoID = $(row["prevObject"][0]).attr('data-MedicamentoId');

    let item_ = JSON.parse(sessionStorage.getItem(MedicamentoID)); 
    if (item_ != null) {//If medicine already in sessionStorage, which means previously getted by 'meds/getMed' method
        fillModalCU(item_, MedicamentoID);
    } else { //Otherwise, make request
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/meds/getMed/' + MedicamentoID);
        xhttp.onload = function () {
            var res = xhttp.responseText;
            res = JSON.parse(res);
            // Display on Modal
            fillModalCU(res.med, MedicamentoID);
        };
        xhttp.send();
    }
    
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
        removeEntry(MedicamentoID, true);
    }
});

$(document).on("click", "#btnCompleteEntry", function () {
    
    //Get Entries which had been updated by other fields
    fullEntries = {}
    for(let i=0; i< sessionStorage.length; i++){
        key_ = sessionStorage.key(i)
        fullEntries[key_] = sessionStorage.getItem(key_)
    }

    let all_entries = {}
    all_entries[0] = entries;
    all_entries[1] = fullEntries;
    data_ = JSON.stringify(all_entries) //All entries
    $.ajax({
        url: "/meds/entriesUpdate",
        type: "POST",
        datatype: "json",
        data: {data_},
        success: function (res) {
            let message = " EDITADO ";
            messageModal($("#modalMessageSuccess"), true, message);  
            removeEntry();
        },
        error: function(res){
            let message = res.responseJSON.code + '\n' + res.responseJSON.sqlMessage;
            messageModal($("#modalMessageError"), false, message);
        }
    });
});

//************************ MESSAGE EVENTS ***************************/
$('.modal-message').on('show.bs.modal', function (e) {
    x = "bounce"
    $('.modal-message .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
});