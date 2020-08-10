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

router.get('/get-addTable/:idList', (req,res,next)=> {
    //Query de Datatables
    const requestQuery = req.query;
    let { idList } = req.params;
    idList = JSON.parse(idList);
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
          db: "NombreComercial",
          dt: 2
        }, 
        {
            db: "Presentacion",
            dt: 3
        },
        {
            db: "Saldo",
            dt: 4
          },
          {
            db: "Saldo",
            dt: 5
          },
          
          {
              db: "Contenido",
              dt: 6
          },
          {
              db: "DosisMG",
              dt: 7
          },
          {
              db: "Laboratorio",
              dt: 8
          },
          {
              db: "Proveedor",
              dt: 9
          },
          {
            db: "P_Proveedor",
            dt: 10
          },
          {
              db: "P_Publico",
              dt: 11
          },
          {
              db: "Descuento",
              dt: 12
          },
          {
              db: "P_Descuento",
              dt: 13
          },
          {
              db: "Caducidad",
              dt: 14
          },
          {
              db: "MedicamentoID",
              dt: 15
          },
          {
              db: "MedicamentoID",
              dt: 16
          },
          {
            db: "Codigo",
            dt: 17
        }
      ];

    //Select table in DB - Or define any custum QUERY
    let query_ = ""
    idList.forEach( (id) => {
        query_ += id;
        if(id != idList[idList.length-1]){
            query_ += ', ';
        }
    });
    const query = "SELECT * FROM Medicamentos WHERE MedicamentoID IN (" + query_ + ")";

    //Primary Key (Required NodeTable)
    const primaryKey = "MedicamentoID"

    const nodeTable = new NodeTable(requestQuery,DB, query, primaryKey, columnsMap);

    nodeTable.output((err, data)=>{
        if (err) {
            console.log(err);
            return;
        }
        res.send(data)
    })
});

router.post('/entriesUpdate', async (req, res) => {
    let allEntries = JSON.parse(req.body["data_"]);
    let simpleEntries = allEntries[0];
    let fullEntries = allEntries[1];
    let isExit = allEntries[2];

    let simpleEntryTuple = "";
    let saldo, nuevoSaldo;

    let first = true;
    for(id in simpleEntries){
        if (!(id in fullEntries)){
            if(!first){
                simpleEntryTuple += ",";
            } else {
                first = false;
            }
    
            saldo = simpleEntries[id].split(',');
            nuevoSaldo = isExit? parseInt(saldo[1])-parseInt(saldo[0]) : parseInt(saldo[1])+parseInt(saldo[0]);
            simpleEntryTuple += "(" +id+ "," + nuevoSaldo + ")";
        }
    }

    let simple_query = "INSERT INTO Medicamentos (MedicamentoId, Saldo) VALUES " + 
                        simpleEntryTuple + 
                    " ON DUPLICATE KEY UPDATE Saldo = VALUES(Saldo)";

    let fullEntryTuple = "";
    first = true;
    for(id in fullEntries){
        if(!first){
            fullEntryTuple +=",";
        } else {
            first = false;
        }
        med = JSON.parse(fullEntries[id]);
        fullEntryTuple += "(" + id + "," + med.Saldo + "," + med.P_Proveedor + "," + med.P_Publico +
                        "," + med.P_Descuento + "," + med.Descuento + ",'" + med.Caducidad + "'," + med.Activo + "," + med.Codigo + ")" 
    }

    if(fullEntryTuple != "")
        full_query = "INSERT INTO Medicamentos (MedicamentoID, Saldo, P_Proveedor, P_Publico, P_Descuento," +
                    "Descuento, Caducidad, Activo) VALUES " + fullEntryTuple + " ON DUPLICATE KEY UPDATE " +
                    "Saldo = VALUES(Saldo), P_Proveedor = VALUES(P_Proveedor), P_Publico = VALUES(P_Publico), " +
                    "P_Descuento = VALUES(P_Descuento), Descuento = VALUES(Descuento), Caducidad = VALUES(Caducidad), "+
                    "Activo = VALUES(Activo), Codigo = VALUES(Codigo)";
    try{
        if(simpleEntryTuple != ""){
            response = await DB.query(simple_query);
        }
        if(fullEntryTuple != ""){
            response = await DB.query(full_query);
        }
        res.status(200).send(response);
    } catch(e){
        res.status(500).send(e);
    }
});
/**************************** CRUD *******************************************/


/**************** CREATE ****************/
router.post('/add', async (req, res) => { //Same URL as previous but with POST method.
    const { 
        SustanciaActiva, NombreComercial, 
        Saldo, Presentacion, 
        P_Proveedor, P_Publico, 
        P_Descuento, Descuento,
        Contenido, DosisMG,
        Laboratorio, Proveedor,
        Caducidad, Activo, Codigo} = req.body;

    const newMed = {
        SustanciaActiva, NombreComercial,
        Saldo, Presentacion,
        P_Proveedor, P_Publico,
        P_Descuento, Descuento,
        Contenido, DosisMG,
        Laboratorio, Proveedor,
        Caducidad, Activo, Codigo
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
//Datatables Server-Side
//https://newcodingera.com/datatables-server-side-processing-using-nodejs-mysql/
router.get('/get-dt/:isActive', (req,res,next)=> {
    //Query de Datatables
    const requestQuery = req.query;
    let { isActive } = req.params;
    isActive = JSON.parse(isActive);
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
          db: "NombreComercial",
          dt: 2
        }, 
        {
            db: "Presentacion",
            dt: 3
          },
        {
          db: "Saldo",
          dt: 4
        },
        {
            db: "Saldo",
            dt: 5
        },
        {
            db: "Contenido",
            dt: 6
        },
        {
            db: "DosisMG",
            dt: 7
        },
        {
            db: "Laboratorio",
            dt: 8
        },
        {
            db: "Proveedor",
            dt: 9
        },
        {
          db: "P_Proveedor",
          dt: 10
        },
        {
            db: "P_Publico",
            dt: 11
        },
        {
            db: "Descuento",
            dt: 12
        },
        {
            db: "P_Descuento",
            dt: 13
        },
        {
            db: "Caducidad",
            dt: 14
        },
        {
            db: "MedicamentoID",
            dt: 15
        },
        {
            db: "MedicamentoID",
            dt: 16
        },
        {
            db: "Codigo",
            dt: 17
        }
      ];

    //Select table in DB - Or define any custum QUERY
    const tableName = "Medicamentos"
    const query = "SELECT * FROM Medicamentos WHERE Activo = " + isActive;

    //Primary Key (Required NodeTable)
    const primaryKey = "MedicamentoID"

    const nodeTable = new NodeTable(requestQuery,DB, query, primaryKey, columnsMap);

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
        SustanciaActiva, NombreComercial, 
        Saldo, Presentacion, 
        P_Proveedor, P_Publico, 
        P_Descuento, Descuento,
        Contenido, DosisMG,
        Laboratorio, Proveedor,
        Caducidad, Activo, Codigo } = req.body;

    const alter_med = {
        SustanciaActiva, NombreComercial,
        Saldo, Presentacion,
        P_Proveedor, P_Publico,
        P_Descuento, Descuento,
        Contenido, DosisMG,
        Laboratorio, Proveedor,
        Caducidad, Activo, Codigo
    }; 

    try{
        let response = await DB.query('UPDATE Medicamentos set ? WHERE MedicamentoID = ?', [alter_med, id]);
        res.status(200).send(response);
    } catch(e){
        res.status(500).send(e);
    }
    // req.flash('success', 'Med updated successfully');
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