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
                            class="fa fa-close icontable text-danger pointer" title="Eliminar">
                            </i>`;
            return html;

        };
        /******** INITIALIZE ********/
        tableAdd = $('#tbAdd').DataTable(table2);
    }
};


/**************************** EVENTS *******************************************/
showActive = true;
tableSearch = null;
tableAdd = null;
hiddenColsSearch = [10, 14]; //Default Hidden Columns - This could be costumize by users
hiddenColsAdd = [10, 14]; //Default Hidden Columns - This could be costumize by users

$(document).ready(function () {
    // ********* FUNCTIONALITY ***********
    tabIndex = 0;
    // ********* TABLES ***********
    tableDefinition("tbSearch");
    idList = ["0"]; //List of tableSearch selected elements, to show in tableAdd
    tableDefinition("tbAdd");
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
    $("#iSaldoAE").attr("disabled", false)
    $("#iSaldoAE").val(entries[rowSelected[0]].split(",")[1]);

    $("#modalEntry").modal("show");
});

$('#tbAdd').on('click', 'tr', function () {
    _addSelectedRow = tableAdd.row(this);
});