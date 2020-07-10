/**************************** FUNCTIONS *******************************************/
function updatePDescuneto(){
    let P_Publico = $("#iPPublico").val();
    let Descuento = $("#iDescuento").val();
    let P_Descuento;
    
    if (Descuento > 0.0){
        P_Descuento = P_Publico - (P_Publico * (Descuento/100));
    } else {
        P_Descuento = P_Publico;
    }

    $("#iPDescuento").val(P_Descuento);
}

/**************************** OPTIONAL *******************************************/
function priceBinding(){
    let P_Publico = $("#iPPublico").val();
    let P_Descuento = $("#iPDescuento").val();
    if (P_Publico == 0.00){
        $("#iPPublico").val(P_Descuento);
    }
}

/**************************** DOM RESPONSES *******************************************/
$("#formMeds").submit(function (e) {
    e.preventDefault();

    let opc = $(".modal-option").val();
    var quantity = parseInt($.trim($("#iQuantity").val()));

    SustanciaActiva = $.trim($("#iSustanciaActiva").val());
    Nombre = $.trim($("#iNombre").val());
    if(quantity){
        Saldo = (quantity + parseInt($.trim($("#iSaldo").val()))).toString();
    } else {
        Saldo = $.trim($("#iSaldo").val());
    }
    Presentacion = $.trim($("#iPresentacion").val());
    P_Proveedor = $.trim($("#iPProveedor").val());
    P_Publico = $.trim($("#iPPublico").val());
    P_Descuento = $.trim($("#iPDescuento").val());
    Descuento = $.trim($("#iDescuento").val());
    Gramaje = $.trim($("#iGramaje").val());
    DosisMG = $.trim($("#iDosis").val());
    Laboratorio = $.trim($("#iLaboratorio").val());
    Proveedor = $.trim($("#iProveedor").val());
    Activo = $("#ckActive").prop('checked');
    Caducidad = $.trim($("#iCaducidad").val());

    //Parse Not String values
    Descuento = Descuento == "" ? "0.0" : Descuento;
    Activo = Activo ? "1" : "0";
    Caducidad = Caducidad == "" ? "0000-00-00" : Caducidad;

    let url_ = opc == -1 ? "/meds/add" : "/meds/edit/" + opc;

    $.ajax({
        url: url_,
        type: "POST",
        datatype: "json",
        data: {
            SustanciaActiva, Nombre,
            Saldo, Presentacion,
            P_Proveedor, P_Publico,
            P_Descuento, Descuento,
            Gramaje, DosisMG,
            Laboratorio, Proveedor,
            Caducidad, Activo
        },
        success: function (res) {
            // req.flash('success', 'Med updated successfully');
            let message = opc == -1 ? " AGREGADO " : " EDITADO ";
            messageModal($("#modalMessageSuccess"), true, message);  
            if(quantity){
                reloadEntry(opc, false);
            } else {
                reloadAJAX();
            }
            
        },
        error: function(res){
            let message = res.responseJSON.code + '\n' + res.responseJSON.sqlMessage;
            messageModal($("#modalMessageError"), false, message);
        }
    });
    $('#modalCU').modal('hide');
});

$(document).on('keyup', "#iPPublico", function() {
    updatePDescuneto();
});

$(document).on('keyup', "#iDescuento", function() {
    updatePDescuneto();
});