function editForm( med ) {

    let activo = med.Activo ? 
    '<input id="active" type="checkbox" name="Activo" value="1" checked>' :
    '<input id="active" type="checkbox" name="Activo" value="0">';

    let html = 
    `
    <form action="/meds/edit/`+ med.MedicamentoID +`" method="POST"> 
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="text" class="form-control" name="SustanciaActiva"
                        placeholder="Sustancia Activa" title="Sustancia Activa"
                        value=" `+ med.SustanciaActiva +` ">
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="text" class="form-control" name="Nombre" placeholder="Nombre" title="Nombre"
                    value=" `+ med.Nombre +` ">
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" class="form-control" name="Saldo" placeholder="Saldo" title="Saldo"
                    value= `+ med.Saldo +` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="text" class="form-control" name="Presentacion" title="Presentación"
                        placeholder="Presentación" value=" `+ med.Presentacion +` ">
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" name="P_Proveedor" title="$ Proveedor"
                        placeholder="$ Proveedor" value= `+ med.P_Proveedor +` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" name="P_Publico" title="$ Publico"
                        placeholder="$ Público" value= `+ med.P_Publico +` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" name="P_Descuento" title="$ Descuento"
                        placeholder="$ Descuento" value= `+ med.P_Descuento +` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <div class="align-center">
                        `+ activo +`
                        <label for="Activo">Activo</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <button class="btn btn-primary btn-block">Save</button>
        </div>
    </form>
    `;

    return html;
}

$(document).ready(function() {
    var table = $('#tbMeds').DataTable( {
        dom: '<"top row" l <"toolbar mx-auto mb-2"> frt><"bottom row" <"col-6 mx-auto"i> <"col-6 mx-auto"p>>', //Se agrega clase 'toolbar' a la plantilla
        fnInitComplete: function(){ //Función para desplegar contenido (Botón 'Nuevo') en div.toolbar
            html = `
            <button id="btnNuevo" class="btn btn-dark rounded">
                <i class="fa fa-plus-circle"></i> Nuevo
            </button>
            `;
           $('div.toolbar').html(html);
        },
        "paging":   true,
        "ordering": true,
        "info":     true,
        "autoWidth": false,
        "serverSide": true,
        "ajax": "/meds/get-dt",
        "language": { 
            "info": "Medicamentos _START_-_END_/_TOTAL_ ",
            "lengthMenu":     "Mostrar _MENU_ medicamentos",
            "sProcessing": "Procesando...",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfoEmpty": "Medicamentos 0/0",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Ordenar ascendente",
                "sSortDescending": ": Ordenar descendente"
            },
            "buttons": {
                "copy": "Copiar",
                "colvis": "Visibilidad"
            }
        },
        "columns": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {   //Edit button
                "data": null,
                "orderable":      false,
                "className":      'details-control',
                "render": function ( data, type, row, meta ) {
                    let html = `<i data-MedicamentoID=${data.MedicamentoID}
                    class="fa fa-pencil text-info pointer" title="Editar"></i>`;
                    return html;
                }
            },
            {   //Delete button
                "data": null,
                "orderable":    false,
                "render": function ( data, type, row, meta ) {
                    let html = `<a href="/meds/delete/${data.MedicamentoID}">
                                    <i class="fa fa-trash text-danger" title="Eliminar"></i>
                                </a>`;
                    return html;
                }
            }
        ]
    } );


    /* EDIT FORM */
    // Add event listener for opening and closing 'Edit form'
    $('#tbMeds tbody').on('click', 'td.details-control', function () {
        let this_ = $(this);
        var tr = this_.closest('tr');
        var row = table.row( tr );

        let iconElement = this_.find('i');
            
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            iconElement.attr('title','Editar').removeClass('fa-window-close').addClass('fa-pencil');
        }
        else {
            // Open this row
            let MedicamentoID = iconElement.attr('data-MedicamentoID');

            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/meds/edit/'+MedicamentoID);
            xhttp.onload = function(){
                var med = xhttp.responseText;
                med = JSON.parse(med);

                //Show data in a new row(child)
                row.child( editForm(med.med) ).show();
            };
            xhttp.send();

            iconElement.attr('title', 'Cancelar').removeClass('fa-pencil').addClass('fa-window-close');
        }
    });
});

var opcion;
$(document).on("click", "#btnNuevo", function() {
    opcion = 0;
    $(".modal-header").css("background-color", "#C0DE00");
    $(".modal-header").css("color", "white");
    $(".modal-title").text('Alta Medicamento');
    $("#modalCU").modal('show');
});