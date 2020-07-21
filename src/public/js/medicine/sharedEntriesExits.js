/**************************** FUNCTIONS *******************************************/
function messageModal(modal_, blink, message) {
    modal_.modal("show");
    $('.modal-backdrop').css("opacity", "0");

    if (blink) {
        $(".message").text(message);
        setTimeout(() => {
            modal_.modal("hide");
        }, 3000);
    } else {
        $(".message-details").text(message);
    }
}

function entryModal(rowSelected) {
    id = rowSelected[0];
    if (idList.indexOf(id.toString()) == -1) {
        $("#formEntry").trigger("reset");
        $("#iID").val(rowSelected[0]);
        $("#iNombreE").val(rowSelected[2]);
        $("#iSaldoAE").val(rowSelected[3]);
        $("#modalEntry").modal("show");
    } else if (!$("#modalEntry").hasClass("show")) {
        alert('El elemento ya se encuntra en la lista "Medicamentos a Agregar". Use la segunda tabla para editar.');
    }
}

function fillModalCU(med, MedicamentoID) {
    $("#iSustanciaActiva").val(med.SustanciaActiva).prop("disabled", true);
    $("#iNombre").val(med.Nombre).prop("disabled", true);
    $("#iSaldo").val(entries[MedicamentoID].split(',')[1]);
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
    med.Activo == "1" ? $("#ckActivo").prop("checked", true) : $("#ckActivo").prop("checked", false);
    $("#iCaducidad").val(med.Caducidad.split('T')[0]);
    priceBinding();
}

async function reloadAddTable() {
    url_ = "/meds/get-addTable/" + JSON.stringify(idList); //Build a new url with the actual idList
    await tableAdd.ajax.url(url_).load(null, false); //Reaload AJAX query
}

function removeEntry(MedicamentoID, isDelete) {
    //Update idList
    if (MedicamentoID) {
        const index = idList.indexOf(MedicamentoID);
        if (index > -1)
            idList.splice(index, 1);
    } else {
        idList = ["0"];
    }
    reloadAddTable();
    //Update 'entries' Object
    if (MedicamentoID) {
        delete entries[MedicamentoID];
        sessionStorage.removeItem(MedicamentoID);
    } else {
        entries = {};
        sessionStorage.clear();
    }

    //Reload tableSearch
    if (!isDelete)
        tableSearch.ajax.reload(null, false);
}

// ********************* SEARH TABLE EVENTS **************************
window.onload = function () {
    $("#tbSearch_filter input").focus();
    //Reset when search is modified
    $("#tbSearch_filter input").on('keyup', function () {
        tabIndex =0;
    });
};

// Manage selected Items
$('#tbSearch').on( 'click', 'tr', function () {
    tabIndex = tableSearch.row(this).index();
} );

$(document).on("click", "#btnAdd", function (e) {
    let rowSelected = tableSearch.row({ selected: true });
    if (rowSelected.data()) {
        entryModal(rowSelected.data());
        rowSelected.select(false);
        $("#tbSearch_filter input").focus();

    }
});

$(document).on('keyup', function (e) {
    let rowSelected = tableSearch.row({ selected: true });

    if(e.keyCode == 27){
        $("#tbSearch_filter input").focus();
    }
    if (e.keyCode == 13 && rowSelected.data()) { //When a row is Selected and 'Enter' pressed
        entryModal(rowSelected.data());
        rowSelected.select(false);
        $("#tbSearch_filter input").focus();
    }

    //FOCUS EVENT
    if (!$("#modalEntry").hasClass("show") && !$("#modalCU").hasClass("show")) {
        if (e.keyCode == 9 && $("#tbSearch_filter input").focus()) {
            row_ = tableSearch.row(tabIndex);
            row_.select();
            tabIndex += 1;
        }
    }

});

$("body").on('focus.spf', "*", function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.currentTarget != $("#tbSearch_filter input")[0]) {
        if (!$("#modalEntry").hasClass("show") && !$("#modalCU").hasClass("show")) {
            $(this).blur();
        }
    }
});
// ********************* MODAL ENTRIES EVENTS **************************
$(document).on('click', "#btnAddEntry", function (e) {
    e.preventDefault();
    e.stopPropagation();

    let id = $("#iID").val();
    entries[id] = $("#iCantidad").val() + ',' + $("#iSaldoAE").val();
    if (idList.indexOf(id.toString()) == -1)
        idList.push(id); //Add MedicineID into idList

    $("#modalEntry").modal("hide"); 
    $("#tbSearch_filter input").focus();

    reloadAddTable();
});

// ********************* ADD TABLE EVENTS **************************
$(document).on("click", "#btnDelete", function () {
    var row_ = $(this).closest("tr");
    let MedicamentoID = $(row_["prevObject"][0]).attr('data-MedicamentoId');

    var answer = confirm("¿Está seguro de quere eliminar?");

    if (answer) {
        removeEntry(MedicamentoID, true);
    }
});

$(document).on("click", "#btnCompleteEntry", function () {
    console.log('here')

    //Get Entries which had been updated by other fields
    fullEntries = {}
    for (let i = 0; i < sessionStorage.length; i++) {
        key_ = sessionStorage.key(i)
        fullEntries[key_] = sessionStorage.getItem(key_)
    }

    let all_entries = {}
    all_entries[0] = entries;
    all_entries[1] = fullEntries;
    all_entries[2] = window.location.pathname.split("/")[2] == "exits";
    data_ = JSON.stringify(all_entries) //All entries
    $.ajax({
        url: "/meds/entriesUpdate",
        type: "POST",
        datatype: "json",
        data: { data_ },
        success: function (res) {
            let message = " EDITADO ";
            messageModal($("#modalMessageSuccess"), true, message);
            removeEntry();
        },
        error: function (res) {
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