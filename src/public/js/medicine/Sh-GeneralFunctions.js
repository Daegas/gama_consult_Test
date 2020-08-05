/**************************** FUNCTIONS *******************************************/
function formatDate(data) {
    let formatData = data.split("T")[0].split("-").reverse();
    let date_ = [formatData[1], formatData[2]].join('/');
    return date_;
}

/**************************** EVENTS *******************************************/

/******** HIDE COLUMNS ********/
$(document).on("click", ".btnColumns", function (e){
    let tableRef = this.id.slice(6, this.id.length);
    $("#modalColumns_"+tableRef).modal("show");

    //Get Hidden Columns list
    if(tableRef=="tbMeds"){
        hiddenCols = hiddenColsMeds;
    } else if(tableRef=="tbSearch"){
        hiddenCols = hiddenColsSearch;
    } else {
        hiddenCols = hiddenColsAdd;
    }

    //Fill checkboxes
    newhiddenCols = [];
    for(let i=0; i< 14; i++) {
        colID = $("#col_"+i+"_"+tableRef);
        if(hiddenCols.indexOf(i) > -1){
            colID.prop("checked", false);
            newhiddenCols.push(i);
        } else {
            colID.prop("checked", true);
        }
    }
});


$(document).on("click", ".checkbx_column", function (e) { //Checkbox click
    tableRef = this.id.split("_")[2];
    colRef = parseInt(this.id.split("_")[1]);

    if(e.target.checked){
        const index = newhiddenCols.indexOf(colRef);
        if (index > -1)
            newhiddenCols.splice(index, 1);
    } else {
        newhiddenCols.push(colRef);
    }
});

$(".formColumns").submit( function(e) {
    e.preventDefault();
    e.stopPropagation();

    tableRef = this.id.split("_")[1];

    if(tableRef=="tbMeds"){
        hiddenColsMeds = newhiddenCols;
        tableMeds.destroy();
    } else if(tableRef=="tbSearch"){
        hiddenColsSearch = newhiddenCols;
        tableSearch.destroy();
    } else {
        hiddenColsAdd = newhiddenCols;
        tableAdd.destroy();
    }

    tableDefinition(tableRef);
    $("#modalColumns_"+tableRef).modal("hide");
});

$(".btnCancelColumns").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    tableRef = this.id.split("_")[1];
    $("#modalColumns_"+tableRef).modal("hide");
});