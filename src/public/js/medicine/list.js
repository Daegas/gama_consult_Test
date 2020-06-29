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
        dom: '<"top row" l <"toolbar mx-auto"> frt><"bottom"ip>', //Se agrega clase 'toolbar' a la plantilla
        fnInitComplete: function(){ //Función para desplegar contenido en div.toolbar
            html = `
            <button class="btn btn-dark rounded">
            <a href="/meds/add"><i class="fa fa-plus-circle"></i> Nuevo</a>
            </button>
            `;
           $('div.toolbar').html(html);
        },
        "paging":   true,
        "ordering": true,
        "info":     true,
        "autoWidth": false,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"          
         },
        "language": {   
            "info": "Medicamentos _START_-_END_/_TOTAL_ "        
         },
        "ajax": "meds/get",
        "columns":[
            {"data": "SustanciaActiva"},
            {"data": "Nombre"},
            {"data": "Saldo"},
            {"data": "Presentacion"},
            {"data": "P_Proveedor"},
            {"data": "P_Publico"},
            {"data": "Descuento"},
            {"data": "Caducidad",
                "render": function(data,  type, row, meta) {
                    let formatDate = data.split("T")[0];
                    let html = `<span class="render-timeago">${formatDate}</span>`;
                    return html;
                }
            },
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
    } );
 });