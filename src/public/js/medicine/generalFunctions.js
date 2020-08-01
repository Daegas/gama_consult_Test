/**************************** FUNCTIONS *******************************************/
function formatDate(data) {
    let formatData = data.split("T")[0].split("-").reverse();
    let date_ = [formatData[1], formatData[2]].join('/');
    return date_;
}

/**************************** EVENTS *******************************************/

//Hide Columns
hiddenCols = [] //Defined as global variable
$(document).on("click", ".btnColumns", function (e){
    let tableRef = this.id.slice(6, this.id.length);
    $("#modalColumns_"+tableRef).modal("show");

    if(tableRef=="tbMeds"){
        hiddenCols = hiddenColsMeds;
    } else if(tableRef=="tbShow"){
        hiddenCols = hiddenColsShow;
    } else {
        hiddenCols = hiddenColsAdd;
    }
});


$(document).on("click", ".column", function (e) {
    tableRef = this.id.split("_")[2];
    colRef = parseInt(this.id.split("_")[1]);

    if(e.target.checked){
        const index = hiddenCols.indexOf(colRef);
        if (index > -1)
            hiddenCols.splice(index, 1);
    } else {
        hiddenCols.push(colRef);
    }
    console.log(hiddenCols)
});

$(".formColumns").submit( function(e) {
    e.preventDefault();
    e.stopPropagation();

    if(tableRef=="tbMeds"){
        hiddenColsMeds = hiddenCols;
        // hiddenCols = []
    } else if(tableRef=="tbShow"){
        hiddenColsShow = hiddenCols;
    } else {
        hiddenColsAdd = hiddenCols;
    }

    tableRef = this.id.split("_")[1];
    $("#modalColumns_"+tableRef).modal("hide");
});