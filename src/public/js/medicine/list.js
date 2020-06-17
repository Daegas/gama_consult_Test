$(document).ready(function() {
    $('#example').DataTable( {
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
        "columns": [
            { "width": "20%" },
            null,
            null,
            null,
            null,
            null,
            { "width": "10%" },
            { "width": "10%" }
        ]
    } );
});