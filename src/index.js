/*Constants*/
const express = require('express');
const morgan = require('morgan');
const chalk = require ('chalk');
const exhbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const expsession = require('express-session');
const mysqlsession = require('express-mysql-session');
const passport = require('passport');

const ip = require('ip');

const { database } = require('../src/keysA');

/*Initialization*/
const app = express(); //Ejecute Express with 'express()' and store it int 'app' variable
require('./lib/passport');

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
//Color requests
const  morganChalk = morgan(function (tokens, req, res) {
    // get status color
    var status = tokens.status(req, res) >= 500 ? chalk.red(tokens.status(req, res))// red
        : tokens.status(req, res) >= 400 ? chalk.yellow(tokens.status(req, res)) // yellow
            : tokens.status(req, res) >= 300 ? chalk.cyan(tokens.status(req, res)) // cyan
                : tokens.status(req, res) >= 200 ? chalk.green(tokens.status(req, res)) // green
                    : 0; // no color
    var method = tokens.method(req, res) == "DELETE" ? chalk.red(tokens.method(req, res))// red
    : tokens.method(req, res) == "PUT" ? chalk.yellow(tokens.method(req, res)) // yellow
        : tokens.method(req, res) =="POST" ? chalk.cyan(tokens.method(req, res)) // cyan
            : tokens.method(req, res) == "GET" ? chalk.green(tokens.method(req, res)) // green
                : 0; // no color
    return [
        method,
        status,
        chalk.yellow(tokens['response-time'](req, res) + ' ms \t'),
        chalk.white(tokens.url(req, res).substr(1,25)),
    ].join(' ');
}); 

app.use(morganChalk); // 'dev' is a specific format to display logs
app.use(express.urlencoded({extended: false})); // Accept data in forms
//extended: false - takes simpledate like string (no img, no jsons)
app.use(express.json()); // To enable json, which is neccesary when client-server requests
app.use(expsession({
    secret: 'gama_consult_session',
    resave: false,
    saveUninitialized: false,
    store: new mysqlsession(database),
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Global variables
//Accesibles through any page
app.use((req, res, next) => {
    app.locals.MessageSuccess = req.flash('success');
    app.locals.MessageFailure = req.flash('failure');
    app.locals.user = req.user;
    next();
});



//Routes
app.use(require('./routes/index.js')); //Sample file
app.use('/meds/', require('./routes/medicine.js')); //'meds' prefix to access 'medicine' routes
app.use('/user/', require('./routes/user.js'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Starting Server
app.listen(app.get('port'), ()=> {
    console.log('Server on port', app.get('port'));
    console.log('IP ADDRESS: ', ip.address());
});