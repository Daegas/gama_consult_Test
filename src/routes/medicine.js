const express = require('express');
const router = express.Router();

const DB = require('../database');

const { loggedEnable } = require('../lib/session'); //User restrictions
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//Server-Side Datatables
const NodeTable = require('nodetable');

/* 
CRUD
*/

/* CREATE */
router.get('/add', (req, res) => { //Here 'get' method can be understood as -getting a view- through an URL
    res.render('../views/medicine/add.hbs');
});

router.post('/add', async (req, res) => { //Same URL as previous but with POST method. Is execute when user sends the add.hbs form
    const { SustanciaActiva, Nombre, Presentacion, P_Proveedor, P_Publico, P_Descuento, Saldo, Activo } = req.body;

    const newMed = {
        SustanciaActiva,
        Nombre,
        Presentacion,
        P_Proveedor,
        P_Publico,
        P_Descuento,
        Saldo,
        Activo: Activo==undefined? "0":"1"
    }; 

    //Async request
    //Meaning that next DB.query will take some time, and until that task has finished 'res.send' will get execute
    //We need to add 'await' to the Async request and 'async' to the main function
    await DB.query('INSERT INTO Medicamentos set ?', [newMed]); 
    req.flash('success', 'Medicine saved successfully');
    res.send('OK').status(200);
});

/* READ */
router.get('/get', async (req, res) => {
    const meds = await DB.query('SELECT * FROM Medicamentos');
    res.send({data:meds})
});

//Datatables Server-Side
//https://newcodingera.com/datatables-server-side-processing-using-nodejs-mysql/
router.get('/get-dt', (req,res,next)=> {
    //Query de Datatables
    const requestQuery = req.query;
    //
    let columnsMap = [
        {
          db: "SustanciaActiva",
          dt: 0
        },
        {
          db: "Nombre",
          dt: 1
        }, 
        {
          db: "Saldo",
          dt: 2
        },
        {
          db: "Presentacion",
          dt: 3
        },
        {
          db: "P_Proveedor",
          dt: 4
        },
        {
            db: "P_Publico",
            dt: 5
        },
        {
            db: "Descuento",
            dt: 6
        },
        {
            db: "Caducidad",
            dt: 7
        },
        {
            db: "MedicamentoID",
            dt: 8
        },
        {
            db: "MedicamentoID",
            dt: 9
        }
      ];

    //Select table in DB - Or define any custum QUERY
    const tableName = "Medicamentos"

    //Primary Key (Required NodeTable)
    const primaryKey = "MedicamentoID"

    const nodeTable = new NodeTable(requestQuery,DB, tableName, primaryKey, columnsMap);

    nodeTable.output((err, data)=>{
        if (err) {
            console.log(err);
            return;
        }

        res.send(data)
    })
});


router.get('/getAJAX', (req, res) => {
    console.log('on Get AJAX')

    setInterval( function() {
        console.log('setInterval')
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                var meds = xhttp.responseText;
                meds = JSON.parse(meds);
                res.render('../views/medicine/list.hbs', {meds});
            }
        }

        xhttp.open('GET', 'http://localhost:4000/meds/get', true);
        xhttp.send();
    }, 5000);
});

router.get('/', async (req, res) => {
    const meds = await DB.query('SELECT * FROM Medicamentos WHERE MedicamentoID>710');
    res.render('../views/medicine/list.hbs', {meds});
});

/* UPDATE */
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const med = await DB.query('SELECT * FROM Medicamentos WHERE MedicamentoID = ?', [id]);

    res.send({med: med[0]});
    // res.render('../views/medicine/edit.hbs', {med: med[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { SustanciaActiva, Nombre, Presentacion, P_Proveedor, P_Publico, P_Descuento, Saldo, Activo } = req.body;

    const alter_med = {
        SustanciaActiva,
        Nombre, 
        Presentacion, 
        P_Proveedor,
        P_Publico,
        P_Descuento,
        Saldo,
        Activo: Activo==undefined? "0":"1"
    }

    await DB.query('UPDATE Medicamentos set ? WHERE MedicamentoID = ?', [alter_med, id]);
    req.flash('success', 'Med updated successfully');
    res.send('OK').status(200);
});

/* DELETE */
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await DB.query('DELETE FROM Medicamentos WHERE MedicamentoID = ?', [id]);
    req.flash('success', 'Med Removed successfully');
    res.send('OK').status(200);
});



module.exports = router;