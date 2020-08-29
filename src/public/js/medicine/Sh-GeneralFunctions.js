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
    for(let i=0; i< 15; i++) {
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

$(".btnActivos").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    let this_ = $(this)
    let tableRef = this_[0].id.split('_')[1];
    if(this_.hasClass("active")){
        this_.removeClass("active").addClass("no-active").removeClass("btn-info").addClass("btn-secondary");
        this_[0].innerHTML = '<i class="fa fa-toggle-off pointer" title="Activos" aria-hidden="true"></i><span class="sr-only">Activos</span>';
    } else {
        this_.removeClass("no-active").addClass("active").removeClass("btn-secondary").addClass("btn-info");
        this_[0].innerHTML = '<i class="fa fa-toggle-on pointer" title="Activos" aria-hidden="true"></i><span class="sr-only">Activos</span> Activos';
    }

    showActive = !showActive;
    if(tableRef=="tbMeds"){
        reloadInventoryTable();
    } else {
        reloadSearchTable();
    }
    
});
