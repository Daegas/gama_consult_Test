function updatePDescuneto(){
    let P_Publico = $("#iPPublico").val();
    let Descuento = $("#iDescuento").val();
    let P_Descuento;
    
    if (Descuento > 0.0){
        P_Descuento = P_Publico - (P_Publico * Descuento);
    } else {
        P_Descuento = P_Publico;
    }

    $("#iPDescuento").val(P_Descuento);
}

$(document).on('keyup', "#iPPublico", function() {
    updatePDescuneto();
});

$(document).on('keyup', "#iDescuento", function() {
    updatePDescuneto();
});

/* Opcional */
function priceBinding(){
    let P_Publico = $("#iPPublico").val();
    let P_Descuento = $("#iPDescuento").val();
    if (P_Publico == 0.00){
        console.log('true')
        // $("#iPPublico").val(P_Descuento);
    }
}