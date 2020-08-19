/**************************** FUNCTIONS *******************************************/
function tableDefinition(tableRef) {


    /******** COMMON ********/
    var table = commonTable();
    table.dom = '<"top mt-4 row" f<"mx-auto mb-2">prt><"bottom row" <"col-sm-12 col-md-5"i> <"col-sm-12 col-md-2"l>>';
    table.columnDefs.push({
        "targets": [5, 10, 11, 12, 13, 15, 16],
        "searchable": false
    });


    /******** TBSEARCH ********/
    if (tableRef == "tbSearch") {
        var table1 = table;
        table1.lengthMenu = [7];
        table1.ajax = "/meds/get-dt/"+showActive;
        table1.columnDefs.push(
            {
                "targets": [4, 15, 16], //SaldoAnterior, Edit, Delete  - Mandatory Hidden Columns for tbSearch
                "visible": false
            },
            {
                "targets": hiddenColsSearch, //Optional Hidden Columns
                "visible": false
            }
        );
        /******** INITIALIZE ********/
        tableSearch = $('#tbSearch').DataTable(table1);

    }
    /******** TBADD ********/
    else {
        var table2 = table;
        table2.ajax = "/meds/get-addTable/" + JSON.stringify(idList);
        table2.alengthMenu = ["All"];

        table2.columnDefs.push(
            {
                "targets": hiddenColsAdd, //Optional Hidden Columns
                "visible": false
            }
        );
        /*Columns Content*/
        //Display 'Saldo'
        table2.columns[4] = {
            "data": null,
            "render": function (data, type, row, meta) {
                let entry_ = entries[data[0]];
                return entry_.split(',')[1];
            }
        };
        //Display 'Quantity'
        table2.columns[5] = {
            "data": null,
            "render": function (data, type, row, meta) {
                let entry_ = entries[data[0]];
                return entry_.split(',')[0];
            }
        };
        //Display 'P_Proveedor'
        table2.columns[10] = {
            "data": null,
            render: function (data, type, row, meta) {
                let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                if (item_ != null) { //If the medicine had been locally modified
                    return item_.P_Proveedor;
                } else {
                    return data[10];
                }
            }
        };
        //Display 'P_Publico'
        table2.columns[11] = {
            "data": null,
            render: function (data, type, row, meta) {
                let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                if (item_ != null) { //If the medicine had been locally modified
                    return item_.P_Publico;
                } else {
                    return data[11];
                }
            }
        };
        //Display 'Descuento'
        table2.columns[12] = {
            "data": null,
            render: function (data, type, row, meta) {
                let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                if (item_ != null) { //If the medicine had been locally modified
                    return item_.Descuento;
                } else {
                    return data[12];
                }
            }
        };
        //Change icon
        table2.columns[16].render = function (data, type, row, meta) {
            let html = `
                            <i id="btnDelete" data-MedicamentoID=${data[16]}
                            class="fa fa-close icontable text-danger pointer" title="Eliminar">
                            </i>`;
            return html;

        };
        /******** INITIALIZE ********/
        tableAdd = $('#tbAdd').DataTable(table2);
    }
};
function fillModalCU(med, MedicamentoID) {
    $("#formMeds").trigger("reset");
    
    $(".modal-option").val(MedicamentoID);
    $("#iSustanciaActiva").val(med.SustanciaActiva).prop("disabled", true);
    $("#iNombreComercial").val(med.NombreComercial).prop("disabled", true);
    $("#iSaldo").val(entries[MedicamentoID].split(',')[1]);
    $("#iQuantity").val(entries[MedicamentoID].split(',')[0]);
    $("#iPresentacion").val(med.Presentacion).prop("disabled", true);
    $("#iPProveedor").val(med.P_Proveedor);
    $("#iPPublico").val(med.P_Publico);
    $("#iDescuento").val(med.Descuento);
    $("#iPDescuento").val(med.P_Descuento);
    $("#iContenido").val(med.Contenido).prop("disabled", true);
    $("#iDosis").val(med.DosisMG).prop("disabled", true);
    $("#iLaboratorio").val(med.Laboratorio).prop("disabled", true);
    $("#iProveedor").val(med.Proveedor).prop("disabled", true);
    $("#ckActivo").val(med.Activo);
    med.Activo == "1" ? $("#ckActivo").prop("checked", true) : $("#ckActivo").prop("checked", false);
    $("#iCaducidad").val(med.Caducidad.split('T')[0]);
    $("#iCodigo").val(med.Codigo=="-POR ASIGNAR-"?"":med.Codigo);
    priceBinding();
}

function localEntryUpdate(MedicamentoID, data_, quantity, saldo_) {
    sessionStorage.setItem(MedicamentoID, JSON.stringify(data_));
    if (quantity) { //Covers case where quantity field has been updated in ModalCreateUpdate
        entries[MedicamentoID] = quantity + "," + saldo_;
    }
    if($("#modalEntry").hasClass("show")){
        $("#iCantidad").val($("#iQuantity").val());
        $("#iSaldoAE").val($("#iSaldo").val());
        $("#formEntry").trigger("submit");
    }else{
        reloadAddTable();
    }
}

function goToModalUpdate(MedicamentoID,requ,item_){
    // $("#modalEntry").close(); 

    if (requ==false) {//If medicine already in sessionStorage, which means previously fetcheds by 'meds/getMed' method
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
    $("#modalCU").modal('show');
}



/**************************** EVENTS *******************************************/
showActive = true;
tableSearch = null;
tableAdd = null;
hiddenColsSearch = [10, 14]; //Default Hidden Columns - This could be costumize by users
hiddenColsAdd = [10, 14]; //Default Hidden Columns - This could be costumize by users
$(document).ready(function () {
    // ********* FUNCTIONALITY ***********
    sessionStorage.clear();
    tabIndex = 0;
    // ********* SEARCH TABLE ***********
    tableDefinition("tbSearch");
    // ************ ADD TABLE **************
    idList = ["0"]; //List of tableSearch selected elements, to show in tableAdd
    tableDefinition("tbAdd");
});



// ********************* MODAL ENTRIES EVENTS **************************
let entries = {};
$(document).on('click', '#btnEditModal', function (e) {
    e.preventDefault();
    e.stopPropagation();
    entries[id] = $("#iCantidad").val() + ',' + $("#iSaldoAE").val();

    let ID = $("#iID").val();

    goToModalUpdate(ID,true, null);    
});

// ********************* ADD TABLE EVENTS **************************
$(document).on("click", "#btnEdit", function (e) {
    var row = $(this).closest("tr");
    let ID = $(row["prevObject"][0]).attr('data-MedicamentoId');

    let item_ = JSON.parse(sessionStorage.getItem(ID));
    if (item_ != null) {//If medicine already in sessionStorage, which means previously getted by 'meds/getMed' method
        goToModalUpdate(ID, false, item_);
    } else { //Otherwise, make request
        goToModalUpdate(ID,true, item_);
    }
   
});