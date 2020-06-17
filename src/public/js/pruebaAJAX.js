$( document ).ready( ()=> {

    $("#btnRefresh").on('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/meds/get');
        xhttp.onload = function(){
            var newData = xhttp.responseText;
            newData = JSON.parse(newData);
            // res.render('../views/medicine/list.hbs', {meds: newData});

            // $.post('http://localhost:4000/meds/show', {'newData': newData})

            let html = "";

            for(let i=0; i<newData.length; i++) {
                let med = newData[i];
                html += `
                <tr>
                    <td>`+med.SustanciaActiva+`</td>
                    <td>`+med.Nombre+`</td>
                    <td>`+med.Saldo+`</td>
                    <td>`+med.P_Publico+`</td>
                    <td>`+med.Descuento+`</td>
                    <td>`+med.Caducidad+`</td> <!--Just a sample format-->
                    <td><a href="/meds/edit/`+med.MedicamentoID+`" class="text-primary">Editar</a></td>
                    <td><a href="/meds/delete/`+med.MedicamentoID+`" class="text-danger">Eliminar</a></td>
                </tr>
                `;
            }
            $("tbody").html(html);
            
        };
        xhttp.send();
    });
});