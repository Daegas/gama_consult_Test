const express = require('express');
const router = express.Router();

const DB = require('../database');

/* 
CRUD
*/

/* CREATE */
router.get('/add', (req, res) => { //Here 'get' method can be understood as -getting a view- through an URL
    res.render('../views/medicine/add.hbs');
});

router.post('/add', (req, res) => { //Same URL as previous but with POST method. Is execute when user sends the add.hbs form
    res.send('listo');
});

/* READ */
router.get('/', async (req, res) => {
    const meds = await DB.query('SELECT * FROM Medicamentos WHERE MedicamentoID<11');
    console.log(meds);
    res.render('../views/medicine/list.hbs', {meds});
});

module.exports = router;