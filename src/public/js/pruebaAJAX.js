$( document ).ready( ()=> {

    $("#btnRefresh").on('click', function(e){
        $.ajax({
            url:'/meds/get',
            success:function(meds){
                let tbody=$('tbody');
                tbody.html('');
                meds.forEach(med => {
                    tbody.append(`
                        <tr>
                        <td>${med.SustanciaActiva}</td>
                        <td>${med.Nombre}</td>
                        <td>${med.Saldo}</td>
                        <td>${med.P_Publico}</td>
                        <td>${med.Descuento}</td>
                        <td>timeago${med.Caducidad}</td> 
                        <td><a href="/meds/edit/${this.MedicamentoID}"><i class="fa fa-pencil text-info"></i></a></td>
                        <td><a href="/meds/delete/${this.MedicamentoID}"><i class="fa fa-trash text-danger"></i></a></td>
                        </tr>      
                    `)
                })

            }
        })
    });
});