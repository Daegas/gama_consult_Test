/**************************** FUNCTIONS *******************************************/
function tableDefinition(tableRef) {


    /******** COMMON ********/
    var table = commonTable();
    table.dom = '<"top mt-4 row" f><"row" <"col-12"t>><"bottom row" <"col-sm-5 col-md-4"i><"col-sm-6 col-md-6"p>>';
    table.columnDefs.push({
        "targets": [5, 10, 11, 12, 13, 15, 16],
        "searchable": false
    });


    /******** TBSEARCH ********/
    if (tableRef == "tbSearch") {
        var table1 = table;
        table1.lengthMenu = [7];
        table1.ajax = "/meds/get-dt";
        table1.columnDefs.push(
            {
                "targets": [4, 10, 14, 15, 16],
                "visible": false
            },
            {
                "targets": hiddenColsSearch,
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
                "targets": [10, 14],
                "visible": false
            },
            {
                "targets": hiddenColsAdd,
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
                            class="fa fa-close text-danger pointer" title="Eliminar">
                            </i>`;
            return html;

        };
        /******** INITIALIZE ********/
        tableAdd = $('#tbAdd').DataTable(table2);
    }
};
function fillModalCU(med, MedicamentoID) {
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
    priceBinding();
}

function localEntryUpdate(MedicamentoID, data_, quantity, saldo_) {
    sessionStorage.setItem(MedicamentoID, JSON.stringify(data_));
    if (quantity) { //Covers case where quantity field has been updated in ModalCreateUpdate
        entries[MedicamentoID] = quantity + "," + saldo_;
    }
    reloadAddTable();
}

/**************************** EVENTS *******************************************/
tableSearch = null;
tableAdd = null;
hiddenColsSearch = [4, 15, 16];
hiddenColsAdd = [];
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