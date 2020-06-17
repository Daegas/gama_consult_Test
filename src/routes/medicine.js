const express = require('express');
const router = express.Router();

const DB = require('../database');

const { loggedEnable } = require('../lib/session'); //User restrictions

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
        Activo
    }; 

    //Async request
    //Meaning that next DB.query will take some time, and until that task has finished 'res.send' will get execute
    //We need to add 'await' to the Async request and 'async' to the main function
    await DB.query('INSERT INTO Medicamentos set ?', [newMed]); 
    req.flash('success', 'Medicine saved successfully');
    res.redirect('/meds');
});

/* READ */
router.get('/', async (req, res) => {
    const meds = await DB.query('SELECT * FROM Medicamentos WHERE MedicamentoID>710');
    res.render('../views/medicine/list.hbs', {meds});
});

/* UPDATE */
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const med = await DB.query('SELECT * FROM Medicamentos WHERE MedicamentoID = ?', [id]);
    res.render('../views/medicine/edit.hbs', {med: med[0]});
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
        Activo
    }

    await DB.query('UPDATE Medicamentos set ? WHERE MedicamentoID = 722', [alter_med, id]);
    req.flash('success', 'Med updated successfully');
    res.redirect('/meds');
});

/* DELETE */
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await DB.query('DELETE FROM Medicamentos WHERE MedicamentoID = ?', [id]);
    req.flash('success', 'Med Removed successfully');
    res.redirect('/meds');
});



module.exports = router;