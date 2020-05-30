/*Constants*/
const express = require('express');
const morgan = require('morgan');
const exhbs = require('express-handlebars');
const path = require('path');

/*Initialization*/
const app = express(); //Ejecute Express with 'express()' and store it int 'app' variable

/*Settings*/
app.set('port', process.env.PORT || 4000); //If the server is in cloudStorage or not
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs ({
    defaultLayout: 'main', //Main view. HBS knows the complete path
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs', //Custom extension for .handlebars
    helpers: require('./lib/handlebars'),
}));
app.set('view angine', '.hbs'); //Turn on the engine

/*Middlewares */
//Middlwares are execute when the app client send requests to server 
app.use(morgan('dev')); // 'dev' is a specific format to display logs
app.use(express.urlencoded({extended: false})); // Accept data in forms
//extended: false - takes simpledate like string (no img, no jsons)
app.use(express.json()); // To enable json, which is neccesary when client-server requests


//Global variables
//Accesibles through any page
app.use((req, res, next) => {
    next();
});


//Routes
app.use(require('./routes/index.js')); //Sample file
app.use('/meds/', require('./routes/medicine.js')); //'meds' prefix to access 'medicine' routes

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Starting Server
app.listen(app.get('port'), ()=> {
    console.log('Server on port', app.get('port'));
});