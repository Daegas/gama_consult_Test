/**************************** FUNCTIONS *******************************************/
function updatePDescuneto() {
    let P_Publico = $("#iPPublico").val();
    let Descuento = $("#iDescuento").val();
    let P_Descuento;

    if (Descuento > 0.0) {
        P_Descuento = P_Publico - (P_Publico * (Descuento / 100.0));
        //Round to two decimals
        P_Descuento = Math.round(P_Descuento * 100) / 100;
    } else {
        P_Descuento = P_Publico;
    }

    $("#iPDescuento").val(P_Descuento);
}

function toUpperEach(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function(word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
     }

/**************************** OPTIONAL *******************************************/
function priceBinding() {
    let P_Publico = $("#iPPublico").val();
    let P_Descuento = $("#iPDescuento").val();
    if (P_Publico == 0.00) {
        $("#iPPublico").val(P_Descuento);
    }
}

/**************************** DOM RESPONSES *******************************************/
$("#formMeds").submit(function (e) {
    e.preventDefault();
    e.stopPropagation();

    let opc = $(".modal-option").val();
    var quantity = parseInt($.trim($("#iQuantity").val()));
    var saldo_ = $.trim($("#iSaldo").val())

    SustanciaActiva = $.trim($("#iSustanciaActiva").val());
    NombreComercial = $.trim($("#iNombreComercial").val());
    if (quantity) {
        Saldo = (quantity + parseInt(saldo_)).toString();
    } else {
        Saldo = saldo_;
    }
    Presentacion = $.trim($("#iPresentacion").val());
    P_Proveedor = $.trim($("#iPProveedor").val());
    P_Publico = $.trim($("#iPPublico").val());
    P_Descuento = $.trim($("#iPDescuento").val());
    Descuento = $.trim($("#iDescuento").val());
    Contenido = $.trim($("#iContenido").val());
    DosisMG = $.trim($("#iDosis").val());
    Laboratorio = $.trim($("#iLaboratorio").val());
    Proveedor = $.trim($("#iProveedor").val());
    Codigo = $.trim($("#iCodigo").val());
    Activo = $("#ckActivo").prop('checked');
    Caducidad = $.trim($("#iCaducidad").val());

    //Parse Not String values
    Saldo = Saldo == "" ? "0" : Saldo;
    Descuento = Descuento == "" ? "0.0" : Descuento;
    Activo = Activo ? "1" : "0";
    Caducidad = Caducidad == "" ? "0000-00-00" : Caducidad;

    //Adjust Data
    SustanciaActiva= SustanciaActiva.toUpperCase();
    NombreComercial= toUpperEach(NombreComercial);
    Proveedor = toUpperEach(Proveedor);
    if(Presentacion){
        Presentacion = toUpperEach(Presentacion);
    };
    if (Laboratorio){
        Laboratorio = toUpperEach(Laboratorio);
    };

    let url_ = opc == -1 ? "/meds/add" : "/meds/edit/" + opc;
    let data_ = {
        SustanciaActiva, NombreComercial,
        Saldo, Presentacion,
        P_Proveedor, P_Publico,
        P_Descuento, Descuento,
        Contenido, DosisMG,
        Laboratorio, Proveedor,
        Caducidad, Activo, Codigo
    }

    if (quantity) {
        localEntryUpdate(opc, data_, quantity, saldo_);
    } else {
        $.ajax({
            url: url_,
            type: "POST",
            datatype: "json",
            data: data_,
            success: function (res) {
                // req.flash('success', 'Med updated successfully');
                let message = opc == -1 ? " AGREGADO " : " EDITADO ";
                messageModal($("#modalMessageSuccess"), true, message);
                reloadInventoryTable();
            },
            error: function (res) {
                let message = res.responseJSON.code + '\n' + res.responseJSON.sqlMessage;
                messageModal($("#modalMessageError"), false, message);
            }
        });
    }
    $('#modalCU').modal('hide');
});

/******** UpdateDescuento ********/

$(document).on('click', "#iPPublico", function () {
    updatePDescuneto();
});

$(document).on('keyup', "#iPPublico", function () {
    if ($("#iPPublico").focus()){
        updatePDescuneto();
    };
});

$(document).on('click', "#iDescuento", function () {
    updatePDescuneto();
});

$(document).on('keyup', "#iDescuento", function () {
    if ($("#iDescuento").focus()){
        updatePDescuneto();
    };
});
