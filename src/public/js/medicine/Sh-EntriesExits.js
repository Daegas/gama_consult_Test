/**************************** FUNCTIONS *******************************************/
async function reloadSearchTable(){
    url_ = "/meds/get-dt/" + JSON.stringify(showActive); //Build a new url
    await tableSearch.ajax.url(url_).load(null, false); //Reaload AJAX query
}

function entryModal(rowSelected) {
    id = rowSelected[0];
    if (idList.indexOf(id.toString()) == -1) {
        $("#formEntry").trigger("reset");
        $("#iID").val(rowSelected[0]);
        $("#iNombreE").val(rowSelected[2]);
        $("#iSaldoAE").val(rowSelected[4]);
        $("#modalEntry").modal("show");
        let source = window.location.pathname.split("/")[2];
        $("#formEntry").addClass(source);
    } else if (!$("#modalEntry").hasClass("show")) {
        alert('El elemento ya se encuntra en la lista "Medicamentos a Agregar". Use la segunda tabla para editar.');
    }
}

function reloadAddTable(source="") {
    url_ = "/meds/get-addTable/" + JSON.stringify(idList); //Build a new url with the actual idList
    tableAdd.ajax.url(url_).load(null, false); //Reaload AJAX query  

}

function DEV() {
    $("#iSaldoAE").val(2);
    $("#iCantidad").val(2);
    let id = 105;
    entries[id] = $("#iCantidad").val() + ',' + $("#iSaldoAE").val();


    let source = $(this).hasClass("entries")? "entries": "exits";
    if (idList.indexOf(id.toString()) == -1)
        idList.push(id); //Add MedicineID into idList
    FocusInput_tbSearch();
    reloadAddTable(source);
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

function GoToModalQuantity() {
    let rowSelected = tableSearch.row({ selected: true });
    if (rowSelected.data()) {
        entryModal(rowSelected.data());
        rowSelected.select(false);
    }
}

function FocusInput_tbSearch(){
    $(inputSearch).focus().select();
    const element = document.getElementById('#tbSearch_filter');

    if (element) {
        window.scroll({
            top: element.scrollTop,
            behavior: 'smooth',
        }) 
    }
}
/**************************** VARIABLES *******************************************/
var inputSearch="#tbSearch_filter input"


/**************************** SEARCH TABLE EVENTS *******************************************/
$(document).ready(function () {
    $(inputSearch).focus();
    //Reset when search is modified
    $(inputSearch).on('keyup', function () {
        tabIndex =0;
    });
    $()
});

// Manage selected Items
$('#tbSearch').on( 'click', 'tr', function () {
    tabIndex = tableSearch.row(this).index();
    GoToModalQuantity();
} );

$(document).on('keyup', function (e) {
    let rowSelected = tableSearch.row({ selected: true });
    
    if (e.keyCode == 13 && rowSelected.data()) { //When a row is Selected and 'Enter' pressed
        GoToModalQuantity()
    }

    if(e.shiftKey && e.keyCode == 13) { 
        var data_ = tableAdd.rows().data();
        if (data_.length >= 1) {
            $("#btnCompleteEntry").click();
        } 
    }

    /******** Select with tab ********/
    if (!$("#modalEntry").hasClass("show") && !$("#modalCU").hasClass("show")) {
        if (e.keyCode == 9 && $(inputSearch).focus()) {
            row_ = tableSearch.row(tabIndex);
            row_.select();
            tabIndex += 1;
        }
    }
    if (e.keyCode == 27) {
        FocusInput_tbSearch();
    }

});


/******** FOCUS ********/
$("body").on('focus.spf', "*", function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.currentTarget != $(inputSearch)[0]) {
        if (!$("#modalEntry").hasClass("show") && !$("#modalCU").hasClass("show")) {
            $(this).blur();
        }
    }
});


/**************************** MODAL QUANTITY EVENTS *******************************************/
$("#formEntry").submit(function (e) {
    e.preventDefault();
    e.stopPropagation();

        
    $("#modalEntry").modal("hide"); 
    let id = $("#iID").val();
    entries[id] = $("#iCantidad").val() + ',' + $("#iSaldoAE").val();


    let source = $(this).hasClass("entries")? "entries": "exits";
    if (idList.indexOf(id.toString()) == -1)
        idList.push(id); //Add MedicineID into idList
    FocusInput_tbSearch();
    reloadAddTable(source);
        
});

document.getElementById("#ModalQuantityMessage").style.display='none';

/**************************** ADD TABLE EVENTS *******************************************/
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
    for (let i = 0; i < sessionStorage.length; i++) {
        key_ = sessionStorage.key(i)
        fullEntries[key_] = sessionStorage.getItem(key_)
    }

    let all_entries = {}
    all_entries[0] = entries;
    all_entries[1] = fullEntries;
    all_entries[2] = window.location.pathname.split("/")[2] == "exits";
    console.log(entries)
    console.log(fullEntries)
    console.log(all_entries[2])
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



