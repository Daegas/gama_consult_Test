const express = require('express');
const router = express.Router();

const DB = require('../database');

const { loggedEnable } = require('../lib/session'); //User restrictions
//Server-Side Datatables
const NodeTable = require('nodetable');

/**************************** VIEWS *******************************************/

router.get('/', async (req, res) => {
    res.render('../views/medicine/inventory.hbs');
});

router.get('/getMed/:id', async (req, res) => {
    const { id } = req.params;
    const med = await DB.query('SELECT * FROM Medicamentos WHERE MedicamentoID = ?', [id]);

    res.send({med: med[0]});
});

router.get('/entries', (req, res) => { //Here 'get' method can be understood as -getting a view- through an URL
    res.render('../views/medicine/entries.hbs');
});

router.get('/exits', (req, res) => { //Here 'get' method can be understood as -getting a view- through an URL
    res.render('../views/medicine/exits.hbs');
});

/**************************** CRUD *******************************************/


/**************** CREATE ****************/
router.post('/add', async (req, res) => { //Same URL as previous but with POST method.
    const { 
        SustanciaActiva, Nombre, 
        Saldo, Presentacion, 
        P_Proveedor, P_Publico, 
        P_Descuento, Descuento,
        Gramaje, DosisMG,
        Laboratorio, Proveedor,
        Caducidad, Activo} = req.body;

    const newMed = {
        SustanciaActiva, Nombre,
        Saldo, Presentacion,
        P_Proveedor, P_Publico,
        P_Descuento, Descuento,
        Gramaje, DosisMG,
        Laboratorio, Proveedor,
        Caducidad, Activo
    }; 

    //Async request
    //Meaning that next DB.query will take some time, and until that task has finished 'res.send' will get execute
    //We need to add 'await' to the Async request and 'async' to the main function
    try {
        let response = await DB.query('INSERT INTO Medicamentos set ?', [newMed]); 
        res.status(200).send(response);
    } catch(e){
        res.status(500).send(e);
    }
    // req.flash('success', 'Medicine saved successfully');
});

/**************** READ ****************/
// router.get('/get', async (req, res) => {
//     const meds = await DB.query('SELECT * FROM Medicamentos');
//     res.send({data:meds})
// });

//Datatables Server-Side
//https://newcodingera.com/datatables-server-side-processing-using-nodejs-mysql/
router.get('/get-dt', (req,res,next)=> {
    //Query de Datatables
    const requestQuery = req.query;
    //
    let columnsMap = [
        {
            db: "MedicamentoID",
            dt: 0
          },
        {
          db: "SustanciaActiva",
          dt: 1
        },
        {
          db: "Nombre",
          dt: 2
        }, 
        {
          db: "Saldo",
          dt: 3
        },
        {
          db: "Presentacion",
          dt: 4
        },
        {
          db: "P_Proveedor",
          dt: 5
        },
        {
            db: "P_Publico",
            dt: 6
        },
        {
            db: "Descuento",
            dt: 7
        },
        {
            db: "Caducidad",
            dt: 8
        },
        {
            db: "MedicamentoID",
            dt: 9
        },
        {
            db: "MedicamentoID",
            dt: 10
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



/**************** UPDATE ****************/


router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;

    const { 
        SustanciaActiva, Nombre, 
        Saldo, Presentacion, 
        P_Proveedor, P_Publico, 
        P_Descuento, Descuento,
        Gramaje, DosisMG,
        Laboratorio, Proveedor,
        Caducidad, Activo } = req.body;

    const alter_med = {
        SustanciaActiva, Nombre,
        Saldo, Presentacion,
        P_Proveedor, P_Publico,
        P_Descuento, Descuento,
        Gramaje, DosisMG,
        Laboratorio, Proveedor,
        Caducidad, Activo
    }; 

    try{
        let response = await DB.query('UPDATE Medicamentos set ? WHERE MedicamentoID = ?', [alter_med, id]);
        res.status(200).send(response);
    } catch(e){
        res.status(500).send(e);
    }
    // req.flash('success', 'Med updated successfully');
    res.send('OK').status(200);
});

/**************** DELETE ****************/
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try{
        let response = await DB.query('DELETE FROM Medicamentos WHERE MedicamentoID = ?', [id]);
        res.status(200).send(response);
    } catch(e) {
        res.status(500).send(e);
    }
    // req.flash('success', 'Med Removed successfully');
});



module.exports = router;